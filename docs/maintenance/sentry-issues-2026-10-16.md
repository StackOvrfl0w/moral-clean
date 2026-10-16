# Sentry issue investigation — 2026-10-16

Read all 13 available events across the three requested issues using the Sentry API. No issue statuses or database records were changed.

## Catalog: MORAL-CLEAN-2 / 7783780916

Seven historical events, last seen 2026-10-11, on release `253902d05d522a747c589130875360117c40e815`. The supplied event contains PostgREST `PGRST103`: offset 11976 was requested for six category products. The application converted an out-of-range request into a server error.

Commit `9510c91` already fixed this in the approved master history: validate requested pages before querying/caching rows and convert a range invalidated by concurrent changes to `notFound()`. No duplicate query change is needed.

## Blog: 7786259964

Two historical events, last seen 2026-10-11, on the same old release. The supplied event records “Requested range not satisfiable.” The same existing pagination fix covers published articles, including count validation and concurrent range changes.

## Injected runtime: 7772158516

Four events across `/`, `/about`, and `/contact`, last seen 2026-10-13. Every available event has only `ext:core/01_core.js` and `<script>` frame locations. No application or Next.js bundle frame is present. This identifies an external Deno runtime signature; the particular tool injecting it cannot be established from these events. The contact event followed a successful GET prefetch, with no form submission breadcrumb.

Add a browser-only `beforeSend` filter requiring all of:

- Exactly one TypeError with the exact observed undefined `getReader` message.
- Automatic browser unhandled-rejection mechanism.
- At least one exact `ext:core/01_core.js` location.
- Every frame location is that runtime or `<script>`; no empty or unknown frame.

Keep all events containing application frames, other error types/messages, manual captures, or linked exceptions. This removes a verified external-runtime signature from application telemetry; it does not repair the external runtime.

## Verification

- 29 targeted tests pass: pagination, transport error handling, and preservation of application errors by the new filter.
- ESLint and TypeScript checks pass.
- Read-only production requests: `/products?page=999`, `/products/category/single-disk-machine?page=999`, and `/blog?page=999` each return 404 with noindex, rather than server errors. The normal category, blog, and contact pages each return 200.
- The category hover change and runtime filter remain on `codex/sentry-category-fixes` for preview review. No new production release is authorized.
