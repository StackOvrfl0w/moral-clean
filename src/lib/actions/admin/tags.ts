"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

function requiredText(value: FormDataEntryValue | null, label: string) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) throw new Error(`${label} is required.`);
  return text;
}

function refreshTagViews() {
  revalidatePath("/admin/tags");
  revalidatePath("/products");
}

export async function createTag(formData: FormData) {
  await requireAdmin();
  const name = requiredText(formData.get("name"), "Tag name");
  const slug = slugify(name);
  if (!slug) throw new Error("Tag name must contain letters or numbers.");

  const { error } = await createClient().from("tags").insert({ name, slug });
  if (error) throw new Error(error.message);
  refreshTagViews();
}

export async function updateTag(formData: FormData) {
  await requireAdmin();
  const id = requiredText(formData.get("id"), "Tag ID");
  const name = requiredText(formData.get("name"), "Tag name");
  const slug = slugify(name);
  if (!slug) throw new Error("Tag name must contain letters or numbers.");

  const { error } = await createClient().from("tags").update({ name, slug }).eq("id", id);
  if (error) throw new Error(error.message);
  refreshTagViews();
}

export async function deleteTag(formData: FormData) {
  await requireAdmin();
  const id = requiredText(formData.get("id"), "Tag ID");

  const { error } = await createClient().from("tags").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refreshTagViews();
}