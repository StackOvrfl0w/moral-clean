# Netlify Free trial setup — pending external-service approval

Branch: `codex/netlify-free-trial`. Base master: `2e3f979d0ec0fa34973d40187f43551daffab68f`.
No external project, account connection or deployment has been created.

## Approval scope

Authorize creating one new Netlify Free site, one isolated Supabase Free project (only if a free slot is available), a separate free ImageKit account, and a test-only Resend account/key. Authorize synthetic database/storage/email tests in those services. Authorize pushing only this feature branch if Git integration is selected. No master push, production deployment, paid add-on, DNS, Search Console or live-service change is included.

If no free Supabase project slot exists, stop. Do not delete an existing project or upgrade. A local Supabase instance can support local tests, but it cannot prove Netlify's connection to a hosted test backend without a separately approved reachable test service.

## Accounts and credential handling

1. Sign in to Netlify and use a Free team. Review all other sites sharing its 300-credit allowance. Keep paid upgrades and paid add-ons off.
2. Use Add new project / Import an existing project after feature-branch push approval. Restrict GitHub repository access to MoralClean. Select `codex/netlify-free-trial` as this NEW site's deploy branch; do not select master. A deploy from this branch may be called a production deploy by Netlify because it serves the new site's primary netlify.app URL. It is still isolated from MoralClean production and can cost 15 credits.
3. Name the dedicated trial site, copy its HTTPS `*.netlify.app` URL, and configure environment settings before the first successful build. Do not attach a custom domain. An initial build without the test settings will fail closed.
4. Create a separate Supabase Free project, choose a region near the functions region, and record its project reference. Do not copy .env.local or Vercel secrets. Apply the existing schema/index SQL plus `isolated-bootstrap.sql` ONLY to the isolated project after approval. Create dedicated admin and non-admin users. Add the admin membership row as described in that script.
5. Create a separate ImageKit Free account; obtain its public/private API keys. Confirm that the account and upload destination differ from the existing ImageKit account. Do not reuse live ImageKit keys.
6. Use a test-only Resend account/key with `onboarding@resend.dev` and the account owner's verified mailbox as recipient. This avoids new DNS verification. The sandbox sender's recipient restriction must be tested; it does not prove delivery with MoralClean's production sender domain. Do not use `info@moralclean.com` as recipient.
7. Put secrets into the new site's environment UI, scoped to builds and functions, and to all contexts used by the trial. Never paste secrets into chat, repository files or shell commands. If CLI access is needed later, run `netlify login` locally and complete browser OAuth after approval; keep .netlify state ignored. No Netlify connector was returned by provider discovery in this session.

## Required environment variables

| Variable | Value |
|---|---|
| NEXT_PUBLIC_SITE_URL | The new HTTPS netlify.app origin, without a path |
| NEXT_PUBLIC_SUPABASE_URL | The isolated project's HTTPS Supabase URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Isolated project's anon key |
| SUPABASE_SERVICE_ROLE_KEY | Isolated project's server-only key |
| TRIAL_SUPABASE_PROJECT_REF | Isolated project reference, matching the URL |
| TRIAL_SERVICES_CONFIRMED | `true` only after verifying all service credentials belong to test services |
| RESEND_API_KEY | Test-only Resend key |
| RESEND_FROM_EMAIL | `onboarding@resend.dev` |
| RESEND_TO_EMAIL | The verified test mailbox |
| TRIAL_EMAIL_RECIPIENT | Exactly the same test mailbox |
| IMAGEKIT_PUBLIC_KEY | Separate test account public key |
| IMAGEKIT_PRIVATE_KEY | Separate test account private key |

The repository's netlify.toml sets Node 22, Bun 1.4.2, frozen-lockfile installation, trial mode, preview noindex and Next.js skew protection. Netlify should auto-detect Next.js and install the OpenNext adapter. Build command: `bun run build:netlify-trial`; publish directory: `.next`. Do not use static export, drag-and-drop deployment or an SPA catch-all redirect. Adapter/build-image compatibility remains unverified until a real Netlify build completes.

