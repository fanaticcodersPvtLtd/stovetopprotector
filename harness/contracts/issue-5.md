# Build Contract: Issue #5 — Buyer Guides

> Status: GitHub issue #5 filed. Contract sourced from `PRD.md`, `plans/stoveguard-site.md` (Phase 2), `stoveguard-us-com-blueprint.md` §5.3, and `.stitch/` designs.

## Scope

1. **`buyer-guides` Payload collection** — ranked product-list guides (e.g. "Best Stove Top Protectors of 2026"). Structured ranked entries, each linking a `pricing-data` product with editorial scoring. Plus methodology, "what to look for", FAQ.
2. **Astro template** at `/best/[slug]` — renders a published buyer guide. Reuses the `web/` foundation.

Per PRD §"Buyer Guides":
> Ranked product lists (e.g., Best Stove Protectors 2026, Best for Gas Stoves). Same structured fields as comparisons.

Per blueprint §5.3 — critical sections: H1, methodology box, quick picks (best overall / for gas / for glass / budget / for RV), **full numbered rankings (each: product, price, our score, what it does well, drawbacks)**, what-to-look-for, common mistakes, FAQ, disclosure.

## Acceptance Criteria

### CMS — `buyer-guides` collection
- [ ] `cms/src/collections/BuyerGuides.ts` exports `CollectionConfig` slug `buyer-guides`, registered in `payload.config.ts`
- [ ] Postgres table created on startup (`buyer_guides` + array/rels tables)
- [ ] Fields (see Field Spec): `title`, `slug`, `status`, `publishedAt`, `readTimeMinutes`, `metaDescription`, `methodology`, `rankedProducts` (array w/ nested relationship), `body` (richText), `faqs` (array), `relatedGuides` (self-relationship), `sources` (array)
- [ ] `rankedProducts` array — each entry: `rank` (number), `product` (relationship → `pricing-data`), `ourScore` (number 0–5), `badge` (select), `positives` (textarea), `drawbacks` (textarea)
- [ ] `slug` auto-derived from `title` via `beforeValidate` hook if empty
- [ ] `publishedAt` auto-set when `status` → `published` (`beforeChange`)
- [ ] `afterChange` fires `triggerDeploy` when `status === 'published'`
- [ ] Access: public read; writes `({ req:{ user } }) => Boolean(user)` + `TODO(issue-6)` comment
- [ ] Editor can create/edit/publish a guide in admin UI
- [ ] `GET /api/buyer-guides?where[status][equals]=published&depth=2` resolves `rankedProducts[].product` to full `pricing-data` objects

### Astro template
- [ ] `web/src/pages/best/[slug].astro` with `getStaticPaths` pulling all published buyer guides
- [ ] Renders at `/best/{slug}`
- [ ] Page renders: breadcrumb, badge, H1, meta bar, **methodology box**, **numbered ranking list** (each entry: rank, product name, live price from `pricing-data`, score, badge, positives, drawbacks), rich-text body (what-to-look-for / common mistakes), FAQ accordion, disclosure, sources, sidebar (TOC + related guides)
- [ ] Ranked-product prices come from linked `pricing-data`, not hardcoded; entries sorted by `rank`
- [ ] `web/src/pages/best/index.astro` — lists published buyer guides; empty-state handled
- [ ] `web/src/lib/payload.ts` extended with `BuyerGuide` type + `getPublishedBuyerGuides()` + `getBuyerGuideBySlug()`
- [ ] Visually consistent with the Stitch buyer-guide design (`.stitch/designs/buyer-guide.png`) and the `web/` system
- [ ] `pnpm --filter web build` succeeds; route emitted
- [ ] Unknown `/best/x` slug → 404
- [ ] Header nav "Best Of" link active on these pages

## Field Specification — `buyer-guides`

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | text | yes | e.g. "Best Stove Top Protectors of 2026: Independently Tested" |
| `slug` | text | yes | unique, indexed; auto from `title` |
| `status` | select | yes | `draft` / `published`, default `draft` |
| `publishedAt` | date | no | auto-set on publish |
| `readTimeMinutes` | number | no | |
| `metaDescription` | textarea | yes | SEO meta |
| `methodology` | textarea | yes | The methodology box: "We tested X products over Y weeks…" |
| `rankedProducts` | array | no | The numbered ranking — sub-fields below |
| `rankedProducts[].rank` | number | yes | 1-based rank |
| `rankedProducts[].product` | relationship → `pricing-data` | yes | the ranked product |
| `rankedProducts[].ourScore` | number | yes | 0–5 |
| `rankedProducts[].badge` | select | no | `best-overall`, `best-for-gas`, `best-for-glass`, `best-budget`, `best-for-rv`, `none` |
| `rankedProducts[].positives` | textarea | yes | 1 paragraph — what it does well |
| `rankedProducts[].drawbacks` | textarea | yes | 1 paragraph — drawbacks |
| `body` | richText (Lexical) | yes | what-to-look-for + common-mistakes content |
| `faqs` | array | no | Each: `question`, `answer` |
| `relatedGuides` | relationship → `buyer-guides` | no | hasMany, self-referential |
| `sources` | array | no | Each: `label`, `url` |

## Hooks

- `beforeValidate` — derive `slug` from `title` (kebab-case) if empty
- `beforeChange` — set `publishedAt = now` when status flips to published
- `afterChange` — `triggerDeploy` when `status === 'published'`

(Same hook shapes as the other content collections. Keep `toKebabCase` duplicated — do not over-abstract.)

## Design Reference

- Stitch design: `.stitch/designs/buyer-guide.html` + `.png` — Designer downloads screen `8dcab7bcc12e41b69424d9481f31f46e` ("10 Best Stove Top Protectors (2026)") from project `6849064886324327137`
- Design tokens: `.stitch/DESIGN.md`
- Reuse `web/` visual language from Issues #3/#6/#4

## Technical Constraints

- Stack: Astro 6 SSG + Payload 3.84.1 + Postgres — established
- Reuse `BaseLayout`, `lexical.ts`, `payload.ts`, `global.css`, `triggerDeploy`
- Do not break `comparison-articles`, `review-articles`, `educational-guides`, `pricing-data`, `media`, or existing Astro pages
- `rankedProducts` is an array-of-objects with a nested `relationship` field — Payload supports this; resolves at `depth=2`
- Follow collection pattern from `ReviewArticles.ts`

## Dependencies Satisfied

- Issue #1 — Payload scaffold
- Issue #2 — `pricing-data` (relationship target for `rankedProducts[].product`)
- Issue #3 — Astro `web/` foundation
- Issues #6, #4 — content-template pattern well-established (this is the 4th content collection)
- Issue #8 — `media` collection

## Definition of Done

1. All acceptance criteria verified — collection CRUD, guide renders at `/best/[slug]`, ranked pricing pulled from `pricing-data`, methodology + rankings + body render, build succeeds
2. Postgres `buyer_guides` table exists with all fields/relations
3. Evaluator (Playwright) grades: Functionality ≥ 8, Design Fidelity ≥ 7, Data Integrity ≥ 9, Code Quality ≥ 7
4. No regression in completed issues
5. Clean commit — no secrets, no `web/dist/`
