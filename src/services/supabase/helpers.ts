import { createClient } from "@/lib/supabase/client";

// Every Supabase service implementation is only ever selected (see services/index.ts) when
// isSupabaseConfigured() is true, so a null client here means something is actually wrong —
// throwing surfaces that immediately instead of silently no-op-ing.
export function sb() {
  const client = createClient();
  if (!client) throw new Error("Supabase client requested but not configured");
  return client;
}
