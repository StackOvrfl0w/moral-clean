# Technical SEO preview release — 10 October 2026

Application branch `preview`, application commit `3ba8106`.

Final deployment `dpl_9TCLwDbhEvNoFr6YU5Fr25q8gTME`, application commit `3ba810616fa91646e037e4297d94026d5b61fac8`: [preview](https://moral-clean-p7ghklvym-burhan-uddins-projects-91e8a924.vercel.app). The [custom preview](https://preview.moralclean.com/) remains protected and noindex.

## Implementation verification

- TypeScript passed after correcting a scoped homepage-link edit.
- Targeted lint passed for homepage, product details, gallery, card and WebSite schema.
- Git diff whitespace check passed.
- Local explicit `Host: www.moralclean.com` request to a category path with a query returned 308 to the matching apex URL, retaining the query. This tests staged code, not live production behaviour.
- Ordinary local homepage and a real product detail returned 200. The homepage contains all three service detail links. No SearchAction remains. Product markup contains the updated desktop gallery image size. Subsequent support refinement removes machine repair advice from manual equipment and limits brush-refilling links to single-disc machines; final deployed checks cover those category rules.
- Vercel build Ready and preview environment confirmed by inspect.
- Authenticated custom preview homepage returned actual app HTML, HTTP 200 and `X-Robots-Tag: noindex`.
- Final deployed audit passed: 68 sitemap pages, 36 products, 12 exclusion/pagination cases, zero detected errors. All 68 pages are reachable from the homepage through 1,408 unique source-to-target internal links (counted once per source page); no orphan sitemap pages detected. Product support links passed the category-specific checks. Results are recorded in `technical-preview-verification-2026-10-10.json`.

## Boundaries and remaining external dependencies

Production remains on `dpl_Eet82YisYPevDFQQDFHyFJttNndE`, master `253902d05d522a747c589130875360117c40e815`. No master push, production promotion, database write, security relaxation or external messaging was performed.

Production's www endpoint still returns 200 while the redirect awaits an approved release. Google's stored test-product index verdict also awaits recrawl of its current 404. These are not reported as resolved production issues.

Serpstat's historical scanner-specific 403/image flags require additional scanner-specific evidence if they persist. Fresh sampled URLs returned 200. No global audit-clearance or field-performance gain is claimed.

External authority remains a separate requirement: verified business identity and legitimate references. See `technical-authority-research-2026-10-10.md` for source evidence and limits.
