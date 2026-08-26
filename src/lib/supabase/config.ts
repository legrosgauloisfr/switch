// Whether a real Supabase project is wired up. Auth + admin protection stay fully
// functional-but-open in local dev until these are set — see middleware.ts and
// components/admin/AdminShell.tsx, both of which check this before enforcing anything.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return !!SUPABASE_URL && !!SUPABASE_ANON_KEY;
}
