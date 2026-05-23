import "server-only";

import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/types";

const fetchAllSettings = unstable_cache(
  async (): Promise<Record<string, string>> => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return {};
    }

    const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data } = await supabase.from("site_settings").select("key, value");

    if (!data) return {};

    return Object.fromEntries(data.map(({ key, value }) => [key, value ?? ""]));
  },
  ["site-settings-all"],
  { tags: ["site-settings"] },
);

export async function getAllSettings(): Promise<Record<string, string>> {
  return fetchAllSettings();
}

export async function getSetting(key: string): Promise<string> {
  const settings = await getAllSettings();
  return settings[key] ?? "";
}
