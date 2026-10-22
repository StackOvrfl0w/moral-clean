import fs from "node:fs";
import assert from "node:assert/strict";

const origin = process.argv[2] || "http://localhost:3011";
const output = process.argv[3] || "docs/seo/commercial-verification-2026-10-11.json";
const results = [];
async function request(path, expected = 200) {
  const response = await fetch(origin + path);
  const html = await response.text();
  assert.equal(response.status, expected, path);
  results.push({ path, status: response.status });
  return html;
}
for (const root of ["/products", "/products/category/single-disk-machine", "/blog"]) {
  for (const page of ["999", "1.5", "0", "-1", "Infinity", "abc", "999999999999999999999"]) {
    const html = await request(root + "?page=" + page, 404);
    assert.match(html, /name="robots"[^>]*noindex/, root + " invalid page robots");
  }
}
for (const page of ["2", "3"]) {
  const html = await request("/products?page=" + page);
  assert.match(html, new RegExp('rel="canonical" href="https://moralclean.com/products\\?page=' + page + '"'));
}
await request("/products?q=no-such-cleaning-equipment-918327");
await request("/products?q=no-such-cleaning-equipment-918327&page=999", 404);
for (const [slug, heading] of [
  ["single-disk-machine", "Single Disc Floor Cleaning Machines"],
  ["ride-on-scrubber-dryer", "Ride On Scrubber Dryers for Commercial Floors"],
]) {
  const html = await request("/products/category/" + slug);
  assert.match(html, new RegExp("<h1[^>]*>" + heading + "</h1>"));
  assert.ok(html.includes("Applications and operating limits"));
  assert.ok(html.includes("Compare listed models"));
  assert.ok(html.includes("/services/cleaning-machine-parts"));
  assert.ok(html.includes("/contact?subject=Quotation"));
  assert.ok(!/<meta[^>]*name="robots"[^>]*noindex/.test(html));
}
const slug = "biemmedue-ms-17-fast-single-disc-floor-machine";
const html = await request("/products/" + slug);
assert.ok(html.includes("Request model documentation"));
assert.ok(html.includes("purpose=documentation"));
assert.ok(html.includes("Confirm before ordering"));
assert.ok(!html.includes("Authorized Distributor"));
assert.ok(!html.includes("Original Parts Available"));
const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((match) => JSON.parse(match[1]));
const product = schemas.find((schema) => schema["@type"] === "Product");
assert.equal(product, undefined, "quote-only product pages must not emit incomplete Product schema");
const contact = await request("/contact?product=" + slug + "&purpose=documentation");
assert.ok(contact.includes("operating instructions"));
assert.ok(contact.includes("MS 17"));
const parts = await request("/contact?product=" + slug + "&purpose=parts");
assert.ok(parts.includes("Parts &amp; Replacement"));
assert.ok(parts.includes("serial plate"));
const optimizer = html.match(/<img[^>]+src="([^"]*\/_next\/image[^"]+)"/)?.[1];
assert.ok(optimizer, "optimized product image");
const imageResponse = await fetch(origin + optimizer.replace(/&amp;/g, "&"));
assert.equal(imageResponse.status, 200);
assert.match(imageResponse.headers.get("content-type"), /^image\//);
results.push({ path: "representative product image optimizer", status: imageResponse.status });
const host = await fetch(origin + "/products?source=redirect-test", { redirect: "manual", headers: { host: "www.moralclean.com" } });
assert.equal(host.status, 308);
assert.equal(host.headers.get("location"), "https://moralclean.com/products?source=redirect-test");
results.push({ path: "www path/query redirect", status: host.status });
fs.writeFileSync(output, JSON.stringify({ testedAt: new Date().toISOString(), origin, scope: "local production build using read-only public catalogue data; no form submissions", results, errors: [] }, null, 2) + "\n");
console.log(JSON.stringify({ checks: results.length, errors: [] }));
