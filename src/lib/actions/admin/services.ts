"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { normalizeSafeUrl, slugify } from "@/lib/utils";

function invalidateServices() {
  revalidateTag("services");
}

function normalize(value: FormDataEntryValue | null) {
  const text = typeof value === "string" ? value.trim() : "";
  return text || null;
}

export async function createService(formData: FormData) {
  await requireAdmin();
  const name = normalize(formData.get("name"));
  const slugInput = normalize(formData.get("slug"));
  const slug = slugInput ? slugify(slugInput) : name ? slugify(name) : null;

  const imageInput = normalize(formData.get("image_url"));
  const image_url = normalizeSafeUrl(imageInput);
  if (!name || !slug) throw new Error("Name and slug are required.");
  if (imageInput && !image_url) throw new Error("Image URL must use HTTPS.");

  const supabase = createClient();
  const { error } = await supabase.from("services").insert({
    name,
    slug,
    short_description: normalize(formData.get("short_description")),
    long_description: normalize(formData.get("long_description")),
    icon_name: normalize(formData.get("icon_name")),
    image_url,
    sort_order: Number(formData.get("sort_order") ?? 0),
  });
  if (error) throw new Error(error.message);

  invalidateServices();
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

  const imageInput = normalize(formData.get("image_url"));
  const image_url = normalizeSafeUrl(imageInput);
  if (!id || !name || !slug) throw new Error("ID, name and slug are required.");
  if (imageInput && !image_url) throw new Error("Image URL must use HTTPS.");

  const supabase = createClient();
  const { error } = await supabase
    .from("services")
    .update({
      name,
      slug,
      short_description: normalize(formData.get("short_description")),
      long_description: normalize(formData.get("long_description")),
      icon_name: normalize(formData.get("icon_name")),
      image_url,
      sort_order: Number(formData.get("sort_order") ?? 0),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  invalidateServices();
  revalidatePath("/admin/services");
  revalidatePath("/services");
  redirect("/admin/services");
}

export async function deleteService(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("ID required.");

  const supabase = createClient();
  const { error, count } = await supabase
    .from("services")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) throw new Error(error.message);
  if (count !== 1) throw new Error("Service was not found or was not deleted.");
  invalidateServices();
  revalidatePath("/admin/services");
  revalidatePath("/services");
}

export async function bulkDeleteServices(formData: FormData) {
  await requireAdmin();
  let ids: string[];
  try {
    ids = JSON.parse(String(formData.get("ids") ?? "[]")) as string[];
  } catch {
    throw new Error("Invalid service selection.");
  }

  ids = Array.from(new Set(ids.filter((id) => /^[0-9a-f-]{36}$/i.test(id))));
  if (ids.length === 0) throw new Error("No services selected.");

  const supabase = createClient();
  const { error, count } = await supabase
    .from("services")
    .delete({ count: "exact" })
    .in("id", ids);
  if (error) throw new Error(error.message);
  if ((count ?? 0) !== ids.length) {
    throw new Error(`Only ${count ?? 0} of ${ids.length} services were deleted.`);
  }

  invalidateServices();
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { deletedCount: count ?? 0 };
}
