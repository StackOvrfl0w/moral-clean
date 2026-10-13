# MoralClean Netlify trial — local preparation result

Date: 13 October 2026. Branch: `codex/netlify-free-trial`.
Base: latest remote master `2e3f979d0ec0fa34973d40187f43551daffab68f`.

**GO for the next isolated deployment step, subject to the user's external-service approval. NO-GO for moving moralclean.com. Phase 1 is not complete.** There is no hosted Netlify preview URL yet, and no actual Netlify billing/runtime measurement. A claim that 300 credits provides adequate MoralClean headroom would currently be unsupported.

## Implemented locally

- Dedicated netlify.toml uses automatic Next.js/OpenNext detection, `.next` output, Node 22, Bun 1.4.2 and frozen-lockfile builds. It does not export a static site. Netlify skew protection is enabled. Bun 1.4.2's release exists; this machine's actual local Bun is 1.4.0, so Netlify's exact build environment remains to be tested.
- A preflight build rejects the live Supabase project, a mismatched test-project declaration, non-netlify.app site URL, missing test-service credentials, production mailboxes and analytics/verification credentials. Service-account separation still requires manual verification; the confirmation flag is not cryptographic proof that Resend/ImageKit keys are separate.
- Trial noindex/nofollow is applied through Next.js headers, root metadata and Netlify headers. Host-independent preview flags also cover Netlify branch/deploy contexts. Trial canonicals and sitemaps use the configured trial origin.
- Ordinary product/category/service/blog cover images now use admin-authorized signed direct uploads to Supabase Storage. The browser validates raster signatures and the 5 MiB limit; a server action signs a generated admin-owned path; another downloads and validates actual bytes before returning an attachable URL. Invalid bytes are removed best-effort. The 1 MB Server Action limit remains for small metadata/record actions; file bytes bypass Netlify's approximately 4.5 MB binary request limit.
- Existing ImageKit CSV/blog upload paths remain. Trial telemetry and Search Console verification are disabled, and mail is restricted to an explicit test mailbox.
- Added credential-free synthetic fixtures, HTTP/browser verification, read-only Vercel sampling and a credit-projection calculator. No additional production dependency was installed.

## Verified evidence

| Check | Result | Evidence |
|---|---|---|
| Regression/security tests | 44 passed, 194 assertions, seven files run in separate processes to isolate module mocks | regression-results.json and terminal test output |
| TypeScript | Passed both workspace and isolated build checks | local `tsc --noEmit`; Next.js build type checks |
| Lint | Passed without warnings/errors | `bun run lint` |
| Production-mode local build | Passed; 85 generated entries, public SSG and dynamic listings/contact/admin preserved | isolated `.trial-local/site/.next`; build output |
| Public HTTP/SEO/image checks | 64 sitemap pages, 13 optimized images, 105 requests; zero errors | netlify-local-http.json |
| Desktop/mobile browser templates | 20 checks at 1440×1000 and 390×844; zero page errors, horizontal overflow or broken eager images | netlify-local-browser.json and screenshots/ |
| Contact and quotation UI → Server Action → response | Passed, two synthetic records and two synthetic email calls during final browser run | netlify-local-browser.json; ignored synthetic transport log |
| Local caching | Repeated homepage and catalog sitemap responses report `x-nextjs-cache: HIT`; dynamic listings remain server-rendered | netlify-local-http.json |
| Vercel anonymous baseline | 15 GETs, all 200; no browser JS, POSTs or authenticated requests | vercel-readonly-baseline.json |

No .env files or Vercel/Netlify auth state were copied to the local build. The runner whitelists OS environment variables, supplies fake keys, intercepts the synthetic Supabase/Resend endpoints and rejects other external server requests. The production database was not used for write tests. The screenshots contain synthetic catalog entries, not customer data.

The existing QuickQuoteForm component is not mounted by current master routes. Its action remains covered by existing mocked tests; quotation requests in the browser use the actual `/contact?subject=Quotation` flow. No new public quotation UI was invented.

Local mobile observations: LCP approximately 76–208 ms in unthrottled localhost Chrome; observed CLS 0 for the tested loads; resource transfer approximately 0.30–0.43 MB excluding the document. INP was not measured. These figures are not representative of mobile networks or real Netlify execution and must not be used as a hosting speed comparison.

