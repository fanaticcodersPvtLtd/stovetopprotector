# Build Contract: Issue #7 — Brand Pages

> GitHub issue #7. Sourced from `PRD.md`, `plans/stoveguard-site.md` (Phase 2), `stoveguard-us-com-blueprint.md` §5.5, `.stitch/` designs.

## Scope

1. **`brand-pages` Payload collection** — structured data for each *appliance* brand (GE, Samsung, Frigidaire, etc. — the stove makers, NOT the protector brands). The frontend template auto-generates the page layout from this structured data.
2. **Astro template** at `/brands/[slug]` — renders a published brand page. Reuses the `web/` foundation.

Per PRD §"Brand Pages":
> Structured data for each appliance brand. Fields: brand name, popular stove model list (series name, type, burner count, size), protector comparison table (which protector brands serve this appliance, prices, specs), FAQ entries. The frontend template auto-generates page layout from this data.

Per blueprint §5.5 (stove-brand page template): H1, intro (what makes this brand's stoves tricky — sealed vs open burners, glass vs coil), top protector pick, alternatives, compatibility list, install tips, related content.

## Acceptance Criteria

### CMS — `brand-pages` collection
- [ ] `cms/src/collections/BrandPages.ts` exports `CollectionConfig` slug `brand-pages`, registered in `payload.config.ts`
- [ ] Postgres tables created on startup (`brand_pages` + array/rels tables)
- [ ] Fields (see Field Spec): `brandName`, `slug`, `status`, `publishedAt`, `metaDescription`, `intro`, `stoveModels` (array), `protectorOptions` (array w/ nested relationship to `pricing-data`), `body` (richText), `faqs` (array), `relatedBrands` (self-relationship), `sources` (array)
- [ ] `stoveModels` array — each: `seriesName` (text), `stoveType` (select: gas/electric/induction/glass-top), `burnerCount` (number), `sizeInches` (text)
- [ ] `protectorOptions` array — each: `product` (relationship → `pricing-data`), `compatibilityNote` (textarea)
- [ ] `slug` auto-derived from `brandName` via `beforeValidate` hook if empty
- [ ] `publishedAt` auto-set when `status` → `published` (`beforeChange`)
- [ ] `afterChange` fires `triggerDeploy` when `status === 'published'`
- [ ] Access: public read; writes `({ req:{ user } }) => Boolean(user)` + `TODO(issue-6)` comment
- [ ] URL fields (`sources[].url`) use `validateHttpUrl` from `cms/src/lib/validateUrl.ts`
- [ ] `slug` uses `toKebabCase` from `cms/src/lib/slug.ts`
- [ ] `GET /api/brand-pages?where[status][equals]=published&depth=2` resolves `protectorOptions[].product` to full `pricing-data` objects

### Astro template
- [ ] `web/src/pages/brands/[slug].astro` with `getStaticPaths` pulling all published brand pages
- [ ] Renders at `/brands/{slug}`
- [ ] Page renders: breadcrumb, badge, H1, meta bar, intro, **stove model list/table** (series, type, burner count, size), **protector comparison table** (protector product name, live price from `pricing-data`, compatibility note, visit-site link), rich-text body (install tips), FAQ accordion, sources, sidebar (TOC + related brands)
- [ ] Protector-table prices come from linked `pricing-data`, not hardcoded
- [ ] `web/src/pages/brands/index.astro` — lists published brand pages; empty-state handled
- [ ] `web/src/lib/payload.ts` extended with `BrandPage` type + `getPublishedBrandPages()` + `getBrandPageBySlug()`
- [ ] Visually consistent with the Stitch GE Brand Template design (`.stitch/designs/brand-page.png`) and the `web/` system
- [ ] `pnpm --filter web build` succeeds; route emitted
- [ ] Unknown `/brands/x` slug → 404 (`Astro.rewrite`)
- [ ] Header nav "By Brand" link active on these pages

## Field Specification — `brand-pages`

| Field | Type | Required | Notes |
|---|---|---|---|
| `brandName` | text | yes | Appliance brand, e.g. "GE", "Samsung", "Frigidaire" |
| `slug` | text | yes | unique, indexed; auto from `brandName` |
| `status` | select | yes | `draft` / `published`, default `draft` |
| `publishedAt` | date | no | auto-set on publish |
| `metaDescription` | textarea | yes | SEO meta |
| `intro` | textarea | yes | What makes this brand's stoves tricky for protectors |
| `stoveModels` | array | no | sub-fields below |
| `stoveModels[].seriesName` | text | yes | e.g. "GE Profile 30-inch" |
| `stoveModels[].stoveType` | select | yes | `gas`, `electric`, `induction`, `glass-top` |
| `stoveModels[].burnerCount` | number | no | |
| `stoveModels[].sizeInches` | text | no | e.g. "30" |
| `protectorOptions` | array | no | the protector comparison table |
| `protectorOptions[].product` | relationship → `pricing-data` | yes | the protector product |
| `protectorOptions[].compatibilityNote` | textarea | no | which models it fits / caveats |
| `body` | richText (Lexical) | yes | Install tips, deeper guidance |
| `faqs` | array | no | Each: `question`, `answer` |
| `relatedBrands` | relationship → `brand-pages` | no | hasMany, self-referential |
| `sources` | array | no | Each: `label`, `url` (validated) |

## Hooks

- `beforeValidate` — derive `slug` from `brandName` (kebab-case) if empty
- `beforeChange` — set `publishedAt = now` when status flips to published
- `afterChange` — `triggerDeploy` when `status === 'published'`

## Design Reference

- Stitch design: `.stitch/designs/brand-page.html` + `.png` — Designer picks the best of 3 "GE Brand Template" variants (`f1f2cd4f...` Visual Analysis, `070cea40...` High Contrast, `f84ecb4d...` Editorial) from project `6849064886324327137`
- Design tokens: `.stitch/DESIGN.md`
- Reuse `web/` visual language from Issues #3/#4/#5/#6

## Technical Constraints

- Stack: Astro 6 SSG + Payload 3.84.1 + Postgres — established
- Reuse `BaseLayout`, `lexical.ts`, `payload.ts`, `global.css`, `triggerDeploy`, `slug.ts`, `validateUrl.ts`
- Do not break completed collections or Astro pages
- `protectorOptions` is an array-of-objects with a nested `relationship` — same proven pattern as `buyer-guides.rankedProducts`
- Follow collection pattern from `BuyerGuides.ts`

## Dependencies Satisfied

- Issue #1 — Payload scaffold
- Issue #2 — `pricing-data` (relationship target for `protectorOptions[].product`)
- Issue #3 — Astro `web/` foundation
- Issues #6/#4/#5 — content-template pattern + shared libs (`slug.ts`, `validateUrl.ts`) well-established
- Issue #8 — `media` collection

## Definition of Done

1. All acceptance criteria verified — collection CRUD, brand page renders at `/brands/[slug]`, stove model list + protector table render, protector prices from `pricing-data`, build succeeds
2. Postgres `brand_pages` table exists with all fields/relations
3. Evaluator (Playwright) grades: Functionality ≥ 8, Design Fidelity ≥ 7, Data Integrity ≥ 9, Code Quality ≥ 7
4. No regression in completed issues
5. Clean commit — no secrets, no `web/dist/`
