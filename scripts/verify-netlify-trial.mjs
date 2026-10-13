import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const origin = new URL(process.argv[2] || "http://localhost:3017").origin;
const output = process.argv[3] || "docs/migration/netlify-local-http.json";
const host = new URL(origin).hostname;
if (!["localhost", "127.0.0.1"].includes(host) && !host.endsWith(".netlify.app")) throw new Error("Only isolated local or Netlify trial targets are allowed");
const results = [], errors = [], pages = [], images = new Set();
const decode = (value) => value.replaceAll("&amp;", "&");
async function request(route, expected = 200) {
  const started = performance.now();
  const response = await fetch(origin + route, { redirect: "manual", signal: AbortSignal.timeout(30000) });
  const ttfbMs = performance.now() - started;
  const body = Buffer.from(await response.arrayBuffer());
  const result = { route, status: response.status, ttfbMs: Math.round(ttfbMs), totalMs: Math.round(performance.now() - started),
    decodedBytes: body.length, contentType: response.headers.get("content-type"), robots: response.headers.get("x-robots-tag"),
    cacheControl: response.headers.get("cache-control"), nextCache: response.headers.get("x-nextjs-cache"),
    netlifyCache: response.headers.get("cache-status"), netlifyRequestId: response.headers.get("x-nf-request-id") };
  results.push(result);
  if (result.status !== expected) errors.push({ route, reason: `Expected ${expected}, got ${result.status}` });
  if (!result.robots?.includes("noindex")) errors.push({ route, reason: "Missing preview noindex header" });
  return { ...result, html: body.toString(), headers: response.headers };
}
const locations = (xml) => [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => decode(match[1]));
try {
  const index = await request("/sitemap.xml");
  const sitemapUrls = locations(index.html);
  assert.ok(sitemapUrls.length, "Sitemap index has no entries");
  const pageUrls = [];
  for (const url of sitemapUrls) {
    assert.equal(new URL(url).origin, origin, "Sitemap must use the trial origin");
    pageUrls.push(...locations((await request(new URL(url).pathname)).html));
  }
  for (const url of new Set(pageUrls)) {
    const parsed = new URL(url); assert.equal(parsed.origin, origin);
    const route = parsed.pathname;
    const response = await request(route);
    const h1 = [...response.html.matchAll(/<h1\b/g)].length;
    const canonical = decode(response.html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1] || "");
    const description = response.html.match(/<meta name="description" content="([^"]+)"/)?.[1];
    const schema = [...response.html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((match) => JSON.parse(match[1]));
    if (h1 !== 1 || canonical !== url || !description) errors.push({ route, reason: "SSR metadata, canonical or H1 failure", h1, canonical });
    for (const match of response.html.matchAll(/<img\b[^>]*src="([^"]+)"/g)) {
      const image = new URL(decode(match[1]), origin);
      if (image.origin === origin) images.add(image.pathname + image.search);
    }
    pages.push({ route, canonical, h1, schemaTypes: schema.map((entry) => entry["@type"]) });
  }
  for (const route of ["/products?page=2", "/products?sort=name-az", "/products?q=Trial", "/contact?subject=Quotation", "/admin/login", "/robots.txt"]) await request(route);
  for (const route of ["/products?page=999", "/products?page=1.5", "/products?page=0", "/blog?page=999", "/products/not-a-product", "/guides/not-a-guide", "/products?q=" + "x".repeat(121)]) await request(route, 404);
  const admin = await request("/admin", 307);
  assert.ok(admin.headers.get("location")?.includes("/admin/login"), "Anonymous admin access was not denied");
  for (const image of images) {
    const result = await request(image);
    if (!result.contentType?.startsWith("image/")) errors.push({ route: image, reason: "Invalid optimized image content type" });
  }
  for (const route of ["/opengraph-image", "/guides/floor-scrubber-cleaning-capacity-calculator/social-image"]) {
    const result = await request(route);
    if (!result.contentType?.startsWith("image/")) errors.push({ route, reason: "Social image generation failed" });
  }
  // Repeated responses establish local cache headers and timing, not Netlify billed compute.
  for (const route of ["/", "/products", "/catalog-sitemap.xml"]) for (let i = 0; i < 3; i++) await request(route);
} catch (error) { errors.push({ reason: error.message }); }
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify({ origin, testedAt: new Date().toISOString(),
  backend: host.endsWith(".netlify.app") ? "Must verify isolated real services separately" : "Synthetic transport; not real service integration",
  pages, optimizedImages: images.size, requests: results, errors,
  netlifyCredits: null, billedBandwidth: null, serverlessGbHours: null }, null, 2));
console.log(JSON.stringify({ pages: pages.length, optimizedImages: images.size, requests: results.length, errors }, null, 2));
if (errors.length) process.exitCode = 1;
