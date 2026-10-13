const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(path.join(process.env.PLAYWRIGHT_MODULE_DIR, "playwright"));

async function main() {
  const origin = process.env.TRIAL_BROWSER_ORIGIN || "http://localhost:3017";
  if (!/^http:\/\/(localhost|127\.0\.0\.1):3017$/.test(origin)) {
    throw new Error("This synthetic write-test runner is restricted to the isolated localhost server");
  }
  const directory = "docs/migration/screenshots";
  fs.mkdirSync(directory, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const results = [], errors = [], externalBlocked = new Set();
  const initialLog = fs.readFileSync(".trial-local/start-transport.jsonl", "utf8").trim().split("\n").filter(Boolean).length;
  try {
    for (const [device, viewport] of [["desktop", { width: 1440, height: 1000 }], ["mobile", { width: 390, height: 844 }]]) {
      const context = await browser.newContext({ viewport, isMobile: device === "mobile", hasTouch: device === "mobile" });
      await context.addInitScript(() => {
        window.__trialMetrics = { lcpMs: null, cls: 0 };
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) window.__trialMetrics.lcpMs = entry.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__trialMetrics.cls += entry.value;
        }).observe({ type: "layout-shift", buffered: true });
      });
      await context.route("**/*", async (route) => {
        const url = new URL(route.request().url());
        if (url.origin === origin || ["data:", "blob:"].includes(url.protocol)) return route.continue();
        externalBlocked.add(url.hostname); return route.abort();
      });
      const page = await context.newPage();
      page.on("pageerror", (error) => errors.push({ device, reason: error.message }));
      for (const route of ["/", "/products", "/products?page=2", "/products/trial-equipment-1", "/products/category/floor-cleaning-machines", "/blog", "/guides/floor-scrubber-cleaning-capacity-calculator", "/services/cleaning-machine-parts", "/contact", "/admin/login"]) {
        const response = await page.goto(origin + route, { waitUntil: "networkidle" });
        const details = await page.evaluate(() => ({
          width: window.innerWidth, scrollWidth: document.documentElement.scrollWidth,
          h1: document.querySelector("h1")?.textContent,
          brokenImages: [...document.images].filter((image) => image.loading !== "lazy" && image.complete && image.naturalWidth === 0).map((image) => image.src),
          resourceBytes: performance.getEntriesByType("resource").reduce((sum, entry) => sum + entry.transferSize, 0),
          largestContentfulPaintMs: window.__trialMetrics.lcpMs,
          cumulativeLayoutShift: window.__trialMetrics.cls,
          inpMs: null,
        }));
        results.push({ device, route, status: response.status(), ...details });
        if (response.status() !== 200 || details.scrollWidth > details.width + 1 || details.brokenImages.length) errors.push({ device, route, reason: "HTTP, horizontal overflow or eager image failure", ...details });
        if (["/", "/products", "/contact"].includes(route)) {
          const name = `${directory}/${device}-${route === "/" ? "home" : route.slice(1)}`;
          await page.screenshot({ path: `${name}.png`, fullPage: true });
          if (device === "mobile") await page.screenshot({ path: `${name}-viewport.png` });
        }
      }
      if (device === "mobile") {
        await page.goto(origin + "/contact", { waitUntil: "networkidle" });
        await page.locator('[name="name"]').fill("Synthetic Trial Tester");
        await page.locator('[name="phone"]').fill("+923000000000");
        await page.locator('[name="email"]').fill("tester@example.invalid");
        await page.locator('[name="message"]').fill("Isolated local Server Action test; no customer data.");
        await page.getByRole("button", { name: "Send Message", exact: true }).click();
        await page.getByRole("heading", { name: "Message Received" }).waitFor();
        results.push({ device, flow: "contact Server Action to synthetic DB/email transport", status: "PASS" });
        await page.goto(origin + "/contact?subject=Quotation&product=trial-equipment-1", { waitUntil: "networkidle" });
        await page.locator('[name="name"]').fill("Synthetic Quote Tester");
        await page.locator('[name="phone"]').fill("+923000000000");
        await page.locator('[name="email"]').fill("tester@example.invalid");
        await page.locator('[name="message"]').fill("Isolated fixture equipment quotation.");
        await page.getByRole("button", { name: "Send Message", exact: true }).click();
        await page.getByRole("heading", { name: "Message Received" }).waitFor();
        results.push({ device, flow: "existing quotation contact route to synthetic DB/email transport", status: "PASS" });
      }
      await context.close();
    }
  } catch (error) { errors.push({ reason: error.message }); }
  finally { await browser.close(); }
  const log = fs.readFileSync(".trial-local/start-transport.jsonl", "utf8").trim().split("\n").slice(initialLog).map((line) => JSON.parse(line));
  const writes = log.filter((entry) => entry.sink === "mock-contact").length;
  const emails = log.filter((entry) => entry.sink === "mock-email").length;
  if (writes < 2 || emails < 2) errors.push({ reason: "Expected both synthetic form records and emails", writes, emails });
  fs.writeFileSync("docs/migration/netlify-local-browser.json", JSON.stringify({ testedAt: new Date().toISOString(), origin,
    scope: "Synthetic local backend, desktop/mobile Chrome; real auth, RLS, storage and email delivery remain unverified",
    results, syntheticContactWrites: writes, syntheticEmails: emails, externalHostsBlocked: [...externalBlocked], errors }, null, 2));
  console.log(JSON.stringify({ pageChecks: results.filter((entry) => entry.route).length, syntheticContactWrites: writes, syntheticEmails: emails, errors }));
  if (errors.length) process.exitCode = 1;
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
