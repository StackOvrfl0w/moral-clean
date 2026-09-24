import "server-only";

import { createClient } from "@supabase/supabase-js";

import { env } from "@/config/env";
import type { Database } from "@/lib/types";

/**
 * Creates a server-only client that bypasses RLS.
 *
 * Callers must authorize the current user before using this client. Never
 * import it from a Client Component or expose its credentials to the browser.
 */
export function createAdminClient() {
  return createClient<Database>(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
