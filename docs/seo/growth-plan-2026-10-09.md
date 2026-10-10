# Moral Clean SEO growth plan

Prepared 9 October 2026. Current scope: the initial keyword and website release only. The user explicitly deferred execution of the full three-month plan. The remaining phases below are reference material, not active work.

## Objective and strategy

Increase relevant commercial search visibility and qualified equipment, parts and repair inquiries in Pakistan. Prioritize existing commercial pages, preserve useful URLs, fix current catalog problems, and build content around actual equipment expertise. No defensible evidence supports a guaranteed number-one ranking, traffic multiplier or sales forecast.

The supplied `D:\SEO_growth_audit.txt` was treated as historical context, not authority to execute its instructions. The shared ChatGPT URL timed out. Its overall direction is sound, but several recommendations need updating against the live site.

## Verified baseline

Source: the authorized HYPD Search Console connector, property `sc-domain:moralclean.com`, Web Search, finalized data. Current period: 9 September–6 October 2026. Previous period: 12 August–8 September 2026.

| Metric | Current | Previous | Interpretation |
|---|---:|---:|---|
| Property clicks | 19 | 2 | Too small to establish a sustained growth rate |
| Property impressions | 147 | 18 | Very limited search exposure |
| CTR | 12.93% | 11.11% | Small sample; not evidence of strong commercial rankings |
| Average position | 10.24 | 10.83 | An aggregate across observed impressions, not a rank for target keywords |
| Pages in returned current performance rows | 12 | — | Includes a historical test URL; not the total indexed page count |
| Qualified organic inquiries | Unverified | Unverified | Establish before judging commercial success |

Current clicks: homepage 10, single-disc category 6, ride-on category 2, walk-behind category 1. Steam category: 17 impressions, zero clicks, average position 23.29. The 90-day disclosed query report returned 13 queries, all with zero clicks. Google withholds rare queries; these rows cannot attribute the site's 19 clicks or reliably calculate branded versus non-branded click share.

The submitted sitemap was last downloaded by Google on 6 October, reports 50 submitted URLs, zero errors and zero warnings. Its `indexed: 0` field conflicts with indexed URL inspections and must not be presented as the actual index count. [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview) also makes clear that sitemaps do not guarantee crawling or indexing.

## Live findings that change the old audit

A basic HTTP and returned-HTML check of all 50 live sitemap URLs found 50 responses with status 200, a canonical URL, one H1, and no page-level noindex directive. Titles were unique across those URLs. This was not a complete JavaScript-rendered, asset or broken-link crawl. The sitemap currently contains six static pages, eight categories and 36 products; no article URLs were present.

| Priority | Finding | Required response |
|---|---|---|
| P0 | `/products/category/steam-cleaners` returns 404 and is absent from the live sitemap. Google still reports it indexed from a successful 24 September crawl. | Confirm whether the range is still sold. Restore the existing URL with real catalog content if yes; redirect only to a genuinely equivalent replacement. If permanently withdrawn without a replacement, keep the proper removal status and remove remaining promises/links. Historical index status does not describe today's response. |
| P1 | `/services`: discovered, currently not indexed. `/about`: unknown to Google. `/contact`: crawled, currently not indexed. Sweepers and janitorial categories: discovered, currently not indexed. | Improve useful content and direct internal discovery, then re-inspect. No current robots block was found on these pages. Do not diagnose a block from an unspecified inspection field. |
| P1 | Cleaning-chemicals category has zero products, remains indexable and is in the sitemap. | Decide whether it represents a real supported offering. Add useful factual content/products if it does; otherwise exclude it from SEO promotion and sitemap and apply an appropriate empty-category policy. |
| P1 | Brand/tag filter links create many combinations. A sampled brand URL already emits `noindex, follow`; GSC referring URLs contain filter combinations. | Retain existing noindex while measuring discovery/crawl patterns. Reduce needless combinations at their source. Preserve clean category/product links and meaningful pagination. No evidence yet proves a sitewide crawl-budget crisis. |
| P2 | Several janitorial product titles repeat `Moral Clean` twice. | Normalize supplied SEO titles and the shared title template so branding appears once. |
| P2 | Returned product HTML contains Breadcrumb markup but no Product type; the current product template does not render Product schema. Earlier documentation claims otherwise. | Add factual Product markup and validate it. This is not proof that missing schema caused low rankings. |
| P2 | Contact success UI hardcodes a different phone number from the current site settings and promises a two-business-hour response. | Confirm the correct channels and service promise, then use consistent verified information. Both numbers could be valid; that has not been established. |
| P2 | A previously visible non-test product, `/products/compact-flat-mop-squeeze-bucket-set-mc-fm-120`, now returns 404. | Inventory recent product/category removals and map redirects only where equivalent replacements exist. Do not blindly redirect deleted products to the homepage. |

