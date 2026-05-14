# Build Contract: Issue #6 — Educational Guides

> Status: GitHub issues not filed. Contract sourced from `PRD.md`, `plans/stoveguard-site.md` (Phase 2), `stoveguard-us-com-blueprint.md` §5.4, and `.stitch/` designs.

## Scope

Two things:

1. **`educational-guides` Payload collection** — informational, non-commercial content (e.g. "Stove Protector Thickness Guide", "Is a Stove Protector Worth It?", "Stove Top Safety Guide"). Per plan: "rich text + structured fields" — the same structured-field pattern as `comparison-articles` **minus** the comparison-specific fields. No `pricing-data` references, no brand A/B, no comparison table.
2. **Astro template** at `/guides/[slug]` — renders a published educational guide. Reuses the `web/` foundation from Issue #3 (`BaseLayout`, Lexical→HTML converter, Payload REST client, design tokens).

Per PRD §"Educational Guides":
> Informational content (e.g., Thickness Guide, Safety Guide). Same structured fields as comparisons.

Per blueprint §5.4 (Question page template — the closest analog): H1 = the question/topic, a **direct 40–60 word answer up top** (snippet bait), longer explanation, honest counter-cases, FAQ, related content.

## Acceptance Criteria

### CMS — `educational-guides` collection
- [ ] `cms/src/collections/EducationalGuides.ts` exports `CollectionConfig` slug `educational-guides`, registered in `payload.config.ts`
- [ ] Postgres table created on startup (`educational_guides` + array tables)
- [ ] Fields (see Field Spec): `title`, `slug`, `status`, `publishedAt`, `readTimeMinutes`, `metaDescription`, `keyTakeaway`, `body` (richText), `faqs` (array), `relatedGuides` (self-relationship), `sources` (array)
- [ ] `slug` auto-derived from `title` via `beforeValidate` hook if empty (kebab-case)
- [ ] `publishedAt` auto-set when `status` → `published` (`beforeChange`)
- [ ] `afterChange` fires `triggerDeploy` when `status === 'published'` (reuse `cms/src/lib/triggerDeploy.ts`)
- [ ] Access: public read; writes `({ req:{ user } }) => Boolean(user)` + `TODO(issue-6)` comment — consistent with existing collections
- [ ] Editor can create/edit/publish a guide in admin UI
- [ ] `GET /api/educational-guides?where[status][equals]=published` returns published docs
- [ ] `relatedGuides` relationship resolves at `depth=1`

### Astro template
- [ ] `web/src/pages/guides/[slug].astro` with `getStaticPaths` pulling all published guides
- [ ] Renders at `/guides/{slug}`
- [ ] Page renders: breadcrumb, badge, H1, meta bar (updated date, read time), **key-takeaway box** (the snippet answer, visually distinct near the top), rich-text body, FAQ accordion, sources, sidebar (TOC + related guides)
- [ ] `web/src/pages/guides/index.astro` — lists published guides; empty-state handled
- [ ] `web/src/lib/payload.ts` extended with `EducationalGuide` type + `getPublishedEducationalGuides()` + `getEducationalGuideBySlug()`
- [ ] Implementation visually consistent with the Stitch educational-guide design (`.stitch/designs/educational-guide.png`) and the "Authoritative Editorial" system already in `web/`
- [ ] `pnpm --filter web build` succeeds; guide route emitted
- [ ] Unknown `/guides/x` slug → 404
- [ ] Header nav "Guides" link active on these pages

## Field Specification — `educational-guides`

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | text | yes | e.g. "Stove Protector Thickness Guide: How Thick Is Enough?" |
| `slug` | text | yes | unique, indexed; auto from `title` if empty |
| `status` | select | yes | `draft` / `published`, default `draft` |
| `publishedAt` | date | no | auto-set on publish |
| `readTimeMinutes` | number | no | |
| `metaDescription` | textarea | yes | SEO meta, ≤160 chars |
| `keyTakeaway` | textarea | yes | The 40–60 word direct answer / key takeaway shown in a callout box near the top (blueprint §5.4 "snippet bait") |
| `body` | richText (Lexical) | yes | Main guide content |
| `faqs` | array | no | Each: `question` (text), `answer` (textarea) |
| `relatedGuides` | relationship → `educational-guides` | no | hasMany, self-referential |
| `sources` | array | no | Each: `label` (text), `url` (text) |

## Hooks

- `beforeValidate` — derive `slug` from `title` (kebab-case) if empty
- `beforeChange` — set `publishedAt = now` when status flips to published and it's empty
- `afterChange` — `triggerDeploy` when `status === 'published'`

(Same shapes as `comparison-articles` — the kebab-case helper is small enough to keep duplicated per-collection; do not over-abstract.)

## Design Reference

- Stitch design: `.stitch/designs/educational-guide.html` + `.png` — Designer downloads the best of 3 existing variants ("Data Heavy", "Standard Layout", "Visual Focus") from project `6849064886324327137`
- Design tokens: `.stitch/DESIGN.md` ("The Authoritative Editorial")
- Reuse the visual language already implemented in `web/` from Issue #3

## Technical Constraints

- Stack: Astro 6 SSG + Payload 3.84.1 + Postgres — all established
- Reuse `web/src/layouts/BaseLayout.astro`, `web/src/lib/lexical.ts`, `web/src/lib/payload.ts`, `web/src/styles/global.css`
- Do not modify or break `comparison-articles`, `pricing-data`, `media`, or the existing Astro pages
- Follow the collection pattern from `ComparisonArticles.ts` (placeholder access, hook shapes)
- No `pricing-data` relationship — educational guides are non-commercial informational content

## Dependencies Satisfied

- Issue #1 — Payload scaffold
- Issue #2 — `pricing-data` + placeholder-access pattern
- Issue #3 — **Astro `web/` foundation**: BaseLayout, Lexical converter, Payload REST client, design tokens, `triggerDeploy` util. This is what makes #6 a small issue.
- Issue #8 — `media` collection (available for guide images if needed)

## Definition of Done

1. All acceptance criteria verified — collection CRUD, guide renders at `/guides/[slug]`, key-takeaway box present, build succeeds
2. Postgres `educational_guides` table exists
3. Evaluator (Playwright) grades: Functionality ≥ 8, Design Fidelity ≥ 7, Data Integrity ≥ 9, Code Quality ≥ 7
4. No regression — Issue #3 comparison template + Payload admin still work
5. Clean commit — no secrets, no `web/dist/`
