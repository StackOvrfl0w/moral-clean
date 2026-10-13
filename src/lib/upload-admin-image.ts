"use client";

import { requestImageUpload, completeImageUpload } from "@/lib/actions/admin/storage-upload";
import { validateImageUpload } from "@/lib/image-upload";
import { createClient } from "@/lib/supabase/client";

export async function uploadAdminImage(file: File, folder: "products" | "categories" | "services" | "blog") {
  const image = await validateImageUpload(file);
  const { path, token } = await requestImageUpload({
    folder, size: file.size, extension: image.extension, contentType: image.contentType,
  });
  // File bytes go directly to Storage; Next.js/Netlify only handle small action payloads.
  const { error } = await createClient().storage.from("product images")
    .uploadToSignedUrl(path, token, file, { contentType: image.contentType });
  if (error) throw new Error(error.message);
  return completeImageUpload(path);
}
