# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing website for **SmartInspect** — a Russian-language B2B site for a cloud platform that does automated road/bridge/infrastructure inspection with computer vision and AI. Production: [sminspect.ru](https://sminspect.ru). All user-facing content is in **Russian**; keep new copy in Russian.

## Commands

```bash
npm run dev        # dev server (http://localhost:3000)
npm run build      # production build
npm run lint       # ESLint
npm run lint:fix   # ESLint with autofix
npm run check      # lint + build — the full gate, mirrors the pre-push hook
```

There is no test suite. The `.husky/pre-push` hook runs `npm run check` (lint + build), so a broken build or lint error blocks pushing. Run `npm run check` before assuming work is complete.

## Architecture

Next.js 15 App Router + React 19 + TypeScript (strict). No UI library, no CSS framework, no state manager — deliberately minimal deps. Import alias `@/*` maps to the repo root (e.g. `@/lib/site`, `@/components/Nav`).

**Content is data, not markup.** All page copy lives in typed modules under `lib/` and is imported by pages/components. To change content, edit `lib/`, not JSX:
- `lib/site.ts` — single source of truth for URL, emails, operator, locale, keywords. `absoluteUrl()` lives here.
- `lib/news.ts`, `lib/solutions.ts`, `lib/platform.ts` — arrays of content records. `news` and `solutions` drive dynamic routes (`/news/[slug]`, `/solutions/[slug]`) via `generateStaticParams`, so adding an entry creates a statically-generated page on the next build.
- `lib/privacy-policy.ts`, `lib/terms.ts` — legal text (152-ФЗ compliant).

**SEO is centralized — do not hand-roll `<meta>` or `Metadata`.**
- `lib/metadata.ts` → `createPageMetadata({ title, description, path, type, publishedTime })` builds title/description/keywords/canonical/OpenGraph/Twitter consistently. `rootMetadata` (used in `app/layout.tsx`) holds the site-wide defaults and title template `%s — SmartInspect`. Every page's `metadata` export should go through `createPageMetadata`.
- `lib/schema.ts` → JSON-LD builders (Organization, WebSite, Article, BreadcrumbList, SoftwareApplication), rendered via the `<JsonLd>` component. Organization + WebSite are injected globally in `app/layout.tsx`; page-specific schemas are added per page.
- Generated crawler files are Next route handlers: `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts`, `app/opengraph-image.tsx` (1200×630 via `next/og`). When adding a new route, add it to `app/sitemap.ts`.

**Styling: CSS Modules + design tokens.** Each component has a co-located `.module.css`. Global tokens (colors, typography scale, spacing, motion easings) are CSS Custom Properties defined in `app/globals.css`, which also holds shared utility classes (`.container`, `.section`, `.eyebrow`, `.headingLg`, `.btnPrimary`, `.gradientAccent`, …). Tokens shift at the ≤768px breakpoint (font sizes, `--nav-height`, `--section-gap`). Reference existing tokens/utilities rather than introducing raw values. `design-tokens.json` is the token source and `DESIGN.md` documents the visual system ("autonomous horizon at dawn" — white canvas, navy text, one electric-blue accent, no shadows, 8px radii, Inter only).

**Page transitions & animations.** `app/template.tsx` wraps every route in `<PageTransition>` (Next remounts `template.tsx` on navigation, giving a progress bar + fade-in). Scroll animations use `<Reveal>`/`<Stagger>`/`<TextReveal>` built on `IntersectionObserver`; all respect `prefers-reduced-motion`.

## Conventions & gotchas

- Adding a route requires updating `app/sitemap.ts`; content-heavy pages should also add relevant JSON-LD via `lib/schema.ts` + `<JsonLd>`.
- `next.config.ts` only whitelists `images.unsplash.com` for remote `next/image`. Other remote hosts must be added there.
- `POST /api/demo` currently just validates (`name`, `email`, `company`, `segment` required) and logs to stdout — there is no CRM/email integration yet. Returns `{ ok: true }` (200) or `{ error }` (400).
- `src/index.ts` is a leftover scaffold (`console.log('Happy developing ✨')`) unrelated to the site — ignore it.
- No Tailwind, no `tailwind.config` — do not add one. No Cursor/Copilot rule files exist.
