# MoralClean SEO intelligence and implementation backlog

Research date: 11 October 2026 (Asia/Karachi). Market: Pakistan. Objective: qualified equipment, parts and repair enquiries, then quotations and sales. This is a read-only investigation, not an implementation or release. No SEO improvement is claimed.

## Decision

Fix the reproducible pagination failures first. Then measure qualified leads and improve the commercial pages that already receive clicks. The steam category is an observed opportunity, but its empty catalogue cannot support a normal product listing. Neither a large article quota nor high-volume consumer keywords is justified by the evidence.

Production and preview are different applications. Much of the technical and editorial work is already staged on preview. Implementing it again would waste effort; review the existing changes and their release evidence. Production release requires explicit approval for that release.

## Evidence and deployment baseline

Reproducible datasets:

- [Live crawl, response checks, HTML metadata, schema, links and image samples](intelligence-live-2026-10-11.json), tested from 10:24 UTC on 11 October.
- [GSC, Semrush, Serpstat, Vercel deployment and runtime datasets](intelligence-connectors-2026-10-11.json), retrieved 11 October; each provider has its own observation dates.
- [Failed observability requests](intelligence-observability-2026-10-11.json).
- [Earlier authenticated preview verification](technical-preview-verification-2026-10-10.json), 10 October, historical evidence only.

| Surface | Verified release | Current meaning |
|---|---|---|
| moralclean.com | master `253902d05d522a747c589130875360117c40e815`; Vercel `dpl_Eet82YisYPevDFQQDFHyFJttNndE`, READY production | Approved master application |
| preview.moralclean.com | preview `4640859c2c12f0102cb067f46ab21127b3287905`; Vercel `dpl_A1trRHfY9tkXfLXP8CeZbjPckC4U`, READY | Protected preview; documentation commit after application changes |
| This research | local `codex/seo-intelligence-2026-10-11`, based on preview | Research files only; no push or deployment |

The anonymous preview browser request reached Vercel login. Its current rendered application was not freshly crawled with authentication. The earlier preview test recorded 68 sitemap URLs, 36 products, 12 excluded routes, no errors and all 68 URLs reachable through 1,408 internal edges. Do not present that as today's measurement or remove protection to improve a scanner score.

Production's 51 sitemap URLs all returned 200: six static pages, nine categories and 36 products. No published blog detail URLs occur in the sitemap. All sitemap pages were reachable through the captured canonical-page link graph; this does not establish that every database record or Google-indexed URL is linked.

## Organic performance: actual Google data

GSC property `sc-domain:moralclean.com` is accessible with siteOwner permission. Search type: web. The latest finalized window available for this analysis ends 8 October.

| Window, inclusive | Clicks | Impressions | CTR | Average position |
|---|---:|---:|---:|---:|
| 11 Sep–8 Oct, 28 days | 21 | 157 | 13.38% | 10.95 |
| 14 Aug–10 Sep, preceding 28 days | 3 | 21 | 14.29% | 9.52 |
| 11 Jul–8 Oct, 90 days | 28 | 224 | 12.50% | 11.63 |
| 12 Apr–10 Jul, preceding 90 days | 9 | 67 | 13.43% | 20.36 |

The 28-day increase is 18 clicks and 136 impressions; the 90-day increase is 19 clicks and 157 impressions. Percentage growth looks large because the baseline is tiny. This is insufficient to attribute growth to an SEO change, predict lead growth, or declare a conversion improvement.

| Landing page | 28-day clicks / impressions | Position | Interpretation |
|---|---:|---:|---|
| / | 12 / 88 | 8.53 | Largest existing search entry point |
| /products/category/single-disk-machine | 6 / 31 | 8.29 | Strongest observed equipment category |
| /products/category/ride-on-scrubber-dryer | 2 / 10 | 5.40 | Commercial category with actual clicks |
| /products/category/walk-behind-scrubber | 1 / 5 | 11.40 | Relevant, very small sample |
| /products/category/steam-cleaners | 0 / 20 | 24.30 | Largest category impression count without clicks |
| /products/biemmedue-ms-17-fast-single-disc-floor-machine | 0 / 3 | 5.00 | Model demand hypothesis |
| /products/20-l-side-press-mop-bucket-trolley-mc-mw-200 | 0 / 2 | 35.50 | Relevant to the sole tracked term |
| /products/test-prod | 0 / 2 | 1.50 | Stale indexed test URL; now 404 |
| /products/category/vacuum-cleaner | 0 / 1 | 70.00 | Commercial fit; visibility not demonstrated |

