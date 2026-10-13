"use server";

import { requireAdminNoRedirect } from "@/lib/auth";
import { validateImageMetadata, validateImageUpload } from "@/lib/image-upload";
import { createClient } from "@/lib/supabase/server";

const folders = new Set(["products", "categories", "services", "blog"]);
const bucket = "product images";

export async function requestImageUpload(input: {
  folder: string; size: number; extension: string; contentType: string;
}) {
  const user = await requireAdminNoRedirect();
  if (!folders.has(input.folder)) throw new Error("Invalid image folder.");
  validateImageMetadata(input.size, input.extension, input.contentType);
  const path = `${input.folder}/${user.id}/${crypto.randomUUID()}.${input.extension}`;
  const storage = createClient().storage.from(bucket);
  const { data, error } = await storage.createSignedUploadUrl(path, { upsert: false });
  if (error || !data) throw new Error(error?.message || "Unable to authorize image upload.");
  return { path, token: data.token };
}

export async function completeImageUpload(path: string): Promise<{ url: string; path: string }> {
  const user = await requireAdminNoRedirect();
  const parts = path.split("/");
  if (parts.length !== 3 || !folders.has(parts[0]) || parts[1] !== user.id ||
      !/^[0-9a-f-]{36}\.(jpg|png|gif|webp)$/.test(parts[2])) {
    throw new Error("Invalid image upload path.");
  }
  const storage = createClient().storage.from(bucket);
  const { data, error } = await storage.download(path);
  if (error || !data) throw new Error(error?.message || "Unable to validate uploaded image.");
  try {
    // Validate actual bytes on the server before returning a URL for attachment.
    const image = await validateImageUpload(new File([data], parts[2]));
    if (!path.endsWith(`.${image.extension}`)) throw new Error("Image extension does not match its contents.");
  } catch (error) {
    const { error: cleanupError } = await storage.remove([path]);
    if (cleanupError) console.error("Invalid image cleanup failed; review isolated storage logs.");
    throw error;
  }
  const { data: { publicUrl } } = storage.getPublicUrl(path);
  return { url: publicUrl, path };
}
