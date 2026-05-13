import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

export const getAllSettings = cache(async (): Promise<Record<string, string>> => {
  const supabase = createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value");

  if (!data) return {};
  return Object.fromEntries(data.map(({ key, value }) => [key, value ?? ""]));
});

export async function getSetting(key: string): Promise<string> {
  const settings = await getAllSettings();
  return settings[key] ?? "";
}
