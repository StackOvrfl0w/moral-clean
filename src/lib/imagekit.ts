import "server-only";

// Relies on IMAGEKIT_PRIVATE_KEY, which must never be exposed to the client.
// Only import this from "use server" actions, route handlers, or other
// server-only code paths.

import { createHmac, randomUUID } from "node:crypto";

function getPrivateKey() {
  const key = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!key) {
    throw new Error("IMAGEKIT_PRIVATE_KEY is not configured on the server.");
  }
  return key;
}

export type ImageKitAuthParams = {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
};

/**
 * Generates one-time authentication parameters for a client-side ImageKit
 * upload. The browser uses these to upload directly to ImageKit's endpoint
 * without ever routing file bytes through our own server — required because
 * Vercel Functions cap request bodies at 4.5 MB regardless of Next.js's own
 * bodySizeLimit config.
 */
export function generateImageKitAuthParams(): ImageKitAuthParams {
  const privateKey = getPrivateKey();
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error("NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY is not configured on the server.");
  }

  const token = randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 60 * 5; // 5 minutes

  const signature = createHmac("sha1", privateKey)
    .update(token + expire)
    .digest("hex");

  return { token, expire, signature, publicKey };
}

/**
 * Best-effort deletion of ImageKit files by fileId, used to roll back a
 * partially failed import (e.g. some products in a CSV batch created
 * successfully, one failed, and we need to remove images the client already
 * uploaded for the failed row).
 */
export async function cleanupImageKitFiles(fileIds: string[]) {
  if (fileIds.length === 0) return;
  const privateKey = getPrivateKey();
  const authHeader = `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}`;

  await Promise.all(
    fileIds.map(async (fileId) => {
      try {
        await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
          method: "DELETE",
          headers: { Authorization: authHeader },
        });
      } catch {
        // best-effort; ignore
      }
    }),
  );
}
