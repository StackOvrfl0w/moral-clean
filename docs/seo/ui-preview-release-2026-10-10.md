# Guide design and image SEO preview

Tested application commit: `d367b17` on `preview`.

Deployment: `dpl_FkpZcwdz5LUJ2mA2E7UykFp5YQdW`.

Preview: https://preview.moralclean.com/guides

## Changes

- Rebuilt the guide hub around the existing navy/cyan brand, a featured guide, topic navigation and illustrated article cards.
- Added existing equipment imagery to all nine guides and to related-guide cards across the site. Category illustrations do not imply a particular available model.
- Improved article reading layouts with a contents sidebar, mobile stacking, takeaway summaries and contained horizontal scrolling for comparison tables.
- Added article-specific social images and real image URLs to Article structured data. The guide collection uses an ItemList within its CollectionPage schema.
- Preserved existing guide text, manufacturer references and contextual equipment links.

## Validation

- Lint, TypeScript and whitespace checks passed.
- Vercel's optimized build passed.
- Browser checks covered desktop (1280px) and mobile (390px), guide navigation, equipment/service images, and comparison-table overflow. No browser errors were reported on the tested pages.
- All nine deployed social images returned PNGs at 1200 × 630. Results: `guide-image-verification-2026-10-10.json`.
- The deployed SEO audit passed all 60 sitemap URLs, 36 product pages and 11 exclusion/pagination cases, with zero errors. Results: `ui-preview-verification-2026-10-10.json`.
- The custom preview guide hub returned HTTP 200 with `X-Robots-Tag: noindex` through authorized Vercel access.
- Production alias remained on `dpl_Eet82YisYPevDFQQDFHyFJttNndE`; master remained `253902d05d522a747c589130875360117c40e815`.

Screenshots in `screenshots/` were captured from the local application before preview deployment.

A final CSS adjustment increases the desktop contents-sidebar offset to 160px and the section-anchor margin to 176px so the existing 144px sticky header does not cover them. It does not alter the audited content or metadata.

This release is preview-only. These changes cannot affect production search rankings until an explicitly approved production release is made. Appearance and metadata checks do not establish a ranking improvement.