Page-level impressions total 166, versus property-level 157: Google can count multiple result URLs from the same property. Do not add page rows to recreate property totals. The homepage had 19 clicks/155 impressions in the 90-day window. No meaningful losing-page pattern is established.

Only 12 query rows, totaling 25 impressions and **zero disclosed clicks**, were returned for 28 days; 90 days returned 15 rows/29 impressions/zero clicks. Query anonymization withholds most impressions and all clicked queries here. The 21 actual clicks cannot be classified as branded or non-branded from this query export.

| Disclosed query | 28-day impressions | Position | Use |
|---|---:|---:|---|
| steam cleaner | 6 | 38.83 | Mixed household/commercial intent |
| steam cleaner pakistan | 3 | 31.33 | Location intent, still mixed |
| steam cleaner karachi | 2 | 11.00 | Only explicit city demand observed |
| commercial cleaning repairs | 2 | 4.50 | Homepage receives this query; dedicated service hypothesis |
| single disc machine | 1 | 9.00 | Category matches intent |
| disk machine | 1 | 6.00 | Ambiguous wording; insufficient evidence |
| ride on machine | 1 | 6.00 | Potential equipment intent, ambiguous |
| industrial vacuum | 1 | 70.00 | Relevant but weak visibility |
| mop trolley | 1 | 63.00 | Commercial/household overlap |
| cleaning machines | 2 | 39.00 | Broad |
| floor & steam cleaners | 2 | 43.00 | Broad |

Position 4–20 rows have only one or two impressions. They are research hypotheses, not reliable quick wins. The single-disc query breakdown shows the expected category, and the repairs query shows the homepage. Available rows do not prove cannibalization. Avoid creating several supplier, machine-price and city pages for the same buying intent.

Pakistan generated 20 clicks/127 impressions in 28 days and 26/148 in 90 days. Pakistan desktop was 16/82, CTR 19.51%, position 9.24; mobile was 4/45, CTR 8.89%, position 15.64. Worse mobile position and different query composition can explain the CTR gap; it is not proof of a mobile form defect. GSC exposes country, not city. Karachi is supported by the address and two query impressions; Lahore/Islamabad doorway pages are unsupported.

Sitemap submission is recorded on 24 September, downloaded 9 October, 51 submitted URLs and zero errors/warnings. The connector's indexed-count field of zero is not a reliable individual indexing verdict. URL Inspection reports steam and single-disc categories indexed, crawlable, with matching canonicals. Test-prod was indexed after a 26 September crawl but returns 404 today. Maintain the truthful 404 and monitor recrawl; do not redirect it to an unrelated product.

## Keyword datasets and page ownership

Semrush project `31545213`, Pakistan/English/desktop campaign `31545213_5621252`, tracks exactly one keyword: **mop trolley**, position 52 on 9–11 October, targeting the 20 L trolley product, estimated volume 50. It is a poor measure of the core equipment business.

Semrush Pakistan organic and competitor endpoints returned HTTP 403, `ERROR 120 :: WRONG KEY - ID PAIR`. Batch and single keyword calls returned HTTP 400, `ERROR 122 :: WRONG FORMAT OR EMPTY KEY`. No Semrush competitor traffic, organic keyword inventory or usable difficulty dataset was obtained.

Serpstat Pakistan engine `g_pk` returned the following estimates on 11 October. Provider collection/update dates were not supplied. Blank difficulty is unavailable; default zero in SERP summaries is not evidence of easy competition.

