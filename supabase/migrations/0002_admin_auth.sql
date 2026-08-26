-- Switch — admin roles + auth wiring.
-- Adds the admin/user role, auto-creates a profile row on signup, and locks catalog writes
-- to admins only (defense in depth alongside the app's own middleware.ts route guard —
-- RLS is the real backstop even if a request bypassed the Next.js layer entirely).
--
-- Run after 0001_init.sql: supabase db push

-- ============================================================================
-- ROLE
-- ============================================================================

alter table profiles add column if not exists role text not null default 'user' check (role in ('user', 'admin'));

-- Auto-create a profile row whenever someone signs up (email/password, Google, or Apple —
-- all land in auth.users the same way). Without this, a brand-new user has no profiles row
-- and every RLS check keyed on profiles fails closed.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Vous'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- SECURITY DEFINER + a fixed search_path: policies call this from other tables' RLS
-- contexts, so it must not depend on (or be shadowed by) the calling role's search_path.
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================================
-- MISSING TABLE FROM 0001 (articles — added after the initial pass)
-- ============================================================================

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  excerpt text,
  body text,
  image_url text,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table articles enable row level security;
create policy "public read published articles" on articles for select using (published);
create policy "admin write articles" on articles for all using (is_admin()) with check (is_admin());

-- ============================================================================
-- ADMIN WRITE POLICIES — catalog & content tables from 0001
-- (their SELECT policies already exist; this adds INSERT/UPDATE/DELETE for admins only)
-- ============================================================================

create policy "admin write brands" on brands for all using (is_admin()) with check (is_admin());
create policy "admin write categories" on categories for all using (is_admin()) with check (is_admin());
create policy "admin write flavors" on flavors for all using (is_admin()) with check (is_admin());
create policy "admin write devices" on devices for all using (is_admin()) with check (is_admin());
create policy "admin write device_specs" on device_specs for all using (is_admin()) with check (is_admin());
create policy "admin write device_images" on device_images for all using (is_admin()) with check (is_admin());
create policy "admin write cartridges" on cartridges for all using (is_admin()) with check (is_admin());
create policy "admin write resistances" on resistances for all using (is_admin()) with check (is_admin());
create policy "admin write accessories" on accessories for all using (is_admin()) with check (is_admin());
create policy "admin write liquids" on liquids for all using (is_admin()) with check (is_admin());
create policy "admin write liquid_flavors" on liquid_flavors for all using (is_admin()) with check (is_admin());
create policy "admin write liquid_images" on liquid_images for all using (is_admin()) with check (is_admin());
create policy "admin write tutorials" on tutorials for all using (is_admin()) with check (is_admin());
create policy "admin write tutorial_steps" on tutorial_steps for all using (is_admin()) with check (is_admin());
create policy "admin write faq_items" on faq_items for all using (is_admin()) with check (is_admin());
create policy "admin write advice_items" on advice_items for all using (is_admin()) with check (is_admin());
create policy "admin write notifications" on notifications for all using (is_admin()) with check (is_admin());

-- ============================================================================
-- BOOTSTRAPPING THE FIRST ADMIN
-- ============================================================================
-- No one has role = 'admin' yet after this migration — sign up once through the app
-- (email/password, Google, or Apple all work), then in the Supabase SQL editor run:
--
--   update profiles set role = 'admin' where id =
--     (select id from auth.users where email = 'you@example.com');
--
-- Every admin after that can be promoted from inside the app once a "Users" admin screen
-- exists (not built yet) — or with the same SQL command in the meantime.
