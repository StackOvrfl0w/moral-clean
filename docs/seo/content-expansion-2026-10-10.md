# SEO article expansion — 10 October 2026

Scope: a new content batch on **preview only**. Production remains the approved master deployment. No master push, production deployment, database write or recurring automation is part of this release.

Six original buying/procurement articles were added, bringing the guide library to nine:

| Article topic | Buyer intent and equipment link |
| --- | --- |
| Wet and dry vacuum selection | Materials, filtration, capacity, tools; vacuum category |
| Commercial steam cleaner selection | Surface, output, refill, recovery and evidence; steam category |
| Pressure-washer pressure and flow | Rated specifications, supply and duty cycle; pressure-washer category |
| Single disc machine versus scrubber dryer | Complete process comparison; single-disc, scrubber and vacuum categories |
| Sweeper versus scrubber dryer | Debris versus adhered soil and process sequence; sweeper and scrubber categories |
| Warehouse equipment procurement | Usable route, activity, site brief and complete trials; catalogue and relevant comparison articles |

New article body lengths range from 413 to 510 words, excluding titles, section headings, tables and references. No arbitrary word-count target was used. The articles answer separate practical questions rather than duplicating category copy or publishing near-identical city pages.

Article templates now include working contents anchors, real publication dates, accessible comparison tables where useful, visible manufacturer references and contextual links to equipment and related articles. Product and category pages recommend relevant guides rather than displaying the whole library on every page. The hub links to all nine articles; sitemap configuration reads the same article records. Article JSON-LD and unique metadata remain server-rendered.

The deployment URL sent a Vercel `noindex` header, but the custom `preview.moralclean.com` alias did not. A preview-only `X-Robots-Tag: noindex` rule was added to the Next.js headers configuration, covering custom aliases too. Production builds do not receive this rule; existing admin noindex/nofollow remains intact.

## Research and limits

The earlier Pakistan keyword research and the existing catalogue informed topic selection. Four new Semrush `phrase_related` requests failed with `ERROR 122: WRONG FORMAT OR EMPTY KEY`; no new search-volume figures are claimed. The prior successful reports remain useful baseline evidence.

Serpstat subsequently returned 30 autocomplete-style suggestions across three requests in `g_pk`. Vacuum suggestions included filters, accessories and parts; pressure-washer suggestions included pressure/PSI questions; steam suggestions included Pakistan purchasing variants. The articles address the relevant buying questions. Suggestions also contained unrelated countries, consumer retailers and manufacturer-specific terms, which were not used as claims of stocked brands or services. These suggestions are topic evidence, not search-volume or conversion estimates.

Equipment principles were checked against primary manufacturer references linked within the articles: Kärcher professional vacuum information, thermal-disinfection test conditions, floor-equipment guidance and sweeping/scrubbing workflow guidance; Nilfisk's professional FAQ and hot-water washer information. These sources explain principles, not Moral Clean manufacturer authorisation or features of another model. Articles do not invent current stock, prices, model availability, customer experience or hygiene/performance guarantees.

All six articles are original decision guidance. They are not copied manufacturer descriptions. No keyword stuffing, purchased backlinks or mass location-page generation was used. This release creates useful search landing pages and internal connections; it does not demonstrate a traffic or ranking gain.

## Verification

Local TypeScript and ESLint checks passed. The content check found nine unique article slugs, valid publication dates and equipment links. The vacuum-category recommendations correctly select the new vacuum guide, the single-disc comparison and the maintenance article.

The article-content deployment `dpl_Ec7GXb281pqMR7TBKNFyRDrA5Jye` built commit `3c07403` successfully in 2m 14s. Its authenticated HTTP audit passed: **60 sitemap URLs, nine articles, 36 product pages, 11 exclusion checks and zero errors**. Results are saved in `content-preview-verification-2026-10-10.json`. Article schema and contents were checked along with the prior canonical, H1, robots and pagination checks. All article-to-article and category targets also passed the source-link check.

The follow-up commit `f9909ad` changes only the preview-indexing header and this report. Its deployment `dpl_94yHeRKPdTxPqEkhP3SWVUccAR3s` is READY; the cloud build passed in 3m 20s. Local configuration checks confirmed the global noindex rule applies in preview and is absent in production; the existing admin rule remains in both. Final HTTP checks confirmed `https://preview.moralclean.com/guides` returns 200 with `X-Robots-Tag: noindex`. The new vacuum article returns 200 with its correct 10 October date, contents anchors and manufacturer references. Production returns 200 without a global noindex header, and its alias still points to the approved pre-SEO deployment `dpl_Eet82YisYPevDFQQDFHyFJttNndE`.

Review the expanded library at [preview.moralclean.com/guides](https://preview.moralclean.com/guides). No production or master release has been made.
