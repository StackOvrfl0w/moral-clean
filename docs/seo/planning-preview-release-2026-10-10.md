# Equipment planning preview release — 10 October 2026

Application commit: `c78c14969d50203b494b75fd3c550edc9110fefe`, branch `preview`.

Tested deployment: `dpl_8vfn51AgzodBaoKCrpADb9nfVjdE`, [immutable deployment](https://moral-clean-ealolaf3k-burhan-uddins-projects-91e8a924.vercel.app).

Review the [capacity calculator](https://preview.moralclean.com/guides/floor-scrubber-cleaning-capacity-calculator#capacity-calculator), [trolley guide](https://preview.moralclean.com/guides/mop-trolley-cleaning-trolley-buying-guide-pakistan) and [guide hub](https://preview.moralclean.com/guides). Preview requires the existing Vercel authentication.

## Validation

- TypeScript: `npx tsc --noEmit`, passed.
- Targeted lint: all three changed/new TSX components, passed.
- Git whitespace check: passed.
- Calculator: conversion, stop-time addition, area/width scaling, reference example and ten invalid-input cases passed via `node --experimental-strip-types scripts/verify-floor-capacity.mjs`. Node reports a harmless module-format detection warning; project module settings were not changed for this test.
- Browser: default output 205 minutes; doubling area gives 389 minutes; zero allowance suppresses the numeric result; reset restores default output. Five inputs have labels and descriptive hints. Browser error log empty.
- Mobile: 390px viewport, 375px document width, no horizontal overflow; controls remain readable and fit the layout. Desktop and mobile evidence is in `screenshots/capacity-planner-desktop.png` and `screenshots/capacity-planner-mobile.png`.
- Vercel: build Ready; API metadata confirms application commit and preview branch.
- Custom preview: authenticated HTTP 200 and `X-Robots-Tag: noindex`; rendered HTML contains the calculator's initial numeric output and actual article content.
- Full deployed audit passed: 68 sitemap URLs, 36 product pages, 12 exclusion/pagination checks, zero detected errors. All 14 social images passed PNG, 1200×630 and preview noindex checks. Results are saved in `planning-preview-verification-2026-10-10.json` and `planning-image-verification-2026-10-10.json`.

## Release boundary

Master and origin/master remain `253902d05d522a747c589130875360117c40e815`. Production `moralclean.com` remains on `dpl_Eet82YisYPevDFQQDFHyFJttNndE`. No database writes or production promotion occurred.

Preview validation confirms implementation checks, not a ranking improvement. The added content remains unavailable for indexing until an approved production release.
