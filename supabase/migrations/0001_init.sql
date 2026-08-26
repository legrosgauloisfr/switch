-- Switch — initial schema foundation.
-- NOT CONNECTED YET: the app currently runs on the `local` service implementations
-- (src/services/local/*, seeded from src/data/seed/*). This migration is the ready-to-run
-- foundation for the `supabase` implementations that will replace them later — see
-- src/services/index.ts, the single file that swap requires.
--
-- Run with: supabase db push  (after `supabase init` / linking a project)

-- ============================================================================
-- USER-OWNED DATA (RLS: a user can only read/write their own rows)
-- ============================================================================

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'Vous',
  started_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists onboarding_answers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  goal text,
  cigs_per_day int not null default 15,
  moments text[] not null default '{}',
  exp text,
  format text,
  simplicity text,
  budget text,
  flavors text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  trigger text,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade, -- null = broadcast to all users
  title text not null,
  body text not null,
  unread boolean not null default true,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table onboarding_answers enable row level security;
alter table journal_entries enable row level security;
alter table notifications enable row level security;

create policy "own profile" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own answers" on onboarding_answers for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own journal" on journal_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own or broadcast notifications" on notifications for select using (user_id is null or auth.uid() = user_id);

-- ============================================================================
-- CATALOG / CONTENT (RLS: public read for active+published rows; writes are
-- admin-only — the admin back-office (a later phase) will authenticate with a
-- service role or an `is_admin` claim checked here once that's designed)
-- ============================================================================

create table if not exists brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  active boolean not null default true
);

create table if not exists flavors (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  active boolean not null default true
);

create table if not exists devices (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references brands(id),
  category_id uuid references categories(id),
  name text not null,
  kind text not null,
  price_eur numeric(10, 2) not null,
  running_cost_label text,
  simplicity smallint not null check (simplicity between 1 and 5),
  autonomy smallint not null check (autonomy between 1 and 5),
  format_tag text not null check (format_tag in ('compact', 'standard', 'autonomous')),
  simplicity_tag text not null check (simplicity_tag in ('simple', 'customizable', 'unsure')),
  budget_tier text not null check (budget_tier in ('low', 'mid', 'mid-high', 'high')),
  description_short text,
  description_long text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists device_specs (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references devices(id) on delete cascade,
  key text not null,
  value text not null,
  sort_order int not null default 0
);

create table if not exists device_images (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references devices(id) on delete cascade,
  url text not null,
  is_primary boolean not null default false,
  sort_order int not null default 0
);

create table if not exists cartridges (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references devices(id) on delete cascade,
  name text not null,
  description text,
  active boolean not null default true
);

create table if not exists resistances (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references devices(id) on delete cascade,
  name text not null,
  ohm numeric(4, 2),
  description text,
  active boolean not null default true
);

create table if not exists accessories (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references brands(id),
  category_id uuid references categories(id),
  name text not null,
  description text,
  price_eur numeric(10, 2),
  active boolean not null default true
);

create table if not exists liquids (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references brands(id),
  name text not null,
  universe text not null, -- display group: Fruité / Frais / Gourmand / Classique / Boisson
  description_short text,
  description_long text,
  spec_hint text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists liquid_flavors (
  liquid_id uuid not null references liquids(id) on delete cascade,
  flavor_id uuid not null references flavors(id) on delete cascade,
  primary key (liquid_id, flavor_id)
);

create table if not exists liquid_images (
  id uuid primary key default gen_random_uuid(),
  liquid_id uuid not null references liquids(id) on delete cascade,
  url text not null,
  is_primary boolean not null default false,
  sort_order int not null default 0
);

create table if not exists tutorials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null, -- eyebrow label, e.g. "PRISE EN MAIN"
  duration_min int not null default 3,
  intro text,
  image_url text,
  video_url text,
  level text,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists tutorial_steps (
  id uuid primary key default gen_random_uuid(),
  tutorial_id uuid not null references tutorials(id) on delete cascade,
  n int not null,
  text text not null
);

create table if not exists faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  published boolean not null default true,
  sort_order int not null default 0
);

create table if not exists advice_items (
  id uuid primary key default gen_random_uuid(),
  tag text not null,
  text text not null,
  published boolean not null default true,
  sort_order int not null default 0
);

alter table brands enable row level security;
alter table categories enable row level security;
alter table flavors enable row level security;
alter table devices enable row level security;
alter table device_specs enable row level security;
alter table device_images enable row level security;
alter table cartridges enable row level security;
alter table resistances enable row level security;
alter table accessories enable row level security;
alter table liquids enable row level security;
alter table liquid_flavors enable row level security;
alter table liquid_images enable row level security;
alter table tutorials enable row level security;
alter table tutorial_steps enable row level security;
alter table faq_items enable row level security;
alter table advice_items enable row level security;

create policy "public read active brands" on brands for select using (active);
create policy "public read active categories" on categories for select using (active);
create policy "public read active flavors" on flavors for select using (active);
create policy "public read active devices" on devices for select using (active);
create policy "public read device specs" on device_specs for select using (true);
create policy "public read device images" on device_images for select using (true);
create policy "public read active cartridges" on cartridges for select using (active);
create policy "public read active resistances" on resistances for select using (active);
create policy "public read active accessories" on accessories for select using (active);
create policy "public read active liquids" on liquids for select using (active);
create policy "public read liquid flavors" on liquid_flavors for select using (true);
create policy "public read liquid images" on liquid_images for select using (true);
create policy "public read published tutorials" on tutorials for select using (published);
create policy "public read tutorial steps" on tutorial_steps for select using (true);
create policy "public read published faq" on faq_items for select using (published);
create policy "public read published advice" on advice_items for select using (published);

-- Storage buckets for the future admin media uploads (brief §9-11, §19):
--   insert into storage.buckets (id, name, public) values
--     ('products', 'products', true), ('tutorials', 'tutorials', true),
--     ('brands', 'brands', true), ('avatars', 'avatars', true);
-- Left commented out: bucket policies depend on the admin auth model, designed in the
-- back-office phase.