| Query | Estimated monthly volume | Difficulty | Intent caution |
|---|---:|---:|---|
| steam cleaner pakistan | 390 | 10 | Household-heavy results |
| steam cleaner | 720 | 10 | Household-heavy |
| commercial steam cleaner | 10 | unavailable | Better commercial fit |
| floor cleaning machine | 590 | unavailable | Broad equipment range |
| floor scrubber machine | 40 | unavailable | Commercial equipment |
| floor scrubber | 90 | unavailable | Commercial/mixed |
| industrial vacuum cleaner | 70 | unavailable | Commercial equipment |
| cleaning equipment | 50 | unavailable | Broad supplier |
| mop trolley | 90 | unavailable | Different estimate from Semrush's 50 |
| cleaning trolley | 40 | unavailable | Procurement/household overlap |
| mop bucket | 590 | unavailable | Mostly commodity/consumer |
| pressure washer | 2,900 | 22 | Large consumer component |

Do not average conflicting volume estimates or convert them into expected leads. Several exact Pakistan-qualified seeds returned no row. Broad discovery explicitly returned no data for single disc machine, single disk machine, industrial vacuum, ride on scrubber, walk behind scrubber and cleaning machine repair. No row means unavailable coverage, not zero demand. Serpstat domain-region coverage was empty, not evidence that Google has no rankings.

The following map assigns one main destination per buying intent. These primary keywords are editorial ownership decisions, not claims that every exact phrase has verified volume. All paths below use https://moralclean.com.

| Primary intent / keyword cluster | Owning URL | Evidence / implementation boundary |
|---|---|---|
| commercial cleaning equipment supplier Pakistan | / | Existing clicks; verified range and support scope |
| industrial cleaning machines Pakistan | /products | Browse actual equipment; avoid duplicate supplier landing page |
| single disc machine Pakistan / single disc floor machine | /products/category/single-disk-machine | Six clicks; existing slug retained despite keyword spelling |
| ride on scrubber dryer Pakistan | /products/category/ride-on-scrubber-dryer | Two clicks; compare four models |
| walk behind floor scrubber | /products/category/walk-behind-scrubber | One click; compare three models |
| industrial wet dry vacuum cleaner Pakistan | /products/category/vacuum-cleaner | Six products; third-party commercial SERP |
| commercial steam cleaner Pakistan / Karachi sourcing | /products/category/steam-cleaners | 20 impressions; sourcing page, currently zero products |
| commercial pressure washer Pakistan | /products/category/pressure-washer | Three products; qualify commercial use |
| commercial floor sweeper Pakistan | /products/category/sweepers | Four products; separate sweeping from washing |
| mop trolley / cleaning trolley Pakistan | /products/category/janitorial-equipment | Ten products; generic category owns comparison intent |
| 20 L side press mop bucket trolley MC MW 200 | /products/20-l-side-press-mop-bucket-trolley-mc-mw-200 | Exact model; keep model terms, generic category links |
| Biemmedue MS 17 FAST single disc floor machine | /products/biemmedue-ms-17-fast-single-disc-floor-machine | Three impressions; exact model facts |
| floor cleaning machine price / costs Pakistan | /guides/floor-cleaning-machine-costs-pakistan | Already on preview; retain one costs resource |
| floor scrubber spare parts Pakistan | /services/cleaning-machine-parts | Already on preview; identify model/part compatibility |
| industrial cleaning machine repair | /services/cleaning-machine-repair | Already on preview; repairs query currently homepage |
| single disc brush refilling | /services/brush-refilling | Already on preview; verified process/coverage |
| general enquiry and quotation | /contact | Conversion destination; no competing commercial keyword page |

/services remains the service hub. /about establishes real expertise and identity. /blog is currently an empty legacy hub. /guides is the preview procurement resource hub. No dedicated live location pages exist; actual nationwide supply and repair coverage require different factual statements.

## Competitors and purchasing gaps

Serpstat top-ten Pakistan snapshots are saved for steam cleaner pakistan, floor scrubber machine and industrial vacuum cleaner. They are database snapshots, not today's personalized Google positions.

