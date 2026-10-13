// Synthetic local smoke-test transport only. Never imported by application code.
// Refuses all external requests; it is not evidence of real Supabase/Resend compatibility.
const fs = require("node:fs");
const originalFetch = globalThis.fetch;
const fixture = JSON.parse(fs.readFileSync(process.env.TRIAL_FIXTURE_PATH, "utf8"));
const logPath = process.env.TRIAL_FIXTURE_LOG;
if (process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://isolatedfixture.supabase.co" || !logPath) {
  throw new Error("Local transport requires the synthetic Supabase origin and a request log.");
}
globalThis.fetch = async (input, init) => {
  const request = new Request(input, init);
  const url = new URL(request.url);
  if (["localhost", "127.0.0.1"].includes(url.hostname)) return originalFetch(input, init);
  if (url.hostname === "api.resend.com" && url.pathname === "/emails") {
    const body = await request.json();
    if (body.to.some((recipient) => recipient !== "owner@example.invalid")) throw new Error("Unexpected test recipient");
    fs.appendFileSync(logPath, JSON.stringify({ method: request.method, sink: "mock-email", subject: body.subject }) + "\n");
    return Response.json({ id: "synthetic-local-email" });
  }
  if (url.hostname !== "isolatedfixture.supabase.co") {
    throw new Error(`Local smoke transport blocked external request to ${url.hostname}`);
  }
  if (!url.pathname.startsWith("/rest/v1/")) throw new Error("Unimplemented synthetic service route");
  const table = url.pathname.split("/").pop();
  fs.appendFileSync(logPath, JSON.stringify({ method: request.method, table, query: url.search }) + "\n");
  if (request.method === "POST" && table === "contact_submissions") {
    fs.appendFileSync(logPath, JSON.stringify({ sink: "mock-contact", body: await request.json() }) + "\n");
    return new Response(null, { status: 201 });
  }
  if (!["GET", "HEAD"].includes(request.method)) throw new Error("Unimplemented synthetic mutation");
  let rows = [...(fixture[table] || [])];
  for (const [key, expression] of url.searchParams) {
    if (expression.startsWith("eq.")) rows = rows.filter((row) => String(row[key]) === expression.slice(3));
    if (expression.startsWith("neq.")) rows = rows.filter((row) => String(row[key]) !== expression.slice(4));
    if (expression.startsWith("in.(")) rows = rows.filter((row) => expression.slice(4, -1).split(",").includes(String(row[key])));
  }
  if (url.searchParams.has("or")) {
    const search = url.searchParams.get("or").match(/ilike\."?%([^%]+)%/)?.[1]?.toLowerCase();
    if (search) rows = rows.filter((row) => [row.name, row.short_description, row.brand, row.model_code].some((value) => value?.toLowerCase().includes(search)));
  }
  const count = rows.length;
  const offset = Number(url.searchParams.get("offset") || 0);
  const limit = Number(url.searchParams.get("limit") || rows.length);
  rows = rows.slice(offset, offset + limit);
  if (table === "categories") rows = rows.map((row) => ({ ...row, products: [{ count: fixture.products.filter((product) => product.category_id === row.id).length }] }));
  return new Response(request.method === "HEAD" ? null : JSON.stringify(rows), {
    status: 200, headers: { "content-type": "application/json", "content-range": `*/${count}` },
  });
};
