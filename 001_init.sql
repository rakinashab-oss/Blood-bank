-- Blood Bank: schema, availability view, RLS
create extension if not exists pgcrypto;

create table public.app_settings (
  id int primary key default 1 check (id = 1),
  donation_interval_days int not null default 90 check (donation_interval_days > 0),
  updated_at timestamptz not null default now()
);
insert into public.app_settings (id) values (1);

create table public.admin_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique not null references auth.users(id) on delete cascade,
  username text unique not null,
  role text not null default 'admin',
  must_change_password boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.donors (
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

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
create trigger donors_touch before update on public.donors
for each row execute function public.touch_updated_at();

-- Status is never stored: computed on every read using the Bangladesh date.
create or replace view public.donors_public
with (security_invoker = false) as
select d.id, d.full_name, d.phone_number, d.blood_group, d.last_donation_date,
       d.comments,
       (d.last_donation_date + s.donation_interval_days) as next_eligible_date,
       greatest(0, (d.last_donation_date + s.donation_interval_days)
                   - (now() at time zone 'Asia/Dhaka')::date) as days_remaining,
       ((d.last_donation_date + s.donation_interval_days)
          <= (now() at time zone 'Asia/Dhaka')::date) as is_available
from public.donors d cross join public.app_settings s
where d.is_public;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_profiles where auth_user_id = auth.uid());
$$;

alter table public.donors enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.app_settings enable row level security;

grant select on public.donors_public to anon, authenticated;
revoke all on public.donors from anon;

create policy donors_admin_all on public.donors for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy settings_read on public.app_settings for select using (true);
create policy settings_admin_write on public.app_settings for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy profile_self_read on public.admin_profiles for select to authenticated
  using (auth_user_id = auth.uid());
create policy profile_self_update on public.admin_profiles for update to authenticated
  using (auth_user_id = auth.uid()) with check (auth_user_id = auth.uid());
