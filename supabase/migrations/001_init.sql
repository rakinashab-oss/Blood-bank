-- ==============================================================================
-- BLOOD BANK — PRODUCTION DATABASE SCHEMA & RLS MIGRATION
-- Project: Blood Bank
-- Tagline: Donate Blood, Save Lives.
-- Lead Developer: Rakin Ashab
-- Default Donation Interval: 90 Days
-- ==============================================================================

-- 1. Enable Cryptographic Functions
create extension if not exists pgcrypto;

-- 2. Application Settings Table (Configurable 90-day donation interval)
create table if not exists public.app_settings (
  id int primary key default 1 check (id = 1),
  donation_interval_days int not null default 90 check (donation_interval_days > 0),
  updated_at timestamptz not null default now()
);

-- Insert singleton setting row if not already present
insert into public.app_settings (id, donation_interval_days) 
values (1, 90)
on conflict (id) do nothing;

-- 3. Administrator Profiles Table (10 Predefined Admins)
create table if not exists public.admin_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique not null references auth.users(id) on delete cascade,
  username text unique not null,
  role text not null default 'admin',
  must_change_password boolean not null default true,
  created_at timestamptz not null default now()
);

-- 4. Blood Donors Table
create table if not exists public.donors (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (length(trim(full_name)) > 0),
  phone_number text not null check (phone_number ~ '^01[3-9][0-9]{8}$'),
  blood_group text not null check (blood_group in ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
  last_donation_date date not null,
  comments text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  unique (phone_number)
);

-- 5. Automatic Touch Updated_at Trigger
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ 
begin 
  new.updated_at = now(); 
  return new; 
end $$;

drop trigger if exists donors_touch on public.donors;
create trigger donors_touch before update on public.donors
for each row execute function public.touch_updated_at();

-- 6. Dynamic Public Donors View with Bangladesh Timezone (Asia/Dhaka)
-- Availability status is NEVER statically stored: computed dynamically on every read
-- formula: Next Eligible Donation Date = Last Donation Date + Interval (90 Days)
-- Days remaining = max(0, Next Eligible Date - Current Date in Asia/Dhaka)
-- Available = Days remaining == 0
create or replace view public.donors_public
with (security_invoker = false) as
select 
  d.id, 
  d.full_name, 
  d.phone_number, 
  d.blood_group, 
  d.last_donation_date,
  d.comments,
  (d.last_donation_date + s.donation_interval_days) as next_eligible_date,
  greatest(0, (d.last_donation_date + s.donation_interval_days) - (now() at time zone 'Asia/Dhaka')::date) as days_remaining,
  ((d.last_donation_date + s.donation_interval_days) <= (now() at time zone 'Asia/Dhaka')::date) as is_available
from public.donors d 
cross join public.app_settings s
where d.is_public;

-- 7. Security Definer Helper for RLS Admin Verification
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_profiles where auth_user_id = auth.uid());
$$;

-- 8. Row Level Security (RLS) Configuration
alter table public.donors enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.app_settings enable row level security;

-- Grant public read access to the dynamic availability view
grant select on public.donors_public to anon, authenticated;
revoke all on public.donors from anon;

-- Donors Table Policies (Public reads view; Admins have full CRUD)
drop policy if exists donors_admin_all on public.donors;
create policy donors_admin_all on public.donors for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- App Settings Policies (Anyone can read interval; Admin can update)
drop policy if exists settings_read on public.app_settings;
create policy settings_read on public.app_settings for select using (true);

drop policy if exists settings_admin_write on public.app_settings;
create policy settings_admin_write on public.app_settings for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Admin Profiles Policies
drop policy if exists profile_self_read on public.admin_profiles;
create policy profile_self_read on public.admin_profiles for select to authenticated
  using (auth_user_id = auth.uid());

drop policy if exists profile_self_update on public.admin_profiles;
create policy profile_self_update on public.admin_profiles for update to authenticated
  using (auth_user_id = auth.uid()) with check (auth_user_id = auth.uid());
