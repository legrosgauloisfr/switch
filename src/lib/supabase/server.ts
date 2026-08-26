import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/config";

// Server client for Server Components and Route Handlers (reads/writes the auth cookie via
// next/headers). Returns null when no project is configured — see isSupabaseConfigured().
export async function createClient() {
  if (!isSupabaseConfigured()) return null;
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component render (not a Route Handler / Server Action) —
          // the middleware's own session refresh already covers cookie renewal in that case.
        }
      },
    },
  });
}
