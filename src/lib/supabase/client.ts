"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/config";

// Browser client for use in Client Components (auth forms, sign-out button, session reads).
// Returns null when no project is configured yet — callers must handle that (see
// isSupabaseConfigured()) rather than crash the whole admin UI.
export function createClient() {
  if (!isSupabaseConfigured()) return null;
  return createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
}
