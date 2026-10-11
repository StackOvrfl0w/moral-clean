import { describe, expect, test } from "bun:test";
import { createClient } from "@supabase/supabase-js";
import { parsePage } from "../src/lib/pagination";
import { readPage } from "../src/lib/queries/read-page";

describe("catalog pagination boundary", () => {
  test("accepts ordinary pages and rejects unsafe or noninteger offsets", () => {
    expect(parsePage()).toBe(1);
    expect(parsePage("2")).toBe(2);
    for (const value of ["0", "-1", "1.5", "Infinity", "NaN", "1e9", "", "999999999999999999999", 1.5]) {
      expect(parsePage(value)).toBeNull();
    }
    expect(parsePage(Math.floor(2_147_483_648 / 24))).not.toBeNull();
    expect(parsePage(Math.floor(2_147_483_648 / 24) + 1)).toBeNull();
  });

  // Exercise the real Supabase query builder against a deterministic REST transport.
  // No database or notification service is contacted.
  function transport(responses) {
    const urls = [];
    const client = createClient("https://catalog.example.invalid", "public-test-key", {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: async (input) => {
        urls.push(new URL(String(input)));
        const response = responses.shift();
        if (!response) throw new Error("Unexpected additional database request");
        return new Response(JSON.stringify(response.body), {
          status: response.status,
          headers: { "content-type": "application/json", ...(response.count ? { "content-range": response.count } : {}) },
        });
      } },
    });
    const query = client.from("products").select("id", { count: "exact" }).eq("category_id", "single-disc").order("id");
    return { urls, run: (page) => readPage((from, to) => query.range(from, to), page, 12) };
  }
  const rangeError = { code: "PGRST103", message: "Requested range not satisfiable", details: null, hint: null };
  test("a valid page makes one filtered request", async () => {
    const t = transport([{ status: 200, body: [{ id: "model" }], count: "12-12/36" }]);
    const result = await t.run(2);
    expect(result.error).toBeNull();
    expect(result.count).toBe(36);
    expect(t.urls).toHaveLength(1);
    expect(t.urls[0].searchParams.get("offset")).toBe("12");
  });
  test("out-of-range pages recover the filtered count without returning page-one products", async () => {
    const t = transport([{ status: 416, body: rangeError }, { status: 200, body: [{ id: "first" }], count: "0-0/36" }]);
    const result = await t.run(999);
    expect(result.error).toBeNull();
    expect(result.count).toBe(36);
    expect(result.data).toEqual([]);
    expect(t.urls).toHaveLength(2);
    expect(t.urls[1].searchParams.get("offset")).toBe("0");
    expect(t.urls[1].searchParams.get("limit")).toBe("1");
    expect(t.urls.every((url) => url.searchParams.get("category_id") === "eq.single-disc")).toBe(true);
  });
  test("empty filtered collections recover as empty rather than throwing", async () => {
    const t = transport([{ status: 416, body: rangeError }, { status: 200, body: [], count: "*/0" }]);
    const result = await t.run(999);
    expect(result.count).toBe(0);
    expect(result.data).toEqual([]);
    expect(result.error).toBeNull();
  });
  test("a permission failure is propagated without retry", async () => {
    const t = transport([{ status: 403, body: { ...rangeError, code: "42501", message: "Permission denied" } }]);
    expect((await t.run(2)).error?.code).toBe("42501");
    expect(t.urls).toHaveLength(1);
  });
  test("a failed count recovery remains a genuine failure", async () => {
    const t = transport([{ status: 416, body: rangeError }, { status: 500, body: { ...rangeError, code: "XX000" } }]);
    expect((await t.run(999)).error?.code).toBe("XX000");
  });
});
