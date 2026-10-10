# Editorial preview release

Application commit: `1a7bdb4` on `preview`.

Deployment: `dpl_2g33PQr1VH7wVRFxygS2fvE4QjcS`.

Preview: https://preview.moralclean.com/guides

## Content

- [Steam cleaner versus wet and dry vacuum](https://preview.moralclean.com/guides/steam-cleaner-vs-wet-dry-vacuum)
- [Floor-cleaning pad and brush selection](https://preview.moralclean.com/guides/floor-cleaning-pads-brushes-selection-guide)
- [Poor scrubber water-pickup checks](https://preview.moralclean.com/guides/floor-scrubber-not-picking-up-water)

The library now contains 12 guides. New articles use the existing brand layout and images, comparison tables, summaries, FAQs, manufacturer references and equipment/service links. Five links were added from four existing articles. FAQs render without additional client JavaScript and do not claim FAQ rich-result eligibility.

Research sources, exact query context, returned keyword estimates, word counts and the Semrush API error are recorded in `editorial-research-2026-10-10.md`.

## Verification

- Local lint, TypeScript, internal article-link and table-shape checks passed.
- Browser checks passed for FAQ interaction, mobile width, contained table scrolling and the accessory image; screenshots are in `screenshots/`.
- Vercel's optimized preview build completed successfully.
- All 12 deployed social images returned 1200 × 630 PNGs with preview noindex protection; results are in `editorial-image-verification-2026-10-10.json`.
- The custom-preview steam comparison returned HTTP 200, three FAQ disclosures, the correct table caption, article image metadata and `X-Robots-Tag: noindex`.
- The full audit passed 63 sitemap URLs, 36 product pages and 11 exclusion/pagination checks with zero errors; results are recorded in `editorial-preview-verification-2026-10-10.json`.

Production alias remained on `dpl_Eet82YisYPevDFQQDFHyFJttNndE`. Both master references remained at `253902d05d522a747c589130875360117c40e815`. No database content was written for this release.

The content is preview-only. It cannot affect production search results until an explicitly approved production release. Passing content and technical checks is not evidence of a ranking increase.
