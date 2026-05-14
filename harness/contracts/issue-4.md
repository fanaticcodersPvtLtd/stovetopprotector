# Build Contract: Issue #4 — Review Articles

> Status: GitHub issues not filed. Contract sourced from `PRD.md`, `plans/stoveguard-site.md` (Phase 2), `stoveguard-us-com-blueprint.md` §5.1, and `.stitch/` designs.

## Scope

Two things:

1. **`review-articles` Payload collection** — single-brand deep-dive reviews (e.g. "StoveGuard Review 2026: Honest Independent Breakdown"). One brand, not a matchup. Structured fields + rich text. References `pricing-data` for the product-lineup table.
2. **Astro template** at `/reviews/[slug]` — renders a published review. Reuses the `web/` foundation (BaseLayout, Lexical→HTML, Payload REST client, design tokens).

Per PRD §"Review Articles":
> Individual brand deep-dives (e.g., StoveGuard Review). Same structured fields as comparisons.

Per blueprint §5.1 — brand review critical sections: H1, TL;DR box (conclusion first), company background, **product lineup table (price/thickness/warranty/heat — from pricing-data)**, material breakdown, customer sentiment, first-hand review, pros, cons, who-should-buy, alternatives, FAQ, disclosure.

## Acceptance Criteria

### CMS — `review-articles` collection
- [ ] `cms/src/collections/ReviewArticles.ts` exports `CollectionConfig` slug `review-articles`, registered in `payload.config.ts`
- [ ] Postgres table created on startup (`review_articles` + array/rels tables)
- [ ] Fields (see Field Spec): `title`, `slug`, `status`, `publishedAt`, `readTimeMinutes`, `brand`, `metaDescription`, `verdict`, `ratingOutOf5`, `body` (richText), `pros` (array), `cons` (array), `productLineup` (relationship → `pricing-data`, hasMany), `faqs` (array), `relatedReviews` (self-relationship), `sources` (array)
- [ ] `slug` auto-derived from `brand` via `beforeValidate` hook if empty (kebab-case)
- [ ] `publishedAt` auto-set when `status` → `published` (`beforeChange`)
- [ ] `afterChange` fires `triggerDeploy` when `status === 'published'` (reuse `cms/src/lib/triggerDeploy.ts`)
- [ ] `ratingOutOf5` is a number, min 0, max 5
- [ ] Access: public read; writes `({ req:{ user } }) => Boolean(user)` + `TODO(issue-6)` comment — consistent with existing collections
- [ ] Editor can create/edit/publish a review in admin UI
- [ ] `GET /api/review-articles?where[status][equals]=published&depth=2` returns published docs with `productLineup` resolved to full `pricing-data` objects

### Astro template
- [ ] `web/src/pages/reviews/[slug].astro` with `getStaticPaths` pulling all published reviews
- [ ] Renders at `/reviews/{slug}`
- [ ] Page renders: breadcrumb, badge, H1, meta bar, **TL;DR verdict box** with the rating, rich-text body, **product-lineup table** (price/line/stock pulled live from `pricing-data`), **pros/cons two-column block**, FAQ accordion, disclosure, sources, sidebar (TOC + related reviews)
- [ ] Product-lineup prices come from the linked `pricing-data` entries, not hardcoded
- [ ] `web/src/pages/reviews/index.astro` — lists published reviews; empty-state handled
- [ ] `web/src/lib/payload.ts` extended with `ReviewArticle` type + `getPublishedReviewArticles()` + `getReviewArticleBySlug()`
- [ ] Disclosure line present per blueprint §5.1 ("not affiliated with [brand]; purchased with our own funds")
- [ ] Visually consistent with the Stitch review design (`.stitch/designs/review-article.png`) and the "Authoritative Editorial" system in `web/`
- [ ] `pnpm --filter web build` succeeds; review route emitted
- [ ] Unknown `/reviews/x` slug → 404
- [ ] Header nav "Reviews" link active on these pages

## Field Specification — `review-articles`

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | text | yes | e.g. "StoveGuard Review 2026: Honest Independent Breakdown" |
| `slug` | text | yes | unique, indexed; auto from `brand` if empty |
| `status` | select | yes | `draft` / `published`, default `draft` |
| `publishedAt` | date | no | auto-set on publish |
| `readTimeMinutes` | number | no | |
| `brand` | text | yes | The single brand under review |
| `metaDescription` | textarea | yes | SEO meta, ≤160 chars |
| `verdict` | textarea | yes | TL;DR box copy — conclusion first (AI-Overview bait) |
| `ratingOutOf5` | number | yes | min 0, max 5 — the review score |
| `body` | richText (Lexical) | yes | Main review body — background, material, sentiment, first-hand |
| `pros` | array | no | Each: `point` (text) |
| `cons` | array | no | Each: `point` (text) |
| `productLineup` | relationship → `pricing-data` | no | hasMany — the brand's product tiers shown in the lineup table |
| `faqs` | array | no | Each: `question` (text), `answer` (textarea) |
| `relatedReviews` | relationship → `review-articles` | no | hasMany, self-referential |
| `sources` | array | no | Each: `label` (text), `url` (text) |

## Hooks

- `beforeValidate` — derive `slug` from `brand` (kebab-case) if empty
- `beforeChange` — set `publishedAt = now` when status flips to published and it's empty
- `afterChange` — `triggerDeploy` when `status === 'published'`

(Same hook shapes as `comparison-articles` / `educational-guides`. Keep the small `toKebabCase` helper duplicated per-collection — do not over-abstract.)

## Design Reference

- Stitch design: `.stitch/designs/review-article.html` + `.png` — Designer downloads screen `0a0e364a1b204b8d9e47857f5a56a764` ("StoveGuard Review: Real User Verdict") from project `6849064886324327137`
- Design tokens: `.stitch/DESIGN.md` ("The Authoritative Editorial")
- Reuse the visual language already implemented in `web/` from Issues #3 and #6

## Technical Constraints

- Stack: Astro 6 SSG + Payload 3.84.1 + Postgres — all established
- Reuse `web/src/layouts/BaseLayout.astro`, `web/src/lib/lexical.ts`, `web/src/lib/payload.ts`, `web/src/styles/global.css`
- Do not modify or break `comparison-articles`, `educational-guides`, `pricing-data`, `media`, or existing Astro pages
- Follow the collection pattern from `ComparisonArticles.ts` (placeholder access, hook shapes, `productLineup` mirrors `pricedProducts`)
- `productLineup` resolves at `depth=2` like comparison-articles' `pricedProducts`

## Dependencies Satisfied

- Issue #1 — Payload scaffold
- Issue #2 — `pricing-data` collection (relationship target for `productLineup`)
- Issue #3 — Astro `web/` foundation: BaseLayout, Lexical converter, Payload REST client, design tokens, `triggerDeploy`. Plus the comparison-article template as a near-identical pattern reference.
- Issue #6 — educational-guides established the second content template; review-articles is the third — pattern is now well-worn
- Issue #8 — `media` collection (available for review photos)

## Definition of Done

1. All acceptance criteria verified — collection CRUD, review renders at `/reviews/[slug]`, product-lineup pricing pulled from `pricing-data`, pros/cons + verdict + rating render, build succeeds
2. Postgres `review_articles` table exists with all fields/relations
3. Evaluator (Playwright) grades: Functionality ≥ 8, Design Fidelity ≥ 7, Data Integrity ≥ 9, Code Quality ≥ 7
4. No regression — Issues #3 and #6 templates + Payload admin still work
5. Clean commit — no secrets, no `web/dist/`
