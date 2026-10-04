-- Database foundation only. Review and apply manually as the database owner.
-- Do not rerun earlier migrations. No admin accounts are provisioned here.
begin;

-- Serialize this change and inspect the policy baseline before granting reads.
lock table public.workshop_reservations in access exclusive mode;
do $$
begin
  if exists (
    select 1 from pg_catalog.pg_policy
    where polrelid = 'public.workshop_reservations'::regclass
      and polname <> 'workshop_reservations_anon_insert'
  ) then
    raise exception 'Unexpected reservation policies exist; review them before applying this migration';
  end if;
  if not exists (
    select 1 from pg_catalog.pg_policy   
    where polrelid = 'public.workshop_reservations'::regclass
      and polname = 'workshop_reservations_anon_insert'
      and polcmd = 'a' and polpermissive
      and polroles = array['anon'::regrole::oid]
      and polqual is null
      and pg_catalog.pg_get_expr(polwithcheck, polrelid) = 'true'
  ) then
    raise exception 'Expected original anonymous INSERT-only policy is missing or changed';
  end if;
end;
$$;

alter table public.workshop_reservations
  add column if not exists day text,
  add column if not exists time time without time zone,
  add column if not exists status text not null default 'pending';

-- Old rows receive pending when the status column is first added. Day/time
-- remain NULL: historical session details cannot be reconstructed reliably.
-- If status already exists, invalid/NULL values cause a safe transaction failure.
alter table public.workshop_reservations
  alter column status set default 'pending',
  alter column status set not null;

do $$
declare
  existing_constraint record;
begin
  -- IF NOT EXISTS on a column does not check its type or generation behavior.
  if exists (
    select 1 from pg_catalog.pg_attribute
    where attrelid = 'public.workshop_reservations'::regclass
      and attname in ('day', 'time', 'status') and not attisdropped
      and (atttypid <> case when attname = 'time' then 'time'::regtype
                           else 'text'::regtype end
           or attgenerated <> '' or attidentity <> '')
  ) then
    raise exception 'Existing day/time/status columns have incompatible definitions';
  end if;

  select contype, pg_catalog.pg_get_expr(conbin, conrelid) as expression
    into existing_constraint
    from pg_catalog.pg_constraint
    where conrelid = 'public.workshop_reservations'::regclass
      and conname = 'workshop_reservations_status_allowed';
  if found then
    -- Conservatively accept only the canonical expression created below.
    -- Equivalent but differently written checks require manual review too.
    if existing_constraint.contype <> 'c'
       or existing_constraint.expression is distinct from
          '(status = ANY (ARRAY[''pending''::text, ''confirmed''::text, ''cancelled''::text]))'
    then
      raise exception 'Existing status constraint differs from the expected allowed-values check';
    end if;
  else
    alter table public.workshop_reservations
      add constraint workshop_reservations_status_allowed
        check (status in ('pending', 'confirmed', 'cancelled'));
  end if;
end;
$$;
alter table public.workshop_reservations
  validate constraint workshop_reservations_status_allowed;

-- A dedicated schema, outside the exposed public API schema. Fail on a name
-- collision rather than reuse an unknown schema/table/function configuration.
create schema sowon_private;
revoke all on schema sowon_private from public, anon, authenticated;
grant usage on schema sowon_private to authenticated;

create table sowon_private.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table sowon_private.admin_users enable row level security;
revoke all on table sowon_private.admin_users from public, anon, authenticated;
-- No client policies: only a trusted database administrator manages membership.

create function sowon_private.is_cafe_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from sowon_private.admin_users as admins
    where admins.user_id = (select auth.uid())
  );
$$;
-- Owned by the trusted migration executor, which can read the allowlist.
-- No caller-supplied user ID, dynamic SQL, or editable user metadata is used.
revoke all on function sowon_private.is_cafe_admin() from public, anon, authenticated;
grant execute on function sowon_private.is_cafe_admin() to authenticated;

alter table public.workshop_reservations enable row level security;

-- Reset table AND column grants: revoking table privileges alone does not
-- remove the column-level INSERT grants from the original migration.
revoke all privileges on table public.workshop_reservations
  from public, anon, authenticated;
do $$
declare
  reservation_columns text;
begin
  select string_agg(format('%I', attname), ', ' order by attnum)
    into reservation_columns
    from pg_catalog.pg_attribute
    where attrelid = 'public.workshop_reservations'::regclass
      and attnum > 0 and not attisdropped;
  execute format(
    'revoke all privileges (%s) on table public.workshop_reservations from public, anon, authenticated',
    reservation_columns
  );
end;
$$;

grant usage on schema public to anon, authenticated;
grant insert (workshop_name, customer_name, email, guests, price_per_person, total_price, day, time)
  on table public.workshop_reservations to anon;
-- Retain the existing workshop_reservations_anon_insert policy unchanged.
-- Status, id, and created_at are excluded: anonymous callers use defaults only.

grant select on table public.workshop_reservations to authenticated;
grant update (status) on table public.workshop_reservations to authenticated;

create policy workshop_reservations_admin_select
  on public.workshop_reservations
  for select to authenticated
  using ((select sowon_private.is_cafe_admin()));

create policy workshop_reservations_admin_update_status
  on public.workshop_reservations
  for update to authenticated
  using ((select sowon_private.is_cafe_admin()))
  with check ((select sowon_private.is_cafe_admin()));

-- No duplicate restrictive policies are needed for this verified baseline:
-- the only other policy is anon INSERT, which cannot authorize SELECT/UPDATE.
-- Future policy migrations must review the combined policies, since permissive
-- policies are ORed. Unknown policies cause this migration to fail up front.

-- No DELETE grants/policies for any website user, including admins.
-- Keep sowon_private out of Supabase's exposed schemas. Provision membership
-- separately through trusted SQL after creating the intended Supabase Auth user.
commit;
