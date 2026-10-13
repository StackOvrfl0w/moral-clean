import fs from "node:fs";
const samples = [];
// Bounded anonymous GET-only production sampling. No browser JS, form posts or admin sessions.
for (const route of ["/", "/products", "/contact", "/guides", "/catalog-sitemap.xml"]) {
  for (let iteration = 0; iteration < 3; iteration++) {
    const start = performance.now();
    const response = await fetch("https://moralclean.com" + route, { signal: AbortSignal.timeout(20000), redirect: "manual" });
    const ttfbMs = performance.now() - start;
    const body = await response.arrayBuffer();
    samples.push({ route, iteration, status: response.status, ttfbMs: Math.round(ttfbMs), totalMs: Math.round(performance.now() - start),
      decodedBytes: body.byteLength, cache: response.headers.get("x-vercel-cache"), cacheControl: response.headers.get("cache-control") });
  }
}
fs.mkdirSync("docs/migration", { recursive: true });
fs.writeFileSync("docs/migration/vercel-readonly-baseline.json", JSON.stringify({ sampledAt: new Date().toISOString(), origin: "https://moralclean.com",
  scope: "15 anonymous GETs from this machine; not a load test or representative monthly usage; decoded bytes are not billed bandwidth",
  actualVercelCpu: null, actualVercelMonthlyBandwidth: null, actualVercelMonthlyRequests: null, samples }, null, 2));
console.log(JSON.stringify({ samples: samples.length, statuses: [...new Set(samples.map((sample) => sample.status))] }));
