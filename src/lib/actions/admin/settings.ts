"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function updateSettings(
  updates: Record<string, string>,
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const supabase = createClient();
  const rows = Object.entries(updates).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("site_settings")
    .upsert(rows, { onConflict: "key" });

  if (error) return { success: false, error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");

  return { success: true };
}
