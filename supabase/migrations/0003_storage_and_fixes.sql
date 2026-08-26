-- Switch — storage RLS + small schema fixes discovered while wiring the real catalog
-- (brief §22-23). The `catalog` bucket itself is already created (via the Storage
-- Management API — buckets aren't manageable through plain SQL the way policies are).
--
-- Run after 0001_init.sql and 0002_admin_auth.sql: supabase db push

-- ============================================================================
-- STORAGE — public read, admin-only write on the `catalog` bucket
-- ============================================================================

create policy "public read catalog media" on storage.objects
  for select using (bucket_id = 'catalog');

create policy "admin write catalog media" on storage.objects
  for all using (bucket_id = 'catalog' and is_admin())
  with check (bucket_id = 'catalog' and is_admin());

-- ============================================================================
-- NOTIFICATIONS — needs a draft/live flag like the other content tables
-- (0001 only had unread/broadcast; the admin notifications screen needs publish control)
-- ============================================================================

alter table notifications add column if not exists published boolean not null default true;
