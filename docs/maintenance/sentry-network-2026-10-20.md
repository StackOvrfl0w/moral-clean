# Network error and Supabase grant notice

Sentry issue 7802020363, event 9cfa07a405124ccd89926c40b633f0a3, occurred once on the homepage at 2026-10-20 08:57:15 UTC (13:57:15 PKT), release 22d9008. It is an unhandled browser NetworkError with DOMException code 19 and no stack or failed-resource URL. All recorded fetch breadcrumbs returned 200. Five FontFace console entries immediately precede it; font loading is a plausible source, not a proven cause.

All eight fonts referenced by the live homepage CSS returned 200 with font/woff2 content types and nonempty bodies during investigation. No application code calls FontFace.load(). There is insufficient evidence to repair the client's failing request or classify it as external noise. Keep the event visible. Add browser connectivity and failed-font family/weight context to future NetworkErrors; diagnostic failure falls back to sending the original event. No URL, form content, or credentials are added.

Supabase's October 30 change only removes automatic grants for newly created public tables. Existing tables retain grants. The bootstrap schema already explicitly grants anonymous/authenticated catalog SELECT and contact INSERT, with RLS enabled. Add explicit service_role CRUD privileges for the eight named tables so schema rebuilds preserve server-only access without relying on automatic grants. Do not grant public write access or disable RLS. No new table or live database mutation is required for this notice.

References:

- https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically
- https://developer.mozilla.org/en-US/docs/Web/API/FontFace/load
