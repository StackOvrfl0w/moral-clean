# Current release

Production was restored to the pre-SEO master deployment on 10 October. The keyword release is preserved on preview; see [preview-review-2026-10-10.md](preview-review-2026-10-10.md). The three-month plan is deferred. The historical notes below predate this release and do not describe its current deployment or Search Console access.

The next preview batch adds six articles and contextual internal links; see [content-expansion-2026-10-10.md](content-expansion-2026-10-10.md).

# SEO implementation and release checks

## Implemented in this workspace

- Shared metadata produces titles, descriptions, route-specific canonical URLs, Open Graph and Twitter cards. Product SEO fields entered in admin are now used. Pagination keeps its own canonical; internal search, sort/filter variants and the admin area receive noindex.
- About and Services now have an H1. Rich-text headings are limited to H2/H3 and normalized on render. Category navigation is crawlable HTML links rather than button-only routing.
- Homepage promotions read real database records. Category links go to category landing pages. Blog articles link to the catalog, services and contact page. Missing/out-of-range pages return not-found behavior rather than silently displaying unrelated content.
- `/sitemap.xml` indexes `/sitemap-0.xml` (six static public pages) and `/catalog-sitemap.xml` (current products, categories and published articles). The catalog sitemap refreshes hourly and is invalidated by catalog/content admin changes; it reads paginated database results and real timestamps, not a fabricated current last-modified date.
- `robots.txt` points to the sitemap index. Admin is intentionally crawlable so search engines can read `noindex`; authentication protects its content. Noindex also appears in admin HTTP headers. Query filters are not blocked in robots.txt because their noindex tags must be readable.
- Organization, Website, Breadcrumb and Article schema were corrected; Service schema was added. Quote-only products retain factual Product schema without fabricated offers, prices, ratings or reviews. They may not qualify for Google's product rich results without real public offer/review data.
- `/opengraph-image` is the real 1200 × 630 social image. Broken `/og-image.jpg` and `/logo.png` references were removed. The manifest uses the existing 48 × 48 PNG site icon instead of broken icon URLs.
- Responsive image optimization and Sharp are enabled. Service images reserve their aspect ratio. Analytics loads after the browser becomes idle. Unused font preloads and session-cookie reads on public catalog queries were removed; request memoization prevents repeated product/category reads.
- Product images retain descriptive supplied alt text or the product-name fallback. Gallery thumbnail images are decorative because their buttons already have accessible descriptions. The rich-text editor now requires descriptive alt text on newly inserted images, and existing inline images have safe lazy-loading/decoding attributes. Existing decorative/unknown inline images can have empty alt; visual review of legacy editorial content remains necessary.
- New product slugs are normalized on the server, including edge hyphens. Existing live slugs were not renamed. No redirect targets have been guessed.

## Search Console status

A read-only DNS lookup on 2026-09-23 found an existing `google-site-verification` TXT record at `moralclean.com`. This proves that a verification record is published; it does not establish which account owns the property or whether the Search Console verification action has succeeded. No connected browser/account session was available to inspect the property or submit the sitemap.

1. Open the existing `moralclean.com` Domain property in the correct Google account and check Settings → Ownership verification. If there is no existing property, add the Domain property and compare Google's required TXT record with the existing DNS record. Preserve existing verification records.
2. Complete DNS verification in that account. An existing token belonging to another account does not automatically verify the current account.
3. After deployment, submit `https://moralclean.com/sitemap.xml`; confirm both child sitemaps are readable.
4. Inspect the homepage, one category and one real product. Check rendered canonical, crawl allowance and indexing status; inspect a test URL to confirm Google reads noindex.
5. Review indexing, manual actions, security issues and Core Web Vitals in Search Console. No clean-status claim has been made for these account-only reports.

The root layout also supports `GOOGLE_SITE_VERIFICATION` for URL-prefix HTML-tag verification. Set the token's content value in the deployment environment and redeploy only if using that method. The Domain property uses DNS instead. [Google verification documentation](https://support.google.com/webmasters/answer/9008080?hl=en)

## Deleted test content

The product records for `/products/test-prod` and `/products/test-prod2` and the blog records for `/blog/blog-test`, `/blog/blog-test1` and `/blog/blogtest2` were permanently deleted on 2026-09-23. Dependent product image rows and the two blog cover objects stored in Supabase Storage were also deleted. These routes now return `404`, which is the correct response because no equivalent replacement pages exist.

## Validation

Run `bun install --frozen-lockfile`, then `bun run build` (includes lint/type checks) and `bun run postbuild` if the package runner does not invoke it automatically. Serve with `bun run start -- -p 3000` or `bunx next start -p 3000`.

Run `bun run build`, serve the production build locally, and verify the sitemap, canonical URLs, deleted-route `404` responses, rendered metadata and internal links before deployment.

For a fresh lab run: `npx lighthouse https://moralclean.com --only-categories=performance --chrome-flags="--headless" --output=json --output-path=lighthouse.json`. Compare like-for-like deployed environments and repeated runs. A local result is diagnostic, not proof of a production improvement.

The initial live mobile Lighthouse run scored 62/100, LCP 3.7 s, CLS 0 and total blocking time 1,320 ms. The final production-build localhost run scored 82/100, with LCP 4.6 s, CLS 0 and total blocking time 80 ms. These environments are not directly comparable, and Lighthouse blocking time is not field INP. Real-user targets are LCP ≤ 2.5 s, INP ≤ 200 ms and CLS ≤ 0.1 at the 75th percentile. Field status must be checked after deployment using Search Console/CrUX or real-user measurements. [Web Vitals definitions](https://web.dev/articles/vitals)

Deployment has not been performed by this task. Changes in this workspace do not alter the currently live site. See [backlink strategy](backlink-strategy.md) for the 90-day execution plan; no outreach was sent.

## Reference decisions

Paginated pages have their own canonical URLs, following [Google pagination guidance](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading). Metadata uses Next.js 14's [Metadata API](https://nextjs.org/docs/14/app/api-reference/functions/generate-metadata). Database sitemap reads use ordered, inclusive [Supabase ranges](https://supabase.com/docs/reference/javascript/using-modifiers-range).
