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
  test("a range failure after preflight is surfaced without a recovery query", async () => {
    const t = transport([{ status: 416, body: rangeError }]);
    await expect(t.run(999)).rejects.toThrow("Results changed after pagination validation");
    expect(t.urls).toHaveLength(1);
  });
  test("an empty first page is valid without a recovery request", async () => {
    let calls = 0;
    const result = await readPage(async () => {
      calls += 1;
      return { data: null, count: 0, error: rangeError };
    }, 1, 12);
    expect(result.data).toEqual([]);
    expect(result.error).toBeNull();
    expect(calls).toBe(1);
  });
  test("a permission failure is propagated without retry", async () => {
    const t = transport([{ status: 403, body: { ...rangeError, code: "42501", message: "Permission denied" } }]);
    expect((await t.run(2)).error?.code).toBe("42501");
    expect(t.urls).toHaveLength(1);
  });
  test("a failed request remains a genuine failure", async () => {
    const t = transport([{ status: 500, body: { ...rangeError, code: "XX000" } }]);
    expect((await t.run(999)).error?.code).toBe("XX000");
  });
});
