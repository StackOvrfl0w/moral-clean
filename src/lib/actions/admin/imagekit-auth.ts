"use server";

import { requireAdmin } from "@/lib/auth";
import { generateImageKitAuthParams, type ImageKitAuthParams } from "@/lib/imagekit";

/**
 * Returns one-time auth params so an already-authenticated admin's browser
 * can upload directly to ImageKit. Gated behind requireAdmin() — anyone who
 * can call this can upload files to our ImageKit account, so this must never
 * be reachable by non-admins.
 */
export async function getImageKitAuthParams(): Promise<ImageKitAuthParams> {
  await requireAdmin();
  return generateImageKitAuthParams();
}
