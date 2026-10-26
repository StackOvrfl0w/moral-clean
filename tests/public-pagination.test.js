import { beforeEach, expect, mock, test } from "bun:test";
import { createClient as realCreateClient } from "@supabase/supabase-js";
import { parsePage } from "../src/lib/pagination";
const createTransportClient = realCreateClient;

let requests, persistent, requestMemo, cacheLookups, filteredCount, blogCount, rowCount, forcedError, gallery, clientsCreated, categoryCount;
mock.module("server-only", () => ({}));
mock.module("next/navigation", () => ({ notFound: () => { throw Object.assign(new Error("Not found"), { digest: "NEXT_NOT_FOUND" }); } }));
mock.module("@/config/env", () => ({ env: { supabaseUrl: "https://catalog.example.invalid", supabaseAnonKey: "public-test-key" } }));
mock.module("react", () => ({ cache: (fn) => (...args) => {
  const values = requestMemo.get(fn) ?? new Map(); requestMemo.set(fn, values);
  const key = JSON.stringify(args);
  if (!values.has(key)) values.set(key, fn(...args));
  return values.get(key);
} }));
mock.module("next/cache", () => ({ unstable_cache: (fn, keys) => async (...args) => {
  const key = JSON.stringify([keys, args]); cacheLookups.push({ keys, args });
  if (!persistent.has(key)) persistent.set(key, await fn(...args));
  return persistent.get(key);
} }));
mock.module("@supabase/supabase-js", () => ({ createClient: (url, key, options) => { clientsCreated++; return createTransportClient(url, key, {
  ...options, global: { fetch: async (input, init) => {
    const url = new URL(String(input)); const method = init?.method ?? "GET";
    requests.push({ url, method });
    const table = url.pathname.split("/").pop();
    const select = url.searchParams.get("select");
    let body = [], count;
    if (table === "categories") body = [{ id: "cat", slug: "single-disc", name: "Single disc", products: [{ count: categoryCount }] }];
    else if (table === "tags") body = [{ id: "tag", slug: "commercial", name: "Commercial" }];
    else if (table === "products" && select === "brand") body = [{ brand: "Brand" }];
    else if (table === "product_tags") body = [{ product_id: "model" }];
    else {
      count = table === "blog_posts" ? blogCount : url.searchParams.has("brand") || url.searchParams.has("or") || url.searchParams.has("matching_tags.tag_id") ? filteredCount : 36;
      if (method !== "HEAD") {
        if (forcedError) return new Response(JSON.stringify(forcedError), { status: forcedError.code === "PGRST103" ? 416 : 403, headers: { "content-type": "application/json" } });
        const offset = Number(url.searchParams.get("offset") ?? 0);
        const limit = Number(url.searchParams.get("limit") ?? 12);
        const available = rowCount ?? count;
        if (offset > 0 && offset >= available) throw Error("Unvalidated range reached transport");
        body = available ? Array.from({ length: Math.min(limit, available - offset) }, (_, n) => ({ id: "model" + (offset + n), slug: "model-" + (offset + n), name: "Model", images: gallery, published_at: "2026-01-01" })) : [];
      }
    }
    return new Response(method === "HEAD" ? null : JSON.stringify(body), { status: 200, headers: { "content-type": "application/json", ...(count !== undefined ? { "content-range": "*/" + count } : {}) } });
  } },
}); } }));
const { getProducts } = await import("../src/lib/queries/products");
const { getAllPosts } = await import("../src/lib/queries/blog");
const { getProductsByCategory } = await import("../src/lib/queries/categories");
beforeEach(() => { requests = []; persistent = new Map(); requestMemo = new Map(); cacheLookups = []; filteredCount = 18; blogCount = 18; rowCount = undefined; forcedError = undefined; gallery = []; clientsCreated = 0; categoryCount = 36; });
const ranges = () => requests.filter(r => r.url.searchParams.has("offset"));
const countCalls = () => requests.filter(r => r.method === "HEAD" && (r.url.searchParams.has("brand") || r.url.pathname.endsWith("blog_posts")));
const notFound = (promise) => expect(promise).rejects.toMatchObject({ digest: "NEXT_NOT_FOUND" });

