# Evaluation: Issue #3 — Round 1

> Testing mode: `playwright` — first UI issue. Verified via Playwright (Chromium headless) screenshots + assertions, plus REST/Postgres introspection and a full pricing-propagation rebuild test.

## Scores

| Criterion | Score | Threshold | Pass? |
|-----------|-------|-----------|-------|
| Functionality | 10/10 | 8 | YES |
| Design Fidelity | 9/10 | 7 | YES |
| Data Integrity | 10/10 | 9 | YES |
| Code Quality | 8/10 | 7 | YES |

## Overall: PASS

## Findings

### Passing

**Functionality — all acceptance criteria verified:**

*CMS — `comparison-articles` collection*
- `ComparisonArticles.ts` exports `CollectionConfig` slug `comparison-articles`, registered in `payload.config.ts`
- Postgres tables created on startup: `comparison_articles` + `_comparison_rows`, `_faqs`, `_sources` (array tables), `_rels` (relationships)
- Editor create/update/delete via REST works (201 / "Updated successfully." / etc.)
- `slug` auto-derived: omitted on create → `stoveguard-vs-stove-shield` (from brandA/brandB)
- `publishedAt` auto-set when `status: published` on create
- `GET /api/comparison-articles?where[status][equals]=published&depth=2` returns published docs with `pricedProducts` resolved to full `pricing-data` objects
- Access: public read (200 unauthenticated), writes require auth

*Astro frontend — `web/` workspace*
- `web/` is a pnpm workspace package; `pnpm install` resolved it
- Astro 6.3.2, `output: 'static'`, Tailwind v4 via `@tailwindcss/vite`
- Design tokens ported from `.stitch/designs/comparison-article.html` into `web/src/styles/global.css` `@theme`
- Typed Payload REST client (`web/src/lib/payload.ts`) + Lexical→HTML converter (`web/src/lib/lexical.ts`)
- `pnpm --filter web build` → clean, 4 pages emitted
- `pnpm --filter web dev` / `preview` serve on :4321

*Comparison article template*
- `web/src/pages/compare/[slug].astro` with `getStaticPaths` pulling published articles
- Renders at `/compare/stoveguard-vs-stove-shield` — Playwright confirmed H1, comparison table, rich-text body (`<strong>` from Lexical bold format), FAQ accordion (2), TL;DR box, sources
- **Pricing comes from linked `pricing-data`** — Playwright found `$39.99` / `$44.95` price cells sourced from the relationship, not hardcoded
- **Propagation test passed**: PATCH `pricing-data` price 39.99 → 42.50, rebuild → article page now shows `$42.50`. One CMS update propagates on next build (the core PRD requirement)
- Responsive two-column layout (760px article + 280px sidebar), sidebar TOC + Quick Facts
- `/compare/does-not-exist` → 404 page served (title "Page Not Found")
- Empty-state handled: `index.astro` / `compare/index.astro` render a "no articles yet" card when the collection is empty

*Deploy wiring*
- `cms/src/lib/triggerDeploy.ts` — fire-and-forget, never throws
- No-op path verified: with `CLOUDFLARE_DEPLOY_HOOK_URL` unset (default local), 3 publish POSTs returned 201, no errors
- **Firing path verified**: with the env var injected, a `pricing-data` PATCH logged `[triggerDeploy] Cloudflare rebuild triggered (pricing-data/stoveguard)` — real Cloudflare hook hit successfully
- `afterChange` wired on both `comparison-articles` (on publish) and `pricing-data` (any change) — completes Issue #2's deferred propagation note

**Design Fidelity (9/10):**
- Live `/compare/[slug]` page matches `.stitch/designs/comparison-article.png` (variant A): warm off-white canvas, burnt-orange accents, Source Serif headlines + Plus Jakarta body, breadcrumbs, badge, editorial box, orange-left-border verdict box, bordered spec table, dark CTA block, dark footer, sticky sidebar
- Header nav with active-state highlight on "Comparisons"
- Homepage consistent with the same system
- Playwright: zero failed requests / console errors on real pages

**Data Integrity (10/10):**
- All collection fields/types correct; `slug` has UNIQUE index
- Relationship tables (`_rels`) resolve `pricedProducts` and `relatedArticles` at `depth=2`
- Array tables for `comparisonRows`, `faqs`, `sources`
- Tracking-param strip from Issue #2 still holds: seeded `productUrl` with `?utm_source=x` → rendered as clean `https://stoveguard.com/premium`
- Lexical→HTML converter renders paragraph/heading/bold without dropping content

**Code Quality (8/10):**
- Fully typed; `payload.ts` types mirror collections, narrowed to frontend needs
- `triggerDeploy` is a shared util — no duplicated hook logic
- Lexical converter has a `default` branch that renders children so unknown nodes never silently drop content
- Follows established collection patterns (placeholder access + `TODO(issue-6)` comment)
- No dead code, no debug artifacts, no secrets staged (`web/.env`, `web/dist/` gitignored)

### Failing

None.

## Minor Notes (non-blocking)

- **Code Quality docked 2 pts** — two deliberate contract deviations, both sound but worth recording:
  1. **No `@astrojs/cloudflare` adapter.** Contract named it; Generator used pure `output: 'static'` instead. Justified: for a build-time-only SSG site, Cloudflare Pages serves `dist/` directly — the adapter only matters for SSR and would add `workerd` deps for nothing. Add the adapter when an SSR route first appears.
  2. **`lexicalHTML` field abandoned.** It's deprecated in Payload 3.84. Generator wrote a ~90-line Lexical→HTML walker in the Astro layer instead — no deprecated API, no React runtime in `web/`. Coverage is intentionally limited to nodes the article body uses (paragraph, heading, list, link, text formats); extend as richer content lands.
- `generate:types` CLI still exits without writing in this env (known from Issue #2) — dev-server regeneration covers it.
- The Stitch mock had affiliate copy ("earn us a commission", "Find your protector at Stove Shield"); Generator correctly rewrote the editorial box + CTA to the PRD's no-affiliate stance.
- `web/` nav links to `/reviews`, `/best`, `/guides`, `/brands` are dead until those issues land — expected, not a defect.

## Feedback for Generator

No fixes required. Issue #3 passes round 1. Close and advance to Issue #6 (Educational Guides) per the reordered execution order.
