import { beforeEach, expect, mock, test } from "bun:test";

const user = { id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" };
let denied = false;
const sign = mock(async () => ({ data: { token: "isolated-token" }, error: null }));
const download = mock(async () => ({ data: new Blob([new Uint8Array([0xff, 0xd8, 0xff])]), error: null }));
const remove = mock(async () => ({ error: null }));
mock.module("@/lib/auth", () => ({ requireAdminNoRedirect: async () => {
  if (denied) throw new Error("Unauthorized");
  return user;
} }));
mock.module("@/lib/supabase/server", () => ({ createClient: () => ({ storage: { from: () => ({
  createSignedUploadUrl: sign, download, remove,
  getPublicUrl: (path) => ({ data: { publicUrl: `https://isolated.example.invalid/${path}` } }),
}) } }) }));
const { requestImageUpload, completeImageUpload } = await import("../src/lib/actions/admin/storage-upload");
beforeEach(() => {
  denied = false; sign.mockClear(); download.mockClear(); remove.mockClear();
  download.mockImplementation(async () => ({ data: new Blob([new Uint8Array([0xff, 0xd8, 0xff])]), error: null }));
});

test("unauthenticated upload cannot obtain a signed capability or finalize", async () => {
  denied = true;
  await expect(requestImageUpload({ folder: "products", size: 3, extension: "jpg", contentType: "image/jpeg" })).rejects.toThrow("Unauthorized");
  await expect(completeImageUpload("anything")).rejects.toThrow("Unauthorized");
  expect(sign).not.toHaveBeenCalled(); expect(download).not.toHaveBeenCalled();
});
test("5 MiB upload signs a fixed admin-owned path without receiving file bytes", async () => {
  const result = await requestImageUpload({ folder: "products", size: 5 * 1024 * 1024, extension: "jpg", contentType: "image/jpeg" });
  expect(result.path).toMatch(new RegExp(`^products/${user.id}/[0-9a-f-]{36}\\.jpg$`));
  expect(sign.mock.calls[0]).toEqual([result.path, { upsert: false }]);
  expect((await completeImageUpload(result.path)).url).toContain(result.path);
});
test("foreign paths and traversal never reach Storage", async () => {
  for (const path of ["products/other/id.jpg", `products/${user.id}/../id.jpg`, `unknown/${user.id}/id.jpg`]) {
    await expect(completeImageUpload(path)).rejects.toThrow();
  }
  expect(download).not.toHaveBeenCalled();
});
test("invalid uploaded bytes are removed instead of attached", async () => {
  download.mockImplementation(async () => ({ data: new Blob(["not an image"]), error: null }));
  const path = `products/${user.id}/bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb.jpg`;
  await expect(completeImageUpload(path)).rejects.toThrow();
  expect(remove).toHaveBeenCalledWith([path]);
});