test("malformed and unsafe pages reject before DB/cache access", async () => {
  for (const page of ["0", "-1", "1.5", "abc", "", "1e9", "9999999999999999999"]) {
    await notFound(getProducts({ page })); await notFound(getAllPosts({ page }));
  }
  expect(requests).toHaveLength(0); expect(cacheLookups).toHaveLength(0);
  expect(parsePage("2")).toBe(2);
});
test("unfiltered page 999 uses facet count and never ranges or caches that page", async () => {
  await notFound(getProducts({ page: 999 }));
  expect(ranges()).toHaveLength(0);
  expect(cacheLookups.some(c => c.keys[0].includes("products-validated"))).toBe(false);
  expect(requests).toHaveLength(1); // only the shared count, no cold facets
});
test("normal first page costs one row query and keeps the exact primary-image selection", async () => {
  gallery = [{ id: "other", is_primary: false, sort_order: 0 }, { id: "primary", is_primary: true, sort_order: 5 }];
  const result = await getProducts();
  expect(result.products).toHaveLength(12); expect(result.pageCount).toBe(3);
  expect(ranges()).toHaveLength(1);
  expect(result.products[0].images).toHaveLength(1);
  expect(result.products[0].images[0].id).toBe("primary");
  const rowEntry = [...persistent.entries()].find(([key]) => key.includes("products-validated"))[1];
  expect(rowEntry).not.toHaveProperty("tags");
  expect(rowEntry).not.toHaveProperty("categories");
  expect(result.categories).toHaveLength(1);
  expect(clientsCreated).toBe(1);
});
test("nullable image flags/order preserve the original card fallback choice", async () => {
  gallery = [{ id: "false-later", is_primary: false, sort_order: 5 }, { id: "null-first", is_primary: null, sort_order: null }];
  expect((await getProducts()).products[0].images[0].id).toBe("null-first");
});
test("search tag expansion is shared between count and row requests", async () => {
  await getProducts({ q: "Commercial", page: 2 });
  expect(requests.filter(r => r.url.pathname.endsWith("product_tags"))).toHaveLength(1);
  expect(ranges()).toHaveLength(1);
});
test("valid unfiltered/category page two requires no extra HEAD query", async () => {
  const result = await getProducts({ category: "single-disc", page: 2 });
  expect(result.products).toHaveLength(12); expect(result.page).toBe(2);
  expect(ranges()).toHaveLength(1); expect(ranges()[0].url.searchParams.get("offset")).toBe("12");
  expect(ranges()[0].url.searchParams.get("category_id")).toBe("eq.cat");
});
test("category page 999 rejects using its existing category count before catalog facets", async () => {
  await notFound(getProductsByCategory("cat", { page: 999 }));
  expect(requests).toHaveLength(1); expect(requests[0].url.pathname).toEndWith("categories");
  expect(ranges()).toHaveLength(0);
});
test("valid unfiltered page two reuses the count between guard and facets", async () => {
  await getProducts({ page: 2 });
  expect(requests.filter(r => r.method === "HEAD")).toHaveLength(1);
  expect(requests).toHaveLength(5); // four cold facet reads plus one row request
});
test("filtered bounds are checked by HEAD with identical category/brand/tag filters", async () => {
  await notFound(getProducts({ category: "single-disc", brand: "Brand", tag: "commercial", page: 999 }));
  const head = countCalls()[0];
  expect(head.url.searchParams.get("category_id")).toBe("eq.cat");
  expect(head.url.searchParams.get("matching_tags.tag_id")).toBe("eq.tag");
  expect(head.url.searchParams.get("select")).not.toContain("images");
  expect(ranges()).toHaveLength(0);
  requestMemo = new Map(); await notFound(getProducts({ brand: "Brand", category: "single-disc", tag: "commercial", page: 998 }));
  expect(countCalls()).toHaveLength(1); // counts keyed by filters, not attacker page
});
test("valid filtered pagination counts before fetching rows and reuses caches", async () => {
  const result = await getProducts({ brand: "Brand", page: 2 });
  expect(result.pageCount).toBe(2); expect(countCalls()).toHaveLength(1); expect(ranges()).toHaveLength(1);
  expect(requests.indexOf(countCalls()[0])).toBeLessThan(requests.indexOf(ranges()[0]));
  const before = requests.length; requestMemo = new Map(); await getProducts({ brand: "Brand", page: 2 });
  expect(requests.length).toBe(before);
});
test("empty facet combinations return 404; page two rejects without another row query", async () => {
  filteredCount = 0;
  await notFound(getProducts({ brand: "Brand" }));
  requestMemo = new Map(); const before = ranges().length;
  await notFound(getProducts({ brand: "Brand", page: 2 })); expect(ranges()).toHaveLength(before);
});
test("unknown filters cannot create persistent result or count entries", async () => {
  await notFound(getProducts({ brand: "unknown" }));
  await notFound(getProducts({ tag: "unknown", page: 999 }));
  expect(ranges()).toHaveLength(0);
  expect(cacheLookups.every(c => ["catalog-facets-validated-v1", "catalog-product-count-v1"].includes(c.keys[0]))).toBe(true);
});
test("an empty free-text search remains usable, with or without a valid facet", async () => {
  filteredCount = 0;
  expect((await getProducts({ q: "no matches" })).products).toEqual([]);
  expect((await getProducts({ q: "no matches", brand: "Brand" })).products).toEqual([]);
});
test("an empty category landing remains usable without exposing unrelated global facets", async () => {
  categoryCount = 0;
  const result = await getProductsByCategory("cat", { page: 1 });
  expect(result.totalCount).toBe(0);
  expect(result.brands).toEqual([]);
  expect(result.tags).toEqual([]);
  expect(ranges()).toHaveLength(0);
  expect(requests.some(r => r.url.pathname.endsWith("tags"))).toBe(false);
});
test("search result/counts are not persisted, but equivalent calls deduplicate within request", async () => {
  await getProducts({ q: "  machine  " }); await getProducts({ q: "machine" });
  expect(ranges()).toHaveLength(1);
  expect(cacheLookups.every(c => ["catalog-facets-validated-v1", "catalog-product-count-v1"].includes(c.keys[0]))).toBe(true);
  requestMemo = new Map(); await getProducts({ q: "machine" }); expect(ranges()).toHaveLength(2);
});
test("oversized/control-character filters reject before DB/cache", async () => {
  await notFound(getProducts({ q: "x".repeat(121) })); await notFound(getProducts({ brand: "bad\nbrand" }));
  await notFound(getProducts({ sort: "x".repeat(121) }));
  expect(requests).toHaveLength(0); expect(cacheLookups).toHaveLength(0);
});
test("blog counts exclude unpublished posts, are shared across limits, and reject empty pages", async () => {
  blogCount = 0;
  expect((await getAllPosts()).posts).toEqual([]);
  requestMemo = new Map(); await notFound(getAllPosts({ page: 999, limit: 9 }));
  requestMemo = new Map(); await notFound(getAllPosts({ page: 998, limit: 3 }));
  expect(countCalls()).toHaveLength(1); expect(countCalls()[0].url.searchParams.get("published")).toBe("eq.true");
  expect(ranges()).toHaveLength(1); // only the valid empty first page
});
test("normal blog page two counts once and has a stable ordering", async () => {
  expect((await getAllPosts({ page: 2 })).posts).toHaveLength(9);
  expect(countCalls()).toHaveLength(1); expect(ranges()).toHaveLength(1);
  expect(ranges()[0].url.searchParams.get("order")).toBe("published_at.desc,id.asc");
});
test("concurrent deletion produces 404 and cannot write a negative result cache entry", async () => {
  forcedError = { code: "PGRST103", message: "Requested range not satisfiable", details: null, hint: null };
  await notFound(getProducts({ page: 2 }));
  expect([...persistent.keys()].some(k => k.includes("products-validated"))).toBe(false);
  expect(ranges()).toHaveLength(1); // no recovery query
});
test("permission failures remain genuine errors, not 404s or retries", async () => {
  forcedError = { code: "42501", message: "Permission denied", details: null, hint: null };
  await expect(getProducts({ page: 2 })).rejects.toThrow("Unable to load the product catalog");
  expect(ranges()).toHaveLength(1);
});
