# Build Contract: Issue #2 — Pricing Data Collection

> Status: GitHub issues not filed in `fanaticcodersPvtLtd/stovetopprotector`. Contract sourced from `PRD.md`, `plans/stoveguard-site.md`, and `stoveguard-us-com-blueprint.md` instead of `gh issue view`. File issues retroactively via `prd-to-issues` skill.

## Scope

Build the shared `pricing-data` Payload collection. This is the single source of truth for every product price displayed across the site. Every other content type (comparison-articles, review-articles, buyer-guides, brand-pages) references this collection by relationship. One update propagates everywhere on next build.

Per PRD §"Pricing Data":
> Shared collection. All brand pricing maintained in one place and referenced across all content types. Single update propagates everywhere on next build.

Per blueprint §5.1 (Brand review page template):
> Product lineup — table of Lite vs Premium vs Pro vs Grip, with price, thickness, warranty, heat rating

Per PRD constraint:
> No affiliate links. Revenue comes from AdSense display ads.

Therefore `productUrl` must be the brand's own canonical site, never an affiliate redirect.

## Acceptance Criteria

- [ ] `cms/src/collections/PricingData.ts` exists, exports a `CollectionConfig` with slug `pricing-data`
- [ ] Collection registered in `cms/src/payload.config.ts` `collections` array
- [ ] Postgres table `pricing_data` (snake-cased by adapter) created automatically on Payload startup
- [ ] Admin panel at http://localhost:3001/admin/collections/pricing-data is reachable (200, lists empty collection initially)
- [ ] Editor can create a pricing entry via admin UI with all required fields and save successfully
- [ ] Editor can edit and delete pricing entries
- [ ] Required fields enforce validation (cannot save without `brand`, `productName`, `priceUsd`, `productUrl`, `lastVerifiedAt`)
- [ ] `priceUsd` accepts decimals (e.g. 29.99) and rejects negatives
- [ ] `productUrl` validates as URL format
- [ ] `lastVerifiedAt` defaults to current date on create
- [ ] REST API `GET http://localhost:3001/api/pricing-data` returns the collection (200 + JSON)
- [ ] REST API `GET http://localhost:3001/api/pricing-data/:id` returns a single entry
- [ ] Access control: any authenticated user can read; only `cms-admins` (or super-admin role) can create/update/delete. Since `cms-admins` collection does not yet exist (Issue #1 only created the template `users` collection), use placeholder access `({ req: { user } }) => !!user` for write ops, with a TODO comment to tighten in Issue #6 (cms-admins).
- [ ] `payload-types.ts` regenerated and contains `PricingDatum` (Payload pluralization) or equivalent type export
- [ ] Server starts cleanly: no console errors, no migration warnings beyond schema-sync notice

## Field Specification

| Field | Type | Required | Notes |
|---|---|---|---|
| `brand` | text | yes | Display name e.g. "StoveGuard", "Stove Shield" |
| `brandSlug` | text | yes | URL-safe, lowercased; unique constraint; auto-derived hook fills if empty |
| `productName` | text | yes | e.g. "StoveGuard Premium" |
| `productLine` | select | no | Options: `lite`, `premium`, `pro`, `grip`, `standard`, `other`. Per blueprint §5.1 |
| `priceUsd` | number | yes | Min 0, decimals allowed |
| `currency` | select | yes | Options: `USD`. Single value for now (US-only per PRD), but schema future-proof |
| `productUrl` | text | yes | Brand's official site URL. Validation: starts with `https://`. **Must not contain `?ref=`, `?tag=`, `aff_`, `utm_`** — hook strips these |
| `specs` | group | no | Sub-fields below |
| `specs.thicknessMm` | number | no | Material thickness, mm |
| `specs.materialType` | select | no | `silicone`, `fiberglass-coated-silicone`, `aluminized-steel`, `other` |
| `specs.heatRatingFahrenheit` | number | no | Max temp |
| `specs.warrantyMonths` | number | no | 0–120 |
| `specs.dimensionsInches` | text | no | Free-form e.g. `28 x 20` |
| `inStock` | checkbox | yes | Default `true` |
| `lastVerifiedAt` | date | yes | Default = now. Editors update on each manual price re-check |
| `notes` | textarea | no | Optional editor-only note (not shown publicly) |

## Hooks

- `beforeValidate` — auto-generate `brandSlug` from `brand` if empty (kebab-case, ASCII-only)
- `beforeChange` — strip tracking query params from `productUrl` (regex remove `ref`, `tag`, `aff_*`, `utm_*`)
- `afterChange` — log only (deploy hook trigger deferred to Issue #3 when Cloudflare wiring lands)

## Access Control (placeholder for #2; tightened in #6)

```ts
access: {
  read: () => true,                                  // public read for SSG fetch
  create: ({ req: { user } }) => !!user,             // any logged-in user (will become role-gated in #6)
  update: ({ req: { user } }) => !!user,
  delete: ({ req: { user } }) => !!user,
}
```

## Design Reference

N/A — `has_ui: false`. No Stitch design required. Admin panel UI is provided by Payload itself.

## Technical Constraints

- Stack: Payload CMS 3.84.1 + Postgres 16 + Next.js 16 (already established by Issue #1)
- Follow Payload 3 collection patterns: `CollectionConfig` from `payload` import, TypeScript-first
- Hooks must be pure functions, no external API calls
- Do not modify `Users.ts` or `Media.ts` (Issue #1 scope; will be revisited in #6 and #8 respectively)
- Generator must restart the dev server after wiring and confirm logs are clean

## Dependencies Satisfied

- Issue #1 (Payload CMS scaffold) — provides: Postgres connection, payload.config.ts, working admin at :3001, Users + Media collections, dev server, pnpm workspace

## Definition of Done

1. All acceptance criteria checked off via manual test through admin UI + REST API
2. Postgres `pricing_data` table exists (verify: `docker exec stoveguard-postgres psql -U stoveguard -d stoveguard -c "\dt"`)
3. Evaluator grades:
   - Functionality ≥ 8/10
   - Data Integrity ≥ 9/10
   - Code Quality ≥ 7/10
   - Design Fidelity = 10/10 (auto, no UI)
4. No regression in Issue #1 — admin still loads, Users/Media collections still work
5. Commit follows convention; no secrets staged
