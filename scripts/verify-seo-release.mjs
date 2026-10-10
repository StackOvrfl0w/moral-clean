import fs from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const origin = process.argv[2] || "https://moralclean.com";
const output = process.argv[3] || "docs/seo/live-verification-2026-10-09.json";
const protectedPreview = new URL(origin).hostname.endsWith(".vercel.app");
const runFile = promisify(execFile);
const request = async (url) => {
  if (protectedPreview && process.env.VERCEL_CLI_PATH) {
    const target = new URL(url);
    if (target.origin !== origin) throw new Error("Preview request origin mismatch");
    const { stdout } = await runFile(process.execPath, [process.env.VERCEL_CLI_PATH, "curl", target.pathname + target.search, "--deployment", origin, "--scope", "burhan-uddins-projects-91e8a924", "--", "--silent", "--show-error", "--max-time", "60", "--write-out", "\\nSEO_HTTP_STATUS:%{http_code}"], { maxBuffer: 12 * 1024 * 1024, timeout: 90000 });
    const marker = stdout.lastIndexOf("\nSEO_HTTP_STATUS:");
    if (marker < 0) throw new Error("Missing preview HTTP status");
    return new Response(stdout.slice(0, marker), { status: Number(stdout.slice(marker + 17).trim()) });
  }
  return fetch(url, protectedPreview && process.env.VERCEL_OIDC_TOKEN
  ? { headers: { "x-vercel-trusted-oidc-idp-token": process.env.VERCEL_OIDC_TOKEN } }
  : undefined);
};
const errors = [];
const extractLocations = (xml) => Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g), (match) => match[1]);
const index = await request(`${origin}/sitemap.xml`);
if (!index.ok) throw new Error(`Sitemap index: ${index.status}`);
const children = extractLocations(await index.text());
if (!children.length) throw new Error("No child sitemaps found; verify access to the application rather than a protection page");
const locations = [];
for (const child of children) {
  const response = await request(origin + new URL(child).pathname);
  if (!response.ok) throw new Error(`Child sitemap: ${response.status}`);
  locations.push(...extractLocations(await response.text()));
}
if (locations.some((url) => url.includes("/cleaning-chemicals"))) errors.push("Empty chemicals category is included in the sitemap");
if (!locations.some((url) => url.includes("/steam-cleaners"))) errors.push("Steam category is missing from the sitemap");
for (const {slug} of JSON.parse(fs.readFileSync("src/content/service-pages.json", "utf8"))) {
  if (!locations.includes("https://moralclean.com/services/" + slug)) errors.push("Service page missing from sitemap: " + slug);
}
for (const {slug} of JSON.parse(fs.readFileSync("src/content/planning-guides.json", "utf8"))) {
  if (!locations.includes("https://moralclean.com/guides/" + slug)) errors.push("Planning guide missing from sitemap: " + slug);
}
const results = [];
const linkGraph = new Map();
const queue = [...new Set(locations)];
async function worker() {
  while (queue.length) {
    const url = queue.shift();
    const path = new URL(url).pathname;
    const response = await request(origin + path);
    const html = await response.text();
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/)?.[1];
    const noindex = /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html);
    const h1Count = (html.match(/<h1\b/g) || []).length;
    const schemas = Array.from(html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs), (match) => JSON.parse(match[1]));
    const product = schemas.find((schema) => schema["@type"] === "Product");
    const service = schemas.find((schema) => schema["@type"] === "Service");
    const article = schemas.find((schema) => schema["@type"] === "Article");
    if (response.status !== 200 || !title || h1Count !== 1 || canonical !== url || noindex) errors.push(`Page checks failed: ${path}`);
    if (/(?:\|\s*Moral Clean\s*){2}/.test(title || "")) errors.push(`Repeated title suffix: ${path}`);
    if (path.startsWith("/products/") && !path.startsWith("/products/category/") && (!product || !html.includes("Technical specifications"))) errors.push(`Product details/schema missing: ${path}`);
    if (product && (product.offers || product.aggregateRating || product.review)) errors.push(`Unverified commercial schema: ${path}`);
    if (path.startsWith("/guides/") && (!article || !article.datePublished || !article.headline || !html.includes('aria-label="Article contents"'))) errors.push(`Article metadata or contents missing: ${path}`);
    if (article && (!Array.isArray(article.image) || article.image.length < 2 || !article.image.every((image) => image.startsWith("https://moralclean.com/")) || !html.includes(`${path}/social-image`))) errors.push(`Article images or social preview missing: ${path}`);
    if (path.startsWith("/services/") && (!service || service.url !== url || service.provider?.["@id"] !== "https://moralclean.com/#organization" || !html.includes('id="enquiry-checklist"') || (html.match(/<details\b/g) || []).length !== 3)) errors.push(`Service content/schema missing: ${path}`);
    if (path === "/guides/floor-scrubber-cleaning-capacity-calculator" && (!html.includes("data-capacity-minutes") || !html.includes("205") || !html.includes("capacity-utilization-hint"))) errors.push("Calculator initial output or labelled controls missing");
    const internalLinks = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match => { try { const target = new URL(match[1].replace(/&amp;/g, "&"), "https://moralclean.com" + path); return target.origin === "https://moralclean.com" && !target.search ? target.pathname : null; } catch { return null; } }).filter(Boolean);
    linkGraph.set(path, [...new Set(internalLinks)]);
    if (schemas.some(schema => schema["@type"] === "WebSite" && schema.potentialAction)) errors.push("Obsolete site-search action remains: " + path);
    if (path === "/" || product) for (const {slug} of JSON.parse(fs.readFileSync("src/content/service-pages.json", "utf8"))) if (!internalLinks.includes("/services/" + slug)) errors.push("Contextual service link missing: " + path + " -> " + slug);
    results.push({ path, status: response.status, title, canonical, noindex, h1Count, schemaTypes: schemas.map((schema) => schema["@type"]), fullSpecifications: product ? html.includes("Technical specifications") : undefined });
  }
}
await Promise.all(Array.from({ length: 4 }, () => worker()));
const reachable = new Set(["/"]);
const crawlQueue = ["/"];
while (crawlQueue.length) { for (const path of linkGraph.get(crawlQueue.shift()) || []) if (linkGraph.has(path) && !reachable.has(path)) { reachable.add(path); crawlQueue.push(path); } }
const unreachable = [...linkGraph.keys()].filter(path => !reachable.has(path));
if (unreachable.length) errors.push("Sitemap URLs unreachable through canonical internal links: " + unreachable.join(", "));
const internalLinkAudit = { pages: linkGraph.size, reachableFromHome: reachable.size, unreachable, edges: [...linkGraph.values()].reduce((count, links) => count + links.filter(path => linkGraph.has(path)).length, 0) };
const checks = [];
for (const [path, expected] of [["/services/unknown-service", 404], ["/products/test-prod", 404], ["/products/test-prod2", 404], ["/blog/blog-test", 404], ["/blog/blog-test1", 404], ["/blog/blogtest2", 404], ["/products/category/cleaning-chemicals", 200], ["/products/category/single-disk-machine?brand=Biemmedue", 200], ["/products/category/single-disk-machine?page=999", 404], ["/products/category/single-disk-machine?page=999&nxtPslug=single-disk-machine", 404], ["/products?page=999", 404], ["/blog?page=999", 404]]) {
  const response = await request(origin + path);
  const html = await response.text();
  const noindex = /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html);
  if (response.status !== expected || !noindex) errors.push(`Exclusion checks failed: ${path}`);
  checks.push({ path, status: response.status, expected, noindex });
}
const result = { testedAt: new Date().toISOString(), origin, sitemapUrls: locations.length, productPages: results.filter((row) => row.schemaTypes.includes("Product")).length, errors, internalLinkAudit, pages: results.sort((a, b) => a.path.localeCompare(b.path)), exclusionChecks: checks };
fs.writeFileSync(output, JSON.stringify(result, null, 2));
console.log(JSON.stringify({ sitemapUrls: result.sitemapUrls, productPages: result.productPages, exclusionChecks: checks.length, internalLinkAudit, errors }, null, 2));
if (errors.length) process.exitCode = 1;
