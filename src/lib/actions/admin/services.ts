"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

function normalize(value: FormDataEntryValue | null) {
  const text = typeof value === "string" ? value.trim() : "";
  return text || null;
}

export async function createService(formData: FormData) {
  await requireAdmin();
  const name = normalize(formData.get("name"));
  const slugInput = normalize(formData.get("slug"));
  const slug = slugInput ? slugify(slugInput) : name ? slugify(name) : null;

  if (!name || !slug) throw new Error("Name and slug are required.");

  const supabase = createClient();
  const { error } = await supabase.from("services").insert({
    name,
    slug,
    short_description: normalize(formData.get("short_description")),
    long_description: normalize(formData.get("long_description")),
    icon_name: normalize(formData.get("icon_name")),
    image_url: normalize(formData.get("image_url")),
    sort_order: Number(formData.get("sort_order") ?? 0),
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/services");
  revalidatePath("/services");
  redirect("/admin/services");
}

export async function updateService(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = normalize(formData.get("name"));
  const slugInput = normalize(formData.get("slug"));
  const slug = slugInput ? slugify(slugInput) : name ? slugify(name) : null;

  if (!id || !name || !slug) throw new Error("ID, name and slug are required.");

  const supabase = createClient();
  const { error } = await supabase
    .from("services")
    .update({
      name,
      slug,
      short_description: normalize(formData.get("short_description")),
      long_description: normalize(formData.get("long_description")),
      icon_name: normalize(formData.get("icon_name")),
      image_url: normalize(formData.get("image_url")),
      sort_order: Number(formData.get("sort_order") ?? 0),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/services");
  revalidatePath("/services");
  redirect("/admin/services");
}

export async function deleteService(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("ID required.");

  const supabase = createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/services");
  revalidatePath("/services");
}