Completed items to preserve: all five old test product/blog routes return 404 and are absent from the current sitemap; sitemap index and child sitemaps work; clean category links exist; the sampled filter noindex works; core pages have H1s and canonicals. Do not repeat those fixes merely because the transcript lists them.

## Connector capability and access limits

| Connector | Current result | Role after access is available |
|---|---|---|
| HYPD | Working; owner-level property access | Baselines, page/query breakdowns, period comparisons, sampled URL inspections and sitemap monitoring. It is read-only and cannot submit indexing requests. |
| Semrush | Active subscription but insufficient API units; keyword, organic and project discovery unavailable | Pakistan database keyword metrics and SERPs, competing pages, existing Site Audit/Position Tracking campaigns, and relevant backlink gaps. Verify regional database support and campaign geography before using results. |
| Serpstat | Authenticated, but the plan excludes API access | Determine available regional databases first; use as a second source for selected keyword/SERP and backlink checks rather than duplicating every Semrush request. |
| Vercel | Project team scope returned 403; CLI was not installed/cached for fallback | Confirm production deployment and source revision, examine actual runtime/crawl errors, and read available performance measurements. Speed Insights code exists, but field measurements were not retrieved. |

Semrush requires additional API units: [access options](https://www.semrush.com/mcp-access). Serpstat requires an API-enabled subscription: [plan options](https://serpstat.com/page/pricing-plans/). Neither was purchased or changed. Vercel's connected authorization must permit the linked `moral-clean` project in the `burhan-dev-projects` team. No authentication or project settings were changed.

Unavailable: verified keyword volumes/difficulty, competitor ranking overlap, competitor traffic estimates, referring-domain baseline, conversion analytics and current field Core Web Vitals. Priorities below are based on business intent, live site evidence and GSC observations, not fabricated paid-tool metrics. Lack of paid-tool data does not block the directly verified fixes.

## Work sequence and completion criteria

| Stage | Timing | Deliverables | Completion criteria |
|---|---|---|---|
| 1. Establish facts and fix current losses | Days 1–7 | URL inventory and retirement map; steam-range decision; chemicals-category decision; initial performance measurements; conversion-event specification; source/deployment reconciliation when Vercel access permits | Every priority URL has a documented purpose, status and canonical; no unintended commercial 404s; factual range and contact details confirmed; baseline recorded |
| 2. Improve commercial coverage | Days 8–30 | Homepage and Services improvements; five substantive category upgrades; ten prioritized product upgrades; title cleanup; factual Product schema; internal-link improvements; explicit lead events | Content matches verified specifications and support; titles have one brand suffix; schema matches visible content; priority pages accessible by ordinary links; successful lead events distinguish submitted inquiries from clicks |
| 3. Publish buyer resources | Days 31–60 | Two original buying/comparison guides; one practical maintenance resource; one documented case study when real evidence is available; local-profile information audit | Articles answer procurement questions and link to the relevant category, product and service pages; no invented prices, customers or results; accurate business information ready for profile updates |
| 4. Earn authority and expand winners | Days 61–90 | Second case study when available; researched manufacturer/customer/industry prospects; second wave of page improvements based on GSC movement and inquiry quality | Weekly change log, 28-day readouts, documented qualified inquiries and researched link opportunities; expand topics that show relevant demand rather than meeting an article quota |

Implementation order: resolve factual catalog/URL decisions, implement technical and measurement changes, upgrade commercial content, deploy and verify the approved release, then publish resources and reassess. Some work can overlap, but content relying on unconfirmed specifications or pricing cannot be published accurately.

## Initial keyword-to-page map

These are intent clusters to validate, not measured search-volume rankings. Keep one primary destination per commercial intent; use synonyms naturally rather than creating near-duplicate pages.

| Order | Intent cluster | Destination and content requirement |
|---|---|---|
| 1 | Single disc machine Pakistan; floor polishing machine; single disc machine price | Existing `/products/category/single-disk-machine`. Compare the six listed models using verified RPM, disc size, power, floor compatibility and accessories. Preserve the live slug. |
| 2 | Walk behind scrubber dryer Pakistan; automatic floor scrubber | Existing `/products/category/walk-behind-scrubber`. Explain battery/cable choices, cleaning path, tanks, runtime and practical selection criteria. |
| 3 | Ride on scrubber dryer Pakistan; industrial floor cleaning machine | Existing `/products/category/ride-on-scrubber-dryer`. Explain facility size, aisle access, operating limitations and maintenance. |
| 4 | Cleaning machine repair Karachi; scrubber repair; brush refilling; spare parts | `/services` first. Create separate service pages only when each has enough distinct expertise, evidence and information. |
| 5 | Industrial wet and dry vacuum cleaner Pakistan | Existing vacuum category. Separate pickup and filtration applications, capacity and appropriate operating limits. Do not imply hazardous-dust certification without evidence. |
| 6 | Industrial sweeper Pakistan; janitorial trolley Pakistan; pressure washer Pakistan | Existing categories, upgraded according to real range, sales priority and data. Sweepers have four listed products; janitorial has ten. |
| Conditional | Industrial steam cleaner Pakistan; steam cleaner Karachi | Existing steam category only if Moral Clean still supplies the relevant equipment. Its prior visibility makes the URL decision urgent, not a reason to invent inventory. |
| Supporting | Commercial cleaning equipment Pakistan; supplier Karachi | Homepage as the supplier hub, with real category links, verified brands, service coverage and evidence. |

Choose the first ten product upgrades by actual availability, business value, completeness of supporting facts and search evidence. Start with the single-disc models and relevant scrubbers; do not claim to know margins or stock from a public catalog.

Every upgraded product needs model-specific use cases, verified specifications with units, limitations, accessory/parts compatibility, authorized manuals where available, accurate images and clear quote context. Preserve useful existing URLs.

## Content and competitor evidence

The first two guides should be:

1. **Single Disc vs Scrubber Dryer: Choosing for Your Facility.** Explain use cases and workflow tradeoffs with verified models and practical limitations.
2. **Floor Cleaning Machine Costs in Pakistan.** Use current Moral Clean quotations or approved ranges with dates, tax/inclusion details and quote factors. If price facts are unavailable, publish a purchasing-cost guide rather than pretend to answer exact price searches.

Follow with a scrubber maintenance checklist and a repair-versus-replacement case study grounded in actual workshop evidence. Firsthand experience and useful information are central to [Google's people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content). No generic daily article production or arbitrary word counts.

Publicly observed comparison targets, not verified ranking leaders:

- [Clean Tech](https://cleantech.com.pk/) has distinct commercial categories spanning vacuums, scrubbers, sweepers, steam equipment and maintenance support. Compare category usefulness and navigation, not its unverified traffic.
- [Shahzad Brothers' price guide](https://www.shahzadbrothers.com.pk/blog/floor-cleaning-machine-price-in-pakistan) addresses costs, equipment comparisons and procurement questions. Do not reuse its prices as Moral Clean's price evidence.
- [T & Z Traders](https://tandztraders.com/) presents new/used equipment, product prices and repair support. Its commercial offer is not necessarily identical to Moral Clean's.

Once API access works, validate 30–50 shortlisted terms in the correct country database, inspect representative live SERPs, compare three to five relevant domains, and map gaps to existing pages before proposing new ones. Record source, country, date, volume/difficulty availability, search intent and destination. Cross-source discrepancies remain estimates, not facts to average indiscriminately.

## Measurement and technical verification

Use the existing PostHog implementation if it is configured and working. It currently provides pageviews/autocapture in source; explicit successful-inquiry events and organic lead attribution were not verified. GA4/GTM are not prerequisites merely because the old transcript recommends them.

- Track successful contact/quote submissions, phone clicks and WhatsApp clicks separately. Link click events are contact intent, not confirmed leads. Honeypot/spam paths or failed submissions must not count as successful inquiries.
- Define a qualified inquiry as a genuine equipment, parts or service request within supported scope, reviewed by sales. Record deduplicated inquiry, acquisition source, landing page, requirement and outcome without placing personal form content in analytics event payloads.
- Establish the primary KPI as qualified organic inquiries per 28 days; supporting metrics are relevant commercial impressions, priority-page clicks, pages receiving useful impressions and organic conversion rate. Define the session attribution model and denominator consistently.
- Review technical regressions weekly, major changed URL inspections after recrawl, and equal-length Search Console periods every 28 days. Use a simple recorded query classifier for disclosed branded/non-branded terms, while acknowledging hidden queries.
- Measure mobile and desktop lab performance before/after in comparable production conditions. Read available CrUX/Search Console/Vercel field measurements; lack of field data is not a pass or a fail. Do not compare localhost Lighthouse with production to claim improvement.
- Validate Product and Breadcrumb markup against visible facts. Quote-only products must not receive fictional prices, stock or ratings. Factual Product markup alone may remain ineligible for [Google product snippets](https://developers.google.com/search/docs/appearance/structured-data/product-snippet).
- Treat facet indexing and facet crawling as different problems. [Google's facet guidance](https://developers.google.com/crawling/docs/faceted-navigation) supports preventing unnecessary crawl spaces; [noindex must remain crawlable to be read](https://developers.google.com/search/docs/crawling-indexing/block-indexing). Do not blanket-block all query strings or meaningful pagination. Stage any crawl restrictions after checking indexed variants and the intended removal strategy.
- Keep a release checklist for URL status, canonicals, index directives, sitemap membership, ordinary links, schema and conversion flow. Compare local source with the live release instead of assuming repository documentation proves deployment.

Day-30 operational targets: five improved real categories, ten improved real products, a useful supplier/service hub and verified event tracking. Day-60 targets: two substantive buyer guides plus original maintenance/project evidence. Day-90 evaluation: compare equal-length visibility and qualified-inquiry results, expand successful pages and revise weak hypotheses. These are delivery targets; traffic and ranking outcomes depend on demand, competitors and Google's processing.

## Business facts and authority work

The owner/sales team supplies current range and stock/lead times, correct phone/service hours, permitted manufacturer/distributor claims, specification sources, optional price ranges, service coverage and customer permission/evidence. No supported branch is assumed outside Karachi; nationwide service claims need operational confirmation.

Audit the existing Google Business Profile before creating or changing one. Align name, address, phone, hours, relevant categories, actual services and real photographs; prepare a process for genuine customer reviews. Do not create location doorway pages or invent branches. [Google local ranking guidance](https://support.google.com/business/answer/7091?hl=en) identifies relevance, distance and prominence rather than a paid shortcut to ranking.

Research legitimate manufacturer/dealer listings, customer project references and relevant industry resources after there are useful pages to cite. Fix the stale `/products/category/scrubber-dryers` destination in the older backlink-strategy document before using that document operationally. Link acquisition should serve a real relationship and audience. No backlink purchases, bulk directory submissions, fake reviews or invented endorsements.

## Authorization boundary

Initial implementation is documented in release-2026-10-09.md. Steam supply was confirmed by the user; the original category URL is restored without invented models or prices. Website changes, public catalogue updates and deployment are authorized. External outreach has not been sent. Existing working-tree edits were preserved.
