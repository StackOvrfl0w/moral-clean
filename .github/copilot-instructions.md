# Copilot Instructions for `moral-clean`

## Build, lint, and test commands

Use npm in this repository:

- `npm run dev` — start Next.js dev server
- `npm run build` — production build
- `npm run start` — run built app
- `npm run lint` — run Next.js ESLint checks

Testing is not configured yet (`package.json` has no `test` script), so there is currently no supported full-suite or single-test command.

## High-level architecture

- This is a **Next.js 14 App Router** app. Route entry points are in `src/app/**` (not `pages/`).
- `src/app/layout.tsx` is the shared shell: local font setup, global CSS, `Header`, `Footer`, and global toaster.
- Product catalog pages are server-rendered routes:
  - `src/app/products/page.tsx` handles query-param-driven filtering, sorting, search, and pagination.
  - `src/app/products/[slug]/page.tsx` handles product details, metadata, static params generation, and JSON-LD.
- Product data access is centralized in `src/lib/queries/products.ts`:
  - Reads from Supabase when configured.
  - Falls back to seeded data in `src/lib/seed-data.ts` if env/config is missing, queries fail, or catalog is empty.
- Supabase schema lives in `supabase/schema.sql` and is mirrored by TypeScript domain types in `src/lib/types.ts`.
- UI is built with Tailwind + shadcn/Radix primitives (`src/components/ui/**`) and app-specific components under `src/components/layout/**` and `src/components/products/**`.

## Key repository conventions

- Use `@/*` path aliases (`tsconfig.json`) for imports from `src`.
- Keep product listing behavior URL-driven (`category`, `brand`, `tag`, `q`, `sort`, `page`) and preserve existing params when building filter/sort links.
- Keep seed fallback behavior intact when changing catalog queries. The app is designed to render product pages even without live Supabase data.
- Product specs are treated as JSON (`products.specifications`) and rendered through formatting helpers in `src/app/products/[slug]/page.tsx`; preserve this shape when changing schema/query logic.
- Slug formatting is manually handled in multiple components (e.g., header/footer/home category links). If category slug rules change, update all relevant helpers together.
- Global design tokens are CSS-variable based (`src/app/globals.css`, `tailwind.config.ts`); prefer extending tokens over hardcoding unrelated color systems.
