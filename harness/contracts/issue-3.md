# Build Contract: Issue #3 — Comparison Articles + Astro Frontend Bootstrap

> Status: GitHub issues not filed. Contract sourced from `PRD.md`, `plans/stoveguard-site.md` Phase 1, `stoveguard-us-com-blueprint.md` §5.2, and `DESIGN.md`.
>
> Execution order was reordered (#3 before #6) — see `state.json.execution_order_history`. This is the **Astro frontend bootstrap issue**; every later UI issue (#6, #4, #5, #7, #9, ...) reuses the foundation it lays down.

## Scope

Three things, in one issue:

1. **`comparison-articles` Payload collection** — brand-vs-brand matchup content type. Rich text body + structured fields, references `pricing-data` entries by relationship.
2. **Astro frontend bootstrap** — scaffold the Astro app into the `web/` pnpm workspace. SSG by default. Fetches from Payload REST API at build time. This is the reusable base for all future templates.
3. **Comparison article template** — renders a published comparison article at `/compare/[brand1]-vs-[brand2]`, with pricing pulled live from the referenced `pricing-data` entries.

Plus the deploy wiring:

4. **Cloudflare Pages deploy hook** — Payload `afterChange` hook on publish triggers `CLOUDFLARE_DEPLOY_HOOK_URL` rebuild.

Per plan Phase 1 "What to build":
> Build a minimal Astro frontend that fetches comparison article data from Payload's REST API and renders a single article page with pricing pulled from the referenced pricing-data entries. Set up the Cloudflare Pages deployment with a Payload webhook triggering rebuilds on content publish.

Per blueprint §5.2 — comparison page critical sections: H1, TL;DR verdict box, top comparison table (12–15 cited rows), 5 deep-dive sections, real-world test, verdict-by-buyer-type, FAQ, related comparisons, disclosure.

## Acceptance Criteria

### CMS — `comparison-articles` collection
- [ ] `cms/src/collections/ComparisonArticles.ts` exports `CollectionConfig` slug `comparison-articles`, registered in `payload.config.ts`
- [ ] Postgres table created on startup
- [ ] Structured fields present (see Field Spec below): `title`, `slug`, `brandA`, `brandB`, `metaDescription`, `tldrVerdict`, `body` (Lexical rich text), `comparisonRows` (array), `faqs` (array), `relatedArticles` (relationship self), `sources` (array), `pricedProducts` (relationship → `pricing-data`, hasMany), `readTimeMinutes`, `publishedAt`, `status` (draft/published)
- [ ] `slug` auto-derived from `brandA` + `brandB` via `beforeValidate` hook → `{brandA-slug}-vs-{brandB-slug}`
- [ ] Editor can create/edit/publish a comparison article in admin UI
- [ ] REST `GET /api/comparison-articles?where[status][equals]=published` returns published docs
- [ ] Access: public read; write `({ req:{ user } }) => Boolean(user)` with `TODO(issue-6)` comment (same pattern as `pricing-data`, `media`)
- [ ] `pricedProducts` relationship resolves — `?depth=2` returns embedded `pricing-data` docs

### Astro frontend — `web/` workspace
- [ ] `web/` is a pnpm workspace package (`web/package.json` name `web`)
- [ ] Astro installed, `output: 'static'` (SSG), `@astrojs/cloudflare` adapter configured
- [ ] Tailwind configured with `DESIGN.md` tokens (parchment `#fdfbf5`, charcoal `#191919`, gold `#fec333`, amber `#f9b510`)
- [ ] `web/.env` reads `PAYLOAD_API_URL`, `SITE_URL`; `web/.env.example` documents them (no secrets)
- [ ] A typed Payload REST client in `web/src/lib/payload.ts` — fetches collections at build time
- [ ] `pnpm --filter web build` produces `web/dist/` with no errors
- [ ] `pnpm --filter web dev` serves locally (Astro default :4321)

### Comparison article template
- [ ] Dynamic route `web/src/pages/compare/[slug].astro` with `getStaticPaths` pulling all published comparison articles from Payload
- [ ] Route renders at `/compare/{brandA-slug}-vs-{brandB-slug}`
- [ ] Page renders: H1, TL;DR verdict box, top comparison table from `comparisonRows`, rich-text body, FAQ section from `faqs`, related articles, sources/disclosure
- [ ] Comparison table prices come from the linked `pricing-data` entries (via `pricedProducts`), not hardcoded
- [ ] Editing a `pricing-data` price + rebuilding updates the price shown on the article page
- [ ] Implementation visually matches the Stitch design (`.stitch/designs/comparison-article.png`) — layout, color, type hierarchy, spacing
- [ ] Responsive: readable on mobile, tablet, desktop
- [ ] 404 / empty-state handled if no published articles exist at build time

### Deploy wiring
- [ ] `comparison-articles` (and `pricing-data`) `afterChange` hook POSTs to `process.env.CLOUDFLARE_DEPLOY_HOOK_URL` when `status === 'published'` — guarded so it no-ops if the env var is unset (local dev) and never throws
- [ ] Hook is non-blocking (fire-and-forget, errors logged not thrown)
- [ ] Cloudflare Pages build settings documented in contract notes for the user to apply in dashboard (build cmd, output dir, NODE_VERSION)

## Field Specification — `comparison-articles`

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | text | yes | e.g. "StoveGuard vs Stove Shield 2026: Tested Side-by-Side" |
| `slug` | text | yes | unique, indexed; auto from brandA+brandB if empty |
| `brandA` | text | yes | First brand name |
| `brandB` | text | yes | Second brand name |
| `metaDescription` | textarea | yes | SEO meta, ≤160 chars (soft warning in admin description) |
| `tldrVerdict` | textarea | yes | The TL;DR verdict box copy |
| `body` | richText (Lexical) | yes | Main article body — deep-dive sections |
| `comparisonRows` | array | no | Each: `label` (text), `valueA` (text), `valueB` (text), `sourceUrl` (text) — the 12–15 row spec table |
| `pricedProducts` | relationship → `pricing-data` | no | hasMany; the products whose live prices appear in the table |
| `faqs` | array | no | Each: `question` (text), `answer` (textarea) |
| `relatedArticles` | relationship → `comparison-articles` | no | hasMany, self-referential |
| `sources` | array | no | Each: `label` (text), `url` (text) — citations |
| `readTimeMinutes` | number | no | Manual or computed; manual for now |
| `publishedAt` | date | no | Set when status flips to published |
| `status` | select | yes | `draft` / `published`, default `draft` |

## Hooks — `comparison-articles`

- `beforeValidate` — derive `slug` from `brandA`/`brandB` (`kebab(brandA)-vs-kebab(brandB)`) if `slug` empty
- `beforeChange` — if `status` transitions to `published` and `publishedAt` empty, set `publishedAt = now`
- `afterChange` — if `status === 'published'`, fire deploy hook (shared util, see Deploy wiring)

## Deploy Hook Utility

Create `cms/src/lib/triggerDeploy.ts`:
- Reads `process.env.CLOUDFLARE_DEPLOY_HOOK_URL`
- If unset → log debug + return (local dev no-op)
- If set → `fetch(url, { method: 'POST' })`, catch + log errors, never throw
- Imported by `comparison-articles` and `pricing-data` `afterChange` hooks (retro-add to `pricing-data` is in scope — small, completes the propagation story from Issue #2's deferred note)

## Design Reference

- Stitch design: `.stitch/designs/comparison-article.html` + `.png` — produced by the Designer phase
- Design tokens: `DESIGN.md` (Lemkus system — parchment/charcoal/gold, condensed display + serif body, 1px borders, editorial mood)
- `.stitch/DESIGN.md` and `.stitch/SITE.md` to be bootstrapped by the Designer on first run

## Technical Constraints

- Stack: Astro (SSG, `output: 'static'`) + `@astrojs/cloudflare` adapter + Payload CMS 3.84.1 + Postgres 16
- pnpm workspace already declares `web` package — Generator creates the package contents
- Payload runs :3001, Astro dev :4321 — no port conflict
- Astro fetches Payload REST at **build time** only (SSG) — no client-side Payload calls
- Do not break `pricing-data` or `media` collections, or the Payload admin
- `web/.env` must be gitignored (root `.gitignore` covers `.env` recursively — verify)
- Follow established collection patterns from `PricingData.ts` / `Media.ts`
- Tailwind tokens must come from `DESIGN.md`, not invented

## Dependencies Satisfied

- Issue #1 — Payload scaffold, Postgres, admin, pnpm workspace, dev server
- Issue #2 — `pricing-data` collection (the relationship target for `pricedProducts`); placeholder-access pattern
- Issue #8 — `media` collection (available for article OG images, though not required by #3 acceptance criteria)

## Definition of Done

1. All acceptance criteria verified — CMS collection CRUD, Astro builds, template renders at the route, pricing propagates from `pricing-data` on rebuild
2. Postgres `comparison_articles` table exists with all fields/relations
3. Evaluator (Playwright mode — UI exists now) grades:
   - Functionality ≥ 8/10
   - Design Fidelity ≥ 7/10 (vs `.stitch/designs/comparison-article.png`)
   - Data Integrity ≥ 9/10
   - Code Quality ≥ 7/10
4. No regression — Payload admin, `pricing-data`, `media` all still work
5. Deploy hook fires on publish when env set; no-ops cleanly when unset
6. Clean commit — no secrets, `web/dist/` and `web/.env` not staged
