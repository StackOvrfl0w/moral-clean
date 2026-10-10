# Equipment service preview release — 10 October 2026

Application commit: `0692f8caad3ac85362342e5afe175ef316069536` on `preview`.

Tested deployment: `dpl_CrVYjo358pAoQD7dJFMA53sFVSMn`, [immutable preview](https://moral-clean-66twy7bkj-burhan-uddins-projects-91e8a924.vercel.app).

Review pages:

- [Machine repair](https://preview.moralclean.com/services/cleaning-machine-repair)
- [Parts and replacement](https://preview.moralclean.com/services/cleaning-machine-parts)
- [Brush refilling](https://preview.moralclean.com/services/brush-refilling)

Vercel authentication remains enabled. An unauthenticated login page is not evidence of application success. The custom preview was checked using authenticated Vercel curl: HTTP 200, actual service content and `X-Robots-Tag: noindex`.

## Validation

- TypeScript `tsc --noEmit`: passed.
- Targeted Next.js lint for both changed service page components: passed.
- Git diff whitespace check: passed.
- Vercel build: Ready; deployment metadata confirms the preview branch and application commit above.
- Local browser: hero image loaded, heading computed colour white, mobile 390px viewport with 375px document width and no horizontal overflow; native FAQ opened successfully.
- All three detail pages linked from the real service hub; legacy contact form service values retained.
- Desktop and mobile evidence: `screenshots/service-page-desktop.png`, `screenshots/service-page-mobile.png`.
- Full deployed SEO audit passed: 66 sitemap URLs, 36 product pages, 12 exclusion/pagination checks, zero errors. All three service pages have valid canonical URLs, Service schema and visible checklists/FAQs. Unknown services and the Sentry-triggering page=999 category request return 404/noindex. Results are recorded in `service-preview-verification-2026-10-10.json`.

## Production boundary

Master and origin/master remain `253902d05d522a747c589130875360117c40e815`. The production alias remains on `dpl_Eet82YisYPevDFQQDFHyFJttNndE`. This release does not change production or the database.

These preview pages cannot contribute organic traffic until an approved production release makes them indexable. No ranking gain is claimed from implementation or preview validation.
