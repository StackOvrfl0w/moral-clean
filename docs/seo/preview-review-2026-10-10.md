# Preview release and production restoration — 10 October 2026

Production was restored to the pre-SEO deployment `dpl_Eet82YisYPevDFQQDFHyFJttNndE`, built from master commit `253902d05d522a747c589130875360117c40e815`. Vercel's older-deployment rollback required a paid upgrade, so the same verified production deployment was restored by promotion. No master commit or push was made.

All working-copy changes, including the pre-existing homepage/favicon edits, were saved in `adc5e97` on `codex/seo-preview-2026-10-10` and pushed to `preview`. The tested preview deployment is [moral-clean-855r9bto6](https://moral-clean-855r9bto6-burhan-uddins-projects-91e8a924.vercel.app), ID `dpl_6vLwmR1DSg7NYDp29PrSDuEBuLK5`. Production releases now require explicit user approval, recorded in `AGENTS.md`.

## Sentry issue

The supplied email reports `Unable to load the product catalog` for `/products/category/single-disk-machine?page=999&nxtPslug=single-disk-machine`. This matches the invalid-pagination verification request. Master already contains a range query that throws before the page checks its page count; it has no handling for Supabase's `PGRST103` out-of-range response. The initial SEO deployment inherited that defect. The final SEO release, now preserved on preview, recovers the filtered count and returns 404 for out-of-range pages. Product listings and blog pagination use the same recovery.

Restoring the old master deployment also restores its old pagination behavior. The fix has not been released to production under the new approval rule. No claim is made that the Sentry issue was marked resolved or that the entire Sentry event history was inspected; the email, source and HTTP regression checks provide the evidence here.

## Audit scope

The fresh preview audit checks the actual protected deployment through authenticated Vercel access: sitemap URLs, titles, canonicals, H1 counts, indexability rules, all product markup and specifications, excluded routes, and the exact Sentry URL. A preliminary unauthenticated/protection-page response was rejected as invalid evidence. The final results are stored in `preview-verification-2026-10-10.json`.

Final result: **54 sitemap pages, 36 product pages, 11 exclusion checks, zero errors.** The exact Sentry query returned 404 with noindex. A separate valid `/products?page=2` check returned 200, remained indexable in application metadata, and used `https://moralclean.com/products?page=2` as its canonical. Vercel Deployment Protection was kept enabled. These are deployment HTTP checks, not a new full Semrush campaign crawl.

TypeScript, ESLint and nine isolated enquiry tests passed. The preview cloud build also passed compilation, lint and type checks. These checks cannot prove every SEO or business fact is perfect: manufacturer datasheets, steam models, backlinks, performance measurements and future rankings remain outside this verification. No full three-month campaign was executed.

The database is shared by preview and production. The previously added steam category and three revised service descriptions remain there; restoring a deployment does not roll back database records. Their originals are saved in `backups/catalog-before-2026-10-09.json`.

## Plugin use and practical value

| Tool | Use | Practical contribution |
| --- | --- | --- |
| Semrush | Pakistan keyword metrics, competitor results, existing site audit and backlink reports | Helped select page topics and distinguish useful audit findings from superficial warnings. Its connector did not support expanding the existing one-keyword campaign. |
| Serpstat | Keyword research, existing-project configuration, competitor tracking, rank baseline and fresh steam-page audit | Added 22 targets in eight groups for Google Pakistan mobile/English; the initial manual rank run used 22 rank-check units. The steam audit scored 99 with zero high/medium findings. |
| HYPD / Search Console | Property access, search-performance baseline, sitemap status and URL inspection | Supplied actual Google data: 19 clicks and 147 impressions for 9 September–6 October. This measures visibility rather than estimating it. |
| Vercel | Deployment/project inspection, build verification, production restoration and authenticated preview testing | Controlled release environments and verified the actual deployed pages. CLI authentication was used after the connector's team-scope access failed. |

Exact total API-call counts and account charges were not recorded. The 22 rank-check units are a known usage figure, not a total across all plugin features. The plugins helped research and measurement; source edits and functional fixes were performed in the repository. No ranking improvement attributable to these edits has been established.