Leave PostHog keys, Sentry DSNs/auth token and Google verification unset. The trial disables runtime analytics even if a key is mistakenly present; the build also rejects those settings. Do not import team-wide live environment variables. Public variables are compiled into browser bundles, so rebuild after changing them.

The current password login needs no production Supabase redirect configuration changes. Test password login, admin membership, cookie refresh and logout on the isolated project. Configure redirect URLs only in that project if reset/OAuth flows are later added.

## Acceptance checks after deployment

- Confirm the hostname and Supabase project reference before ANY write test. Confirm bucket ID `product images`, 5 MiB size limit, allowed raster MIME types and admin-only Storage policies.
- Run `node scripts/verify-netlify-trial.mjs https://<trial>.netlify.app docs/migration/netlify-preview-http.json` against the hosted trial. The runner performs GETs only. The synthetic page-2 checks assume at least 13 test products; seed at least 30 fictional products across representative categories.
- In the hosted browser, exercise desktop/mobile pages, valid/invalid contact and quote forms, honeypots, password login, non-admin denial, cookie renewal/logout, all admin CRUD, submission deletion, settings edits, five-row CSV chunks, ImageKit uploads and cleanup, and signed Storage uploads of small/1–5 MiB/oversize/spoofed files. No write testing with production credentials.
- Prove both time-based ISR and path/tag revalidation on real Netlify infrastructure. Change a test record through the admin action, verify the public page and sitemap change, and verify a record changed directly in the isolated backend eventually refreshes. Settings have no timed expiry; mutate settings through the application action.
- Verify canonical/OG/JSON-LD output, sitemap entries, public noindex headers including images/error pages, admin redirects, CSP, sensitive-key absence in browser bundles and authenticated response isolation. Temporary trial URLs remain noindex; production SEO settings are not changed.
- Capture HTML TTFB, LCP, CLS, INP under repeatable mobile conditions, decoded and transferred bytes, cold/warm image latency, cache hits, function durations/errors, and multiple-region response timing. Local timing is not a Netlify performance result.
- Observe for at least seven representative days; allow billing meters to settle. Capture before/after credit dashboard values and production deploy counts separately. Include bot traffic, preview traffic, all team sites and cold-cache bursts. Do not extrapolate scripted crawl traffic as actual customer demand.
- Export matching Vercel Usage totals for requests, transfer, active CPU/provisioned memory, cache behavior and failures. Existing read-only timing samples are a limited baseline, not a monthly traffic/cost baseline. Do not purchase observability access.

## Budget and decision

Current rate model: `15 × production deploys + 20 × GB delivered + 10 × GB-hours compute + 2 × requests/10,000 + other team credits`. See `netlify-credit-projection.mjs`. Do not substitute Vercel active CPU hours for Netlify GB-hours. Browser decoded bytes are not Netlify billed bandwidth.

Require complete real-service functionality and a conservative projected total at or below 210 credits/month, leaving a proposed 30% reserve. Recalculate with at least a 2× traffic stress scenario. Passing local tests does not establish credit headroom. Free-site suspension at 300 credits remains an availability limit; there is no paid overage authorization.

Netlify rollback changes code/cache state only. It does not undo database or image-storage mutations. The isolated trial's data and accounts remain separate from live services. No custom-domain migration is included in Phase 1.

Sources checked 13 October 2026:
- https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/
- https://docs.netlify.com/build/functions/configuration/
- https://docs.netlify.com/build/configure-builds/manage-dependencies/
- https://www.netlify.com/pricing/
- https://www.netlify.com/pricing/personal-vs-free/
- https://supabase.com/docs/reference/javascript/storage-from-createsigneduploadurl
- https://supabase.com/docs/reference/javascript/storage-from-uploadtosignedurl
