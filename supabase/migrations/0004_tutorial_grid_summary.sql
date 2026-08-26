-- Switch — restores the short card/video summary that got dropped when tutorials were
-- first migrated to Supabase (the app fell back to the full intro paragraph instead).
--
-- Run after 0001-0003: supabase db push

alter table tutorials add column if not exists grid_summary text;
