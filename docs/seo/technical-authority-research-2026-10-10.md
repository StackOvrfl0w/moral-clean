# Technical SEO and authority review — 10 October 2026

This review deliberately focuses on existing-page discovery, canonical hosts, audit verification and external authority, rather than adding more articles.

## Connector evidence

HYPD Search Console:

- Submitted sitemap: `https://moralclean.com/sitemap.xml`, last downloaded 9 October 2026, 51 submitted URLs, zero errors/warnings. The sitemap API's aggregate `indexed: 0` is not treated as an index verdict.
- Steam category: URL Inspection `PASS`, submitted and indexed, successful mobile crawl, matching Google/user canonical. Last crawl 24 September 2026. This is Google's stored inspection result, not a fresh live test.
- `/products/test-prod`: stored inspection says indexed, last crawl 26 September. A fresh HTTP request now returns 404. The remaining indexed record needs recrawl processing; no new removal or production change was made.

Serpstat:

- Existing production project 1324763; preview project 1324788. No new project created.
- Production report 11351106, dated 9 October 2026: SDO 92, 79 HTTP 4xx items, 60 broken-image items, one duplicate-title group, one www redirect issue. A high score is not proof all reported problems are fixed or all pages rank.
- Sampled 4xx rows are filter URLs with status 403, not 404. A fresh request to the sampled ride-on/dusty-650-m filter returned 200. The actual cause of the crawler's earlier 403 was not established.
- A sampled optimized image reported broken returned HTTP 200, image/png, 83,465 bytes. Do not label all 60 images as broken, replace assets or disable protection merely to change an audit score. Additional scanner-specific diagnosis remains separate from this implementation.
- The duplicate contact-title group contains four URLs, but the returned row did not identify their exact URLs. Current enquiry variants intentionally share the `/contact` canonical; do not generate different titles solely to satisfy a duplicate counter without inspecting the affected URLs.
- Backlink API detected zero referring domains/backlinks and SDR 0. Domain regional-keyword API returned no data. These are Serpstat coverage observations, not proof of zero real links or zero Google rankings. A fresh HTTP check of [the public developer portfolio](https://www.burhansiraj.me/) returned 200 and confirmed an actual link to `https://moralclean.com/` without a nofollow attribute. This establishes an existing public link that Serpstat has not reported; it does not establish its ranking weight or independent endorsement.

## Public tactics reviewed

[Reddit's quick-fix discussion](https://www.reddit.com/r/SEO/comments/1qflkjg/whats_the_fastest_website_fix_youve_seen_actually/) and related public threads frequently mention index controls, canonicals and internal links. Their ranking claims are uncontrolled anecdotes. Searches for X and Quora did not provide stronger, site-specific evidence.

Primary references used to validate the implementation:

- [Google crawlable-link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable): actual links and useful anchor text support discovery and understanding.
- [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls): permanent redirects provide a strong canonicalization signal; use consistent preferred URLs.
- [Google sitelinks search box retirement](https://developers.google.com/search/blog/2024/10/sitelinks-search-box): the retired search-box feature is not a ranking opportunity. Removing its unused action markup is cleanup, not a claimed ranking boost.
- [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies): purchased ranking links, automated forum links and scaled content without value are not part of this work.
- [Next.js redirects reference](https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects): host-limited permanent redirect configuration.

## Implemented on preview

- Host-specific 308 redirect for `www.moralclean.com` to the apex, preserving path and query. Local curl with an explicit Host header returned the intended 308 and preserved query. Ordinary local and preview host requests remain unaffected. The production www endpoint remains unchanged until an approved release.
- Three direct service-detail links from the homepage. Machine product pages link to repair and parts assessment, single-disc products also link to brush refilling, and manual janitorial items link to accessory-selection advice. Existing navy/cyan service-card styling retained.
- More specific product support links and enquiry scope, without asserting every consumable or brush application is available.
- Product image `sizes` capped around displayed desktop card/gallery widths. Image optimization remains enabled. No field performance or Core Web Vitals improvement is claimed without measurements.
- Retired SearchAction removed; WebSite identity and publisher retained.
- Full audit now measures reachability from the homepage through canonical internal links and checks category-appropriate support links on all products.

## External authority work still depends on real business evidence

Google's [local-ranking guidance](https://support.google.com/business/answer/7091?hl=en) identifies relevance, distance and prominence as the main local factors. A general brand search did not establish whether an owned Business Profile exists or is verified. Its absence from these returned web results is not proof of absence. Profile ownership and public contact facts need verification before any edit or listing creation.

The next authority work is a verified Business Profile and genuine supplier/customer references, not fabricated links. No external messages, forum posts, profile edits or link purchases were made.

Use the canonical homepage and actual contact page for citation records. The live site exposes two telephone numbers: `+923098783242` and `+923313195138`. They may be legitimate distinct contacts; the audit does not establish which should be the primary public business number. Do not guess a number, invent a location or create duplicate listings.

Prepare evidence before publishing: business ownership and physical address for a Business Profile; documented distributor relationship for a supplier dealer listing; customer permission and verifiable job details for a case study. Outreach and public posting require explicit authorization. No production or database release is included here.