- Steam: Daraz first, [InterClean steam category](https://interclean.pk/product_category/steam-cleaners/) second; then YouTube, Temu, retailer/model pages and marketplaces. Household intent is strong.
- Scrubbers: [InterClean floor machines](https://interclean.pk/product_category/floor-cleaning-machines/) first; ValeMaster fourth, [CleanTech scrubbers/polishers](https://cleantech.com.pk/wet-floor-scrubber-dryers-and-polishers/) fifth, KK Dealers sixth, Kärcher seventh and Tennant eighth.
- Industrial vacuums: [InterClean industrial vacuums](https://interclean.pk/product_category/industrial-wet-dry-vacuum-cleaners/) first; AlClean second, ValeMaster fifth, MK Trader sixth, CleanTech eighth.

A signed-out live Google search for “industrial floor scrubber machine Pakistan”, with gl=pk/hl=en, showed commercial suppliers including CleanTech, KK Dealers, MK Trader and T&Z, alongside consumer and foreign results. The footer indicated Pakistan/Karachi. This single session validates competitor relevance, not a stable ranking report. Ads were excluded.

| Competitor page inspected | Observed purchasing advantage | Legitimate MoralClean response |
|---|---|---|
| InterClean steam category and ride-on category | Seven steam products; five ride-ons; quote form needs name/phone with optional email; range distinctions | Explain sourcing and commercial applications; compare real stocked/sourced models and simplify verified enquiry flow |
| [InterClean combined sweeper/scrubber model](https://interclean.pk/product/ride-on-floor-scrubber-dryer-with-sweeping-and-scrubbing-system/) | Specific accessory references and documentation links | Publish verified brush/squeegee codes and model compatibility where known |
| [ValeMaster S-72](https://valemaster.com.pk/product/s-72/) | Model-specific electrical, capacity and airflow table, application context | Complete model specification fields and intended uses; verify against manufacturer documentation |
| [Super Duper single-disc model](https://superdupercleaning.pk/product/single-disk-floor-cleaning-machine/) | Visible vendor price, specification table and included accessories | State quotation inputs, included/excluded accessories, warranty and availability without copying prices |
| [Shahzad Brothers costs resource](https://www.shahzadbrothers.com.pk/blog/floor-cleaning-machine-price-in-pakistan) | Dated 7 October buying-cost discussion and equipment distinctions | Improve the existing preview costs guide using MoralClean-approved examples and transparent assumptions |

InterClean and CleanTech overlap the actual commercial range. Daraz/OLX/Temu are marketplaces, not equivalent service businesses. Kärcher/Tennant are manufacturer references. T&Z's used Hako offer is a used-equipment competitor, not a like-for-like new-model price benchmark. Vendor claims and certifications were not independently validated. No competitor article copying or competitor traffic forecast is warranted.

## Technical and procurement findings

| Finding | Verified evidence | Status / consequence |
|---|---|---|
| Invalid pagination crashes | /products?page=999, /products/category/single-disk-machine?page=999 and /blog?page=999 return 500 | Real defect; valid product pages 2 and 3 return 200 |
| PGRST103 root cause | Matching Vercel production logs show requested offset 11,976 exceeding product/category result ranges | These log entries were generated by our probes; not measured customer incidents |
| Product schema absent | All 36 live product pages lack Product JSON-LD | Factual markup already added on preview; do not invent offers/reviews |
| Brochure controls unavailable | All 36 live product pages show disabled “Download Brochure” controls | Procurement dead end; disabled controls, not broken HTTP links |
| Missing structured model data | /products/single-disk-floor-scrubbing-machine specifications tab says details on request, while description contains specifications | Data normalization needed; rendering change alone cannot populate missing fields |
| Empty indexable category | /products/category/cleaning-chemicals returns 200, appears in sitemap, no noindex; zero products | No supported purchasing inventory; preview exclusion/noindex already exists |
| Empty steam category | /products/category/steam-cleaners has zero products and “coming soon”, despite 20 impressions | Preserve only as a useful, truthful sourcing landing page |
| Host duplication | https://www.moralclean.com returns 200 without redirect | Canonical consolidation exists, but redirect already staged on preview |
| Product/category buyer information | Generic descriptions; warranty/lead time/accessory details not consistently supplied | High business relevance, no measured abandonment yet |
| Broad reassurance claims | Authorized distributor, original parts and Pakistan-wide service badges are generic across products | Verify applicable manufacturer relationship and service coverage; do not expand unsupported claims |

PGRST103 is PostgREST's HTTP 416 range error ([official error reference](https://docs.postgrest.org/en/stable/references/errors.html)). Production turns it into a page 500. Preview's product/blog query modules already recover the count with a bounded first-row query, while route handlers reject out-of-range page requests. Revalidate this behavior before release.

Historical audit flags were tested rather than accepted:

- Serpstat production report 11351106, 9 October: SDO 92, 141 critical/22 noncritical flags, including 79 HTTP errors and 60 image flags. These counts are scanner findings, not verified current failure totals.
- Preview report 11351319, 10 October: SDO 70, 748 critical/555 noncritical; examples include vercel.com/login and Vercel marketing/documentation images. The audit is contaminated by deployment protection. Comparing 92 to 70 as application quality is invalid.
- Previously reported 403 URLs /products?category=ride-on-scrubber-dryer&tag=dusty-650-m and /products?tag=testing now return 200 with noindex/follow. Cause of the older 403 is unresolved; no basis to disable firewall rules.
- Three exact optimizer URLs reported as image failures returned 200 with image content. A further 3,840-pixel optimizer request also succeeded. This sample does not clear all 60 flags. Keep optimization and test remaining exact failures if they recur.
- Three “wrong canonical” contact service-parameter URLs correctly consolidate to /contact. They are not canonical defects.
- /products/test-prod is absent from current sitemap and returns 404; the remaining issue is Google's old index snapshot.

Next.js App Router serves public homepage, catalogue, categories, product details, services, contact and blog. Preview adds three dedicated service pages plus 14 static guides. Product/category/blog data comes from Supabase; public reads use anonymous access, cached query functions, request memoization and ISR. Public query cache lifetime is 900 seconds, public page/sitemap revalidation 3,600 seconds. Dynamic facets can still generate work; validate and normalize parameters rather than caching arbitrary search requests.

Sitemap pagination reads database records in bounded batches and throws on genuine query failure, preserving prior ISR output instead of publishing a falsely empty sitemap. Public cache paths do not need session cookies; admin middleware is scoped to admin. Quote submissions remain dynamic. SQL tables and indexes exist; no database/schema changes were made.

Live HTML includes crawlable category/product links, one H1 per sitemap page, Organization/WebSite/Breadcrumb markup and service markup. Homepage canonical slash normalization is not a defect. Master product specifications use interactive tabs; preview exposes specification sections and additional purchasing/internal-link content. Preview guides use Article markup. Canonical metadata utilities, admin noindex, faceted noindex and preview headers must be regression-tested against the actual target deployment.

Source files to review: src/lib/queries/products.ts, src/lib/queries/blog.ts, src/lib/seo.ts, src/app/catalog-sitemap.xml/route.ts, src/app/(public)/products/category/[slug]/page.tsx, src/app/(public)/products/[slug]/page.tsx, src/lib/actions/contact.ts, src/components/products/QuickQuoteForm.tsx, src/components/contact/ContactForm.tsx and next.config.mjs.

No field Core Web Vitals verdict is available. Responsive image sizes and idle analytics loading are staged improvements, not measured LCP/INP gains. Vercel metrics schema was accessible; function-count and LCP queries for 4–11 October returned HTTP 400 bad_request without usable measurements. Scope/aggregation compatibility was not resolved; this is not evidence of zero traffic or an account entitlement failure. Historical runtime logs were limited to one hour on this plan. No quantified infrastructure savings are claimed.

## Conversion and measurement

Product quote links preserve product context in /contact?product=<slug>. Browser inspection verified the prefilled product subject/message. Phone and WhatsApp links exist; no calls/messages or forms were triggered. At a 390-pixel viewport, the contact fields stayed inside the viewport and the form appeared after the hero. This is a layout sample, not an abandonment study.

Live contact requires name, email, phone and message. Optional email in a short product enquiry is a reasonable experiment after measurement, not a proven conversion fix. Preview already has a product quick quote and explicit enquiry events. Live master includes PostHog autocapture/session recording, so “no analytics” would be false.

The current submissions schema stores contact details/message/timestamp, without qualification status, acquisition fields or quotation/sale outcomes. Preview correctly emits inquiry_submitted only after a recorded submission; honeypot success is not a real lead, and an email delivery failure can occur after successful storage. Separate storage success from notification success.

Define a qualified lead as a deduplicated, sales-reviewed equipment/parts/repair enquiry within supported coverage, with a usable contact and genuine purchasing/service need. Track:

1. Organic landing session and product/category/service viewed.
2. Quote/phone/WhatsApp click, labeled as intent only.
3. Server-confirmed stored enquiry, linked by a random non-personal submission identifier.
4. Qualified/rejected status with reason, quotation sent and won/lost outcome.

Use allowlisted landing/source fields and avoid sending names, phone numbers, email or message content to analytics. Attribution requires explicit validation of PostHog source/UTM handling; query stripping should not be casually undone to collect personal contact parameters. Store consent and attribution rules consistently.

Primary KPI: deduplicated qualified organic enquiries per 28 days. Secondary: qualified enquiries per attributed organic session, quotation rate and won revenue. GSC clicks are not the denominator for session conversion rate. Call/WhatsApp outcomes require a sales process; link clicks alone are not leads. No submission records were inspected and no baseline lead count is available.

## Scored implementation backlog

Scores are ordinal judgments, not revenue forecasts. Each dimension is 0–5: business impact (I), demonstrated opportunity (O), confidence (C), implementation cost (K), operational risk (R). Priority = I + O + C − K − R. P0 is a reproducible reliability fault; P1 directly supports measured commercial demand or measurement; P2 has weaker immediate evidence or depends on missing facts.

| Rank | Priority | Work | I/O/C/K/R | Score |
|---|---|---|---|---:|
| 1 | P0 | Pagination reliability; verify existing preview fix | 4/5/5/1/1 | 12 |
| 2 | P1 | Qualified enquiry attribution and sales outcomes | 5/5/5/3/1 | 11 |
| 3 | P1 | Procurement detail on clicked equipment categories/products | 5/4/5/3/1 | 10 |
| 4 | P1 | Useful commercial steam sourcing landing page | 4/4/4/2/1 | 9 |
| 5 | P1 | Host, empty-category and facet index hygiene | 3/4/5/2/1 | 9 |
| 6 | P1 | Dedicated repair/parts pages and contextual routing | 4/3/4/2/1 | 8 |
| 7 | P2 | Verify manufacturer/customer authority and contact identity | 4/2/3/2/1 | 6 |
| 8 | P2 | Expand Pakistan commercial keyword tracking | 3/3/4/2/1 | 7 |
| 9 | P2 | Obtain mobile field performance/funnel samples | 3/2/4/2/1 | 6 |
| 10 | P2 | Correct audit scope; retest remaining image failures | 2/2/4/2/1 | 5 |
| 11 | P2 | Monitor test-prod recrawl | 1/2/5/1/0 | 7 |

Scores do not override urgency or dependency: the test URL is already 404, while procurement and measurement work can affect real buyers. No task authorizes production release.

### 1. Pagination reliability

Affected URLs: https://moralclean.com/products?page=999, https://moralclean.com/products/category/single-disk-machine?page=999, https://moralclean.com/blog?page=999; valid controls /products?page=2 and ?page=3.

Implementation: review the existing preview PGRST103 recovery and route not-found handling; normalize malformed page parameters, retain bounded queries, and propagate genuine database failures distinctly. Avoid replacing out-of-range pages with unrelated first-page inventory.

Acceptance: invalid/out-of-range catalogue, category and blog pages return truthful 404 without PGRST103-generated 500s; normal valid pagination returns correct 200 content and self canonicals; empty page-one collections remain deliberate 200/noindex as applicable. Test metadata and rendering paths. Verify preview logs after controlled probes and preserve unexpected-error reporting.

### 2. Qualified enquiry measurement

Affected URLs: /contact, /products/[slug], equipment categories and /services/*.

Implementation: audit preview event changes; add approved attribution/qualification/outcome design to the enquiry pipeline and sales workflow. Treat stored record, email notification and qualified lead as separate events. Validate attribution through the entire server action flow, not just button clicks.

Acceptance: isolated test submissions produce exactly one server-confirmed event, deduplication works, rejected/honeypot attempts are not counted, stored-but-email-failed enquiries remain countable, and no personal content leaks into analytics. An organic test session links to a stored enquiry and subsequent qualification/quote outcome. Use isolated data/email sinks; preview and production otherwise share records. A code rollback is not a database rollback.

### 3. Procurement information on existing demand

Affected URLs: /products/category/single-disk-machine, /products/category/ride-on-scrubber-dryer, /products/category/walk-behind-scrubber; /products/single-disk-floor-scrubbing-machine and the four Biemmedue single-disc model pages.

Evidence: these three categories generated nine of 21 clicks; all 36 product brochure controls are disabled; the MC522 structured specification field is missing despite description text.

Implementation: verify manufacturer-backed model facts, included accessories, power requirements, pads/brushes/parts compatibility, working capacity assumptions, warranty provider and terms, stock versus sourcing status and lead-time process. Review existing preview comparison/specification rendering. Supply real brochures where licensed/available; omit unavailable controls or explain how to obtain documentation. Remove or qualify unsupported generic badges and operating claims.

Acceptance: a procurement manager can compare real models, identify included/excluded items and request a model-specific quote without guessing. MC522 facts are normalized from verified documentation, not copied blindly from marketing prose. All displayed specifications agree across HTML/schema/data; no fabricated price, warranty, certification, distributor claim or stock promise. Existing product context reaches the enquiry form.

### 4. Steam sourcing landing page

Affected URL: /products/category/steam-cleaners, with supporting existing preview /guides/commercial-steam-cleaner-buying-guide-pakistan.

Evidence: 20 GSC impressions, zero clicks, position 24.3; zero products; disclosed steam queries and commercial competitors with useful ranges.

Implementation: use a category-specific sourcing page only if actual supply is confirmed. Explain commercial applications, dry steam versus extraction/vacuum distinctions, electrical/site requirements, verification/documentation process, availability enquiry and support scope. Link the existing buying guide; do not add another competing steam article or fictitious models.

Acceptance: no generic “coming soon” or unrelated catalogue filters; truthful supply limitations; visible commercial sourcing CTA; correct canonical and appropriate indexability based on useful confirmed content; no unsupported sterilization/medical efficacy claims. Measure page/query visibility and qualified steam enquiries for at least a finalized 28-day window after any approved release.

### 5. Index and host hygiene

Affected URLs: https://www.moralclean.com/:path*, /products/category/cleaning-chemicals, /products?tag=testing and other facets; /products/test-prod monitoring.

Implementation: verify preview's permanent www redirect, empty-category sitemap exclusion/noindex, crawlable facet noindex and appropriate pagination canonicals. Keep useful steam sourcing separate from unsupported empty categories. Keep preview protected/noindex. Remove irrelevant test tags from public filter options through a separately reviewed data change if necessary.

Acceptance: www preserves path/query through one permanent redirect to the canonical host; unsupported empty categories are absent from sitemap and carry noindex; facet URLs return intentional readable statuses/robots; meaningful pagination stays indexable/self canonical where applicable; test-prod stays404; canonical sitemaps contain reachable200 indexable pages. Test authenticated preview and production policies separately before seeking release approval.

### Other tasks

Repair/parts: verify the three preview service pages against actual repair coverage, supported brands/models, diagnosis limits and parts identification inputs. Link relevant product/category pages directly to the appropriate service and prefilled enquiry. Acceptance: service promises match operational capability and obsolete broad CTAs do not displace precise model context.

Tracking: when separately authorized, expand the existing Pakistan campaign to representative commercial category, model, parts and repair terms; segment branded/non-branded and desktop/mobile where supported. Do not create a duplicate project or use mop trolley as the business-wide success metric.

Performance/audit: obtain route-level field LCP/INP/CLS and mobile funnel evidence; query schema/CLI compatibility must be resolved before claiming usage savings. Re-audit the intended application with authorized protection handling, not a login page. Retest exact reported optimizer failures and representative sizes; optimize confirmed offenders only.

## Nonduplicate content shortlist

Fourteen guides already exist on preview: walk-behind versus ride-on; cleaning-machine costs; maintenance checklist; wet/dry vacuum selection; commercial steam selection; pressure/flow; single-disc versus scrubber; sweeper versus scrubber; warehouse checklist; steam versus vacuum; pad/brush selection; scrubber water pickup troubleshooting; trolley selection; capacity calculator.

Do not commission another generic guide in these clusters. The highest-value content is:

| Content work | Destination | Evidence and publication gate |
|---|---|---|
| Verified model/accessory comparison | Existing single-disc/ride-on/walk-behind categories and products | Actual clicks; needs verified specifications and inclusion lists |
| Commercial steam sourcing process | Existing steam category plus existing steam guide | Actual impressions; supply and support must be confirmed |
| Parts compatibility identification | Existing preview /services/cleaning-machine-parts | Commercial SERP and competitor accessory codes; publish only validated compatibility |
| Cost assumptions and quotation checklist | Existing preview costs guide | Competitor buying-cost resource; use approved current examples, no invented price table |
| Documented customer application case | A future /guides/<specific-case> only after evidence exists | Requires real customer permission, measured context and commercial category links |

Hospital/hotel/warehouse application pages should be created only with distinct operational requirements and credible expertise, not duplicated city or industry templates. A future case study is an evidence-gated candidate, not an immediate publishing commitment.

## Legitimate authority opportunities

| Prospect | Basis | Legitimate action / limit |
|---|---|---|
| [Biemmedue dealer program](https://biemmedue.com/en/become-a-biemmedue-authorized-dealer) and [manufacturer contact](https://biemmedue.com/en/contact-biemmedue) | MoralClean lists Biemmedue models; manufacturer offers dealer support | Verify actual relationship first, then seek eligible dealer/profile reference and documentation. No claim of current authorization |
| Real equipment customers | Actual deliveries/service work can substantiate expertise | Obtain permission for useful application case studies or customer procurement references; no invented customer names or paid link scheme |
| [Pakistan Hotels Association](https://www.pha.org.pk/) | Relevant hospitality procurement audience and association resources | Explore a useful equipment-selection/training resource under actual eligibility rules; membership or backlink placement is not established |
| Owned Google Business Profile and existing social profiles | Karachi physical business/contact context | Verify ownership, business identity, categories and contact consistency. No account access or ownership confirmation obtained |

Serpstat returned zero backlinks/referring domains/SDR, but a live existing link from https://www.burhansiraj.me/ to MoralClean was verified without nofollow. Therefore the tool does not provide a complete backlink census. The developer portfolio is neither independent customer endorsement nor a new prospect.

Public pages expose two phone numbers; verify their roles and keep website/schema/profile identity accurate. Do not assume one is wrong. No outreach, membership application, listing edit or message was sent.

## Missing evidence, restrictions and next measurement

Unavailable: qualified lead count/revenue, organic session conversion, phone/WhatsApp outcomes, real stock/margins/lead times, contractual warranty and distributor evidence, field CWV, full indexing/manual-action/security reports, full backlink inventory, usable Semrush organic/competitor APIs, and quantified Vercel function usage. City demand beyond the tiny Karachi sample is unproven.

Connector totals require direct aggregate GSC queries: the comparison tool with empty dimensions silently defaulted to page rows, so this report uses corrected direct property aggregates. Provider totals, query omissions, country/device subsets and sampled crawls must retain their separate scopes.

After an explicitly approved preview-tested release, annotate its date and compare finalized 28/90-day GSC windows, commercial landing-page visibility and server-confirmed qualified organic enquiries. Retain production deployment identity, sample sizes, campaign market/device settings and query anonymization caveats. At this scale, a few new clicks or one enquiry cannot support a causal uplift claim.

Research changed only repository documentation on an isolated branch. No application code, database records, production settings, tracking campaigns, audit configuration or external accounts were changed.
