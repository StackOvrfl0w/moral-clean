# Steam Cleaners category removal — 12 October 2026

The owner requested removal of the category while retaining steam-related SEO content.

- The shared database still contained one steam-cleaners category, despite the reported deletion. It had zero products and zero child categories. The row was backed up in backups/steam-category-before-removal-2026-10-12.json, then deleted by its exact ID and slug. No product, article or image was deleted.
- Ride On Scrubber Dryer already existed and retained its four products. No duplicate category was created.
- Public category queries and catalogue facets exclude the retired slug, including seed fallback lists. Cache keys were refreshed. The category URL returns 404 and is excluded from the sitemap even if stale data or a future record reintroduces the slug.
- Steam buying/comparison articles remain intact. Only their two retired-category links changed to the quotation form. The former category advice copy is retained in source rather than discarded.
- Existing production catalogue cache and the sitemap's implicit route cache were cleared with scoped Vercel cache tags. Subsequent production checks found 404 for the retired URL and no retired link on home, products or catalog-sitemap.xml. Production code/master was not deployed or changed. This specifically authorized category deletion changes shared records, not a production code release.
- Bun tests: 18 pass, 74 assertions. Build/type/lint checks passed. Full local verification: 67 sitemap pages, 36 products, 12 exclusions, 67/67 reachable pages, zero errors. Focused checks confirm retired routes return 404 and both steam guides return 200 without links to the retired category.

Earlier SEO work: researched Search Console and keyword opportunities; improved category/product metadata, structured data, internal links, filters/pagination and enquiry context; prepared 14 guides and three service pages; tested desktop/mobile, images and isolated submissions. These code changes remain on preview. No ranking/traffic gain has been demonstrated from preview.

## Preview deployment limitation

Preview branch commit a847b76f1f420165dfdf4e101a9b72f6afdd29c8 contains the tested application safeguards and corrected guide links. Its CLI deployment dpl_5GftttYjH61hxqStLzRknnq5j3QU (https://moral-clean-8vscy1jr6-burhan-uddins-projects-91e8a924.vercel.app) remains INITIALIZING, with no build logs. It is not claimed READY or remotely verified. The earlier stalled Git-source deployment was cancelled to avoid a later obsolete alias assignment.

[Vercel's official status](https://www.vercel-status.com/) reported an unresolved build/deployment incident on 12 October, including queued builds and delayed starts, and partial outages for builds, CI/CD and Git integrations. This is consistent with the observed deployment stall; no production deployment was attempted as a workaround. The shared-data deletion and scoped cache refresh are already verified on production, independently of this pending code deployment. Article paragraphs were not edited or deleted.
