-- Run this in the Supabase SQL editor (or `supabase db push`) after creating the project.
-- Tables

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'active' check (status in ('active', 'submitted', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists patients (
  session_id uuid primary key references sessions(id) on delete cascade,
  first_name text,
  middle_name text,
  last_name text,
  date_of_birth date,
  gender text,
  phone_number text,
  email text,
  address text,
  preferred_language text,
  nationality text,
  emergency_contact_name text,
  emergency_contact_relationship text,
  religion text,
  submitted_at timestamptz
);

-- keep sessions.updated_at fresh on any patients write for that session
create or replace function touch_session_updated_at()
returns trigger as $$
begin
  update sessions set updated_at = now() where id = new.session_id;
  return new;
end;
$$ language plpgsql;

drop trigger if exists patients_touch_session on patients;
create trigger patients_touch_session
  after insert or update on patients
  for each row execute function touch_session_updated_at();

-- Base grants — Supabase only auto-grants anon/authenticated on tables
-- created via the Table Editor UI, not via raw SQL. RLS policies alone are
-- not enough without these (a plain policy still 42501s without the grant).
grant usage on schema public to anon, authenticated;
grant select, insert, update on sessions to anon, authenticated;
grant select, insert, update on patients to anon, authenticated;

-- Row Level Security
-- Patient side is anonymous (no login) — a session_id is a bearer token: whoever
-- has the URL can insert/update that one row. This is why SELECT is restricted to
-- staff only; anon can write blind but never read back other sessions' data.

alter table sessions enable row level security;
alter table patients enable row level security;

create policy "anon can create sessions"
  on sessions for insert
  to anon
  with check (true);

create policy "anon can update own session by id"
  on sessions for update
  to anon
  using (true)
  with check (true);

create policy "staff can read all sessions"
  on sessions for select
  to authenticated
  using (true);

create policy "anon can create patient row for a session"
  on patients for insert
  to anon
  with check (true);

create policy "anon can update patient row for a session"
  on patients for update
  to anon
  using (true)
  with check (true);

create policy "staff can read all patients"
  on patients for select
  to authenticated
  using (true);

-- Realtime: broadcast is used for field updates (not table replication), but
-- Postgres Changes on `sessions` powers the staff dashboard live list.
alter publication supabase_realtime add table sessions;
