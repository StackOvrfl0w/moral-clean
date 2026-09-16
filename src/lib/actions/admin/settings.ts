"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const allowedSettings = new Set([
  "business_name",
  "business_tagline",
  "business_phone",
  "business_email",
  "business_address",
  "business_hours",
  "social_facebook",
  "social_instagram",
  "social_linkedin",
  "social_youtube",
  "contact_form_whatsapp",
  "google_maps_embed_url",
  "seo_default_title",
  "seo_default_description",
  "announcement_bar_text",
  "homepage_hero_heading_line1",
  "homepage_hero_heading_line2",
  "homepage_hero_subheading",
]);

const urlSettings = new Set([
  "social_facebook",
  "social_instagram",
  "social_linkedin",
  "social_youtube",
  "google_maps_embed_url",
]);

function isSafeHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function updateSettings(
  updates: Record<string, string>,
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const entries = Object.entries(updates);
  if (entries.some(([key, value]) => !allowedSettings.has(key) || typeof value !== "string")) {
    return { success: false, error: "Invalid settings payload." };
  }

  if (entries.some(([, value]) => value.length > 2000)) {
    return { success: false, error: "One or more settings are too long." };
  }

  if (
    entries.some(
      ([key, value]) =>
        urlSettings.has(key) && value.length > 0 && !isSafeHttpsUrl(value),
    )
  ) {
    return { success: false, error: "Settings URLs must use HTTPS." };
  }

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

  revalidateTag("site-settings");
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/services");
  revalidatePath("/products");
  revalidatePath("/blog");
  revalidatePath("/admin/settings");

  return { success: true };
}
