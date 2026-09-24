// FILE PATH: src/lib/actions/admin/imagekit-auth.ts

"use server";

import { requireAdminNoRedirect } from "@/lib/auth";
import {
  generateImageKitAuthParams,
  type ImageKitAuthParams,
} from "@/lib/imagekit";

/**
 * Returns one-time auth params so an already-authenticated admin's browser
 * can upload directly to ImageKit. Gated behind an admin check — anyone who
 * can call this can upload files to our ImageKit account, so this must never
 * be reachable by non-admins.
 *
 * Uses requireAdminNoRedirect(), not requireAdmin(): this gets called once
 * per image during a CSV import, and a redirect() thrown from inside that
 * loop would force-navigate the admin's browser to the login page and
 * abandon the rest of the import. See requireAdminNoRedirect's docstring.
 */
export async function getImageKitAuthParams(): Promise<ImageKitAuthParams> {
  await requireAdminNoRedirect();
  return generateImageKitAuthParams();
}
