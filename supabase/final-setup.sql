-- Step 1: clear out the debug table from the isolation test.
drop table if exists sessions cascade;

-- Step 2: full real schema (same as schema.sql).
create table sessions (
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

grant usage on schema public to anon, authenticated;
grant select, insert, update on sessions to anon, authenticated;
grant select, insert, update on patients to anon, authenticated;

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

alter publication supabase_realtime add table sessions;
