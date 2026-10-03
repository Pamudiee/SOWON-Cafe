-- Initial setup only. Apply once in the intended Supabase project.
-- Fail if the table already exists rather than changing an existing table.
begin;

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name varchar(80) not null
    constraint contact_messages_name_not_blank check (name ~ '[^[:space:]]'),
  email text not null
    constraint contact_messages_email_not_blank check (email ~ '[^[:space:]]'),
  subject text not null
    constraint contact_messages_subject_allowed check (
      subject in (
        'Visiting the café',
        'Creative workshops',
        'Personalized gifts',
        'Something else'
      )
    ),
  message varchar(2000) not null
    constraint contact_messages_message_not_blank check (message ~ '[^[:space:]]')
);

alter table public.contact_messages enable row level security;

-- Remove default client privileges before granting only the required access.
-- PUBLIC means every PostgreSQL role; it is not the public schema here.
revoke all privileges on table public.contact_messages
  from public, anon, authenticated;

grant usage on schema public to anon;
grant insert (name, email, subject, message)
  on table public.contact_messages to anon;

-- Constraints validate the submitted fields. Server defaults supply metadata;
-- anonymous callers cannot supply id or created_at via the column grant.
create policy contact_messages_anon_insert
  on public.contact_messages
  for insert
  to anon
  with check (true);

-- Intentionally no SELECT, UPDATE, or DELETE grants/policies for visitors.
commit;
