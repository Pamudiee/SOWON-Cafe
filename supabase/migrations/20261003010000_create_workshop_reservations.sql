-- Apply once in the intended Supabase project. Existing tables are not changed.
begin;

create table public.workshop_reservations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  workshop_name text not null
    constraint workshop_reservations_workshop_not_blank check (workshop_name ~ '[^[:space:]]'),
  customer_name varchar(80) not null
    constraint workshop_reservations_name_not_blank check (customer_name ~ '[^[:space:]]'),
  email text not null
    constraint workshop_reservations_email_not_blank check (email ~ '[^[:space:]]'),
  guests integer not null
    constraint workshop_reservations_guests_positive check (guests > 0),
  price_per_person numeric(10, 2) not null
    constraint workshop_reservations_price_positive check (price_per_person > 0),
  total_price numeric(12, 2) not null
    constraint workshop_reservations_total_valid check (
      total_price > 0 and total_price = price_per_person * guests
    )
);

alter table public.workshop_reservations enable row level security;
revoke all privileges on table public.workshop_reservations
  from public, anon, authenticated;
grant usage on schema public to anon;
grant insert (workshop_name, customer_name, email, guests, price_per_person, total_price)
  on table public.workshop_reservations to anon;
create policy workshop_reservations_anon_insert
  on public.workshop_reservations
  for insert
  to anon
  with check (true);

-- No visitor SELECT, UPDATE, or DELETE grants/policies. Metadata is server-generated.
commit;
