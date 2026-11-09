# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**SmartInspect** is a Russian-language B2B site for a cloud platform that inspects roads, bridges and other infrastructure automatically, using computer vision and AI. Production is [sminspect.ru](https://sminspect.ru) (operator ООО «ФЕРРАН»). The repo has three parts:
1. A public marketing site, which is the SEO-relevant part.
2. A demo **личный кабинет** (dashboard) at `/dashboard/*`, which runs on mock data.
3. A small **leads** backend that stores demo requests and has an admin view at `/dashboard/leads`.

All user-facing content is in **Russian**. Keep new copy in Russian.

## Commands

```bash
npm run dev        # dev server (http://localhost:3000)
npm run build      # production build (output: "standalone")
npm run lint       # ESLint
npm run lint:fix   # ESLint with autofix
npm run check      # lint + build — the full gate, mirrors the pre-push hook
```

There is no test suite. `next.config.ts` sets `eslint.ignoreDuringBuilds`, so `npm run build` alone does **not** catch lint errors. The `.husky/pre-push` hook runs lint and build separately, so run `npm run check` before you treat work as done.

Env vars are listed in `.env.example`. None of them are required for local dev:
- `DATABASE_URL` / `POSTGRES_URL`: Neon Postgres. If neither is set, leads go to the file store `.data/leads.json`, which is seeded with sample leads.
- `LEADS_ADMIN_TOKEN`: the admin key for the leads view. Dev fallback: `smartinspect-demo-admin`.
- `NEXT_PUBLIC_MAPTILER_KEY`: tiles for the dashboard map. It is inlined at **build time**, so the Docker build passes it as a build arg.

## Architecture

The stack is Next.js 15 App Router, React 19 and TypeScript (strict). Dependencies are kept deliberately minimal: no UI library, no CSS framework, no state manager. Runtime deps are only `next`, `react`, `@neondatabase/serverless` and `maplibre-gl`. The import alias `@/*` maps to the repo root.

**Layout chrome.** The root layout `app/layout.tsx` wraps everything in `AnalyticsProvider` → `AuthProvider` → `SiteChrome`.
- `SiteChrome` adds Nav and Footer to public pages. It leaves `/dashboard/*`, `/login` and `/register` bare, because those provide their own layout through `DashboardShell` / `AuthScreen`.
- `app/template.tsx` wraps every route in `<PageTransition>`.

**Content is data, not markup.** Copy lives in typed modules under `lib/`. To change content, edit `lib/`, not JSX.
- `lib/site.ts` is the single source of truth for the URL, emails, operator, locale and keywords. `absoluteUrl()` is defined there.
- `lib/news.ts` and `lib/solutions.ts` drive `/news/[slug]` and `/solutions/[slug]` through `generateStaticParams`. Adding an entry creates a static page on the next build.
- `lib/platform.ts` holds the platform content. `lib/privacy-policy.ts` and `lib/terms.ts` hold the legal text (152-ФЗ).
- `lib/dashboard.ts` holds the **static mock data** for every dashboard page: objects, defects, inspections, alerts, reports and chart series, plus the label maps and date formatters.

**Two separate auth mechanisms. Do not confuse them.**
- **Dashboard user auth is client-only and fake.** It lives in `lib/auth.ts` and `components/AuthProvider.tsx`. Accounts and the session are stored in `localStorage` under `smartinspect.accounts` and `smartinspect.session`. `DashboardShell` redirects to `/login` when no user is present. The demo login is `demo@sminspect.ru` / `demo1234`. Nothing here is a security boundary.
- **Leads admin auth is real and server-side.** It lives in `lib/admin-auth.ts`. `POST /api/admin/login` checks `LEADS_ADMIN_TOKEN` and sets an httpOnly cookie (`si_leads_admin`) that holds the token's SHA-256 hash. `DELETE` on the same route logs out. `GET` and `PATCH /api/leads` call `isAdminAuthed()`.

**Leads pipeline.** The `DemoForm` component posts to `POST /api/demo`, which validates `name`, `email`, `company` and `segment`, then calls `addLead()` in `lib/leads.ts`.
- `lib/leads.ts` picks one of two backends at startup. If a DB URL is set it uses Neon Postgres. On the first query it creates the `leads` table automatically with `CREATE TABLE IF NOT EXISTS`, and there are no migrations. Otherwise it uses the JSON file store, whose directory can be overridden with `LEADS_DIR`.
- Types shared with the client live in `lib/leads-types.ts`, which is safe to import from client components. Do not import `lib/leads.ts` client-side, because it uses `fs` and `crypto`.
- Lead statuses are `new`, `in_progress` and `done`.

**SEO is centralized. Do not hand-roll `<meta>` or `Metadata`.**
- `createPageMetadata({ title, description, path, type, publishedTime })` in `lib/metadata.ts` builds the title, description, canonical, OpenGraph and Twitter tags. `rootMetadata` holds the site defaults and the title template `%s — SmartInspect`.
- JSON-LD builders live in `lib/schema.ts` and render through `<JsonLd>`. Organization and WebSite are injected globally. Page-specific schemas are added per page.
- `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts` and `app/opengraph-image.tsx` are route handlers. When you add a **public** route, add it to `app/sitemap.ts`.
- `robots.ts` disallows `/api/`, `/dashboard/`, `/login` and `/register`. Keep private routes out of the sitemap.

**Analytics and consent.** `AnalyticsProvider` loads Yandex.Metrika only after the user accepts all cookies in `CookieBanner`. Consent is stored in `localStorage` under `smartinspect_cookie_consent`. The Metrika counter ID is currently a placeholder (`99999999`). Any new tracking script must be gated the same way.

**Styling.** Each component has a co-located CSS Module.
- Design tokens are CSS Custom Properties defined in `app/globals.css`. That file also holds the shared utilities: `.container`, `.section`, `.eyebrow`, `.headingLg`, `.btnPrimary`, `.gradientAccent` and others.
- Tokens shift at the ≤768px breakpoint. Use the existing tokens instead of raw values.
- `design-tokens.json` is the token source. `DESIGN.md` documents the visual system: white canvas, navy text, one electric-blue accent, no shadows, 8px radii, Inter only.
- All dashboard pages share one stylesheet, `components/Dashboard.module.css`, along with the primitives in `dash-ui.tsx` and `dash-icons.tsx`.
- Scroll animations (`Reveal`, `Stagger`, `TextReveal`) use `IntersectionObserver` and respect `prefers-reduced-motion`.

## Deploy

The site is self-hosted in Docker on a FirstVDS server, **not Vercel**. Some comments in `lib/leads.ts` and `lib/admin-auth.ts` still mention Vercel; they are outdated.
- **Automatic deploy:** pushing to `master` runs `.github/workflows/deploy.yml`. It builds the `Dockerfile` image for linux/amd64 on GitHub's runners, streams it over SSH to `/var/www/smart-inspect`, and runs `docker compose up -d`. Nothing is built on the server.
- **Manual deploy:** `./deploy.sh` builds the image locally and ships it the same way.
- **Runtime:** `docker-compose.yml` exposes the container on `127.0.0.1:3003`, with a reverse proxy in front, and sets `mem_limit: 150m`. Watch memory use at runtime. The server's `.env` provides the runtime secrets.

## Gotchas

- `next.config.ts` sets `images.unoptimized: true`, so there is no remote-image whitelist and no image optimizer at runtime.
- `src/index.ts` is a leftover scaffold, and `scripts/remove-logo-bg.py` is a one-off asset script. Neither belongs to the app.
- Do not add Tailwind or a `tailwind.config`.