## Vercel comparison

Limited median HTML TTFB from this machine (three sequential anonymous requests per route):

| Route | Current Vercel median | Observed cache |
|---|---:|---|
| / | 299 ms | STALE, HIT, HIT |
| /products | 543 ms | MISS, MISS, MISS |
| /contact | 390 ms | MISS, MISS, MISS |
| /guides | 63 ms | STALE, HIT, HIT |
| /catalog-sitemap.xml | 97 ms | STALE, HIT, HIT |

There are no comparable hosted Netlify timings yet. Localhost timing is excluded from a provider ranking. Vercel monthly requests/bandwidth/CPU and the production deployment's exact commit were not established by these HTTP samples. Both platforms support the rendering architecture; Netlify adds an adapter boundary, credit-based transfer/request/compute billing and a Free-tier pause threshold. Vercel active CPU metrics cannot be directly substituted for Netlify memory-time compute.

## Actual limitations and unresolved gates

- Netlify, Supabase test project, test ImageKit account and test Resend account are not connected or created. External writes and feature-branch push are pending explicit approval.
- Real admin login, session renewal/logout, non-admin RLS denial, admin CRUD, actual signed Storage uploads, ImageKit imports/cleanup, Resend delivery and error recovery remain unverified on the target platform.
- Time-based ISR and tag/path invalidation across Netlify's caches, regional cold starts, deployment skew, real mobile network performance and load behavior remain unverified.
- Actual Netlify credits, billed bandwidth and function GB-hours are unknown, not zero. All evidence files use null for unavailable billing data.
- Free-tier project availability must be checked before provisioning. Stop if creating an isolated Supabase project requires deleting a project or paying.
- The existing checked-in Supabase schema lacks admin_users/site_settings/admin-write/Storage setup. Prepared isolated-bootstrap.sql fills those gaps for a new test project only; it has not been executed or checked against a real isolated database. The code's bucket ID is `product images`, despite an outdated schema comment using `product-images`.
- Next.js 14 is listed as unsupported by the current framework support policy. This trial deliberately preserves 14.2.35; a supported-version upgrade remains a separate production-readiness requirement.
- The trial removes Sentry instrumentation/telemetry to avoid live analytics. A later production migration would need separate validation of the chosen observability configuration.
- Signature checks preserve the existing validation model; they are not a complete malware/content-decoding audit. Signed uploads require the isolated bucket's 5 MiB and MIME constraints; pending/failed uploads can leave test-storage objects requiring inspection/cleanup.

## Cost and headroom

Netlify Free's listed hosting price is $0/month with 300 team credits/month. Current formula:

`15 × production deploys + 20 × GB delivered + 10 × GB-hours compute + 2 × web requests / 10,000 + other team credits`

Illustrative only: four deploys, 5 GB transfer, one GB-hour and 100,000 requests = **190 credits**, leaving 110 credits (36.7%). Doubling traffic-dependent usage yields **320 credits**, exceeding the cap. These are assumptions, not a MoralClean forecast. The repository's example calculator input is clearly labeled accordingly.

No monthly cost beyond $0 is authorized. On Free, hitting the allowance pauses projects rather than establishing uninterrupted uptime. Other service limits remain separate; no paid backup, add-on, database or email upgrade is included. Export daily Free observability snapshots because the current pricing page lists only one-day history. Collect at least seven representative days plus current Vercel traffic totals before extrapolation. Proposed acceptance reserve: at least 30%, with bot/spike sensitivity and team-wide usage included.

## Approval required to continue

The concrete configuration and test-service setup are in netlify-trial-setup.md. Approve only a new Netlify Free trial site on its netlify.app domain, separate free test services, synthetic write/email tests and feature-branch push if Git integration is used. This approval does not include master, the production domain, DNS, Search Console, customer records or paid upgrades.

Sources: [Netlify Next.js](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/), [function limits](https://docs.netlify.com/build/functions/configuration/), [pricing](https://www.netlify.com/pricing/), [Free pause behavior](https://www.netlify.com/pricing/personal-vs-free/), [Next.js support policy](https://nextjs.org/support-policy).
