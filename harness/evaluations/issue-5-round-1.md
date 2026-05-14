# Evaluation: Issue #5 — Round 1

> Testing mode: `playwright` — verified via Playwright (Chromium headless) screenshots + assertions, REST/Postgres introspection, and a regression sweep across all 5 prior page types.

## Scores

| Criterion | Score | Threshold | Pass? |
|-----------|-------|-----------|-------|
| Functionality | 10/10 | 8 | YES |
| Design Fidelity | 9/10 | 7 | YES |
| Data Integrity | 10/10 | 9 | YES |
| Code Quality | 9/10 | 7 | YES |

## Overall: PASS

## Findings

### Passing

**Functionality — all acceptance criteria verified:**
- `BuyerGuides.ts` exports `CollectionConfig` slug `buyer-guides`, registered in `payload.config.ts`
- Postgres tables created: `buyer_guides` + `_faqs`, `_ranked_products`, `_rels`, `_sources`
- Create via REST works (201); `slug` auto-derived from `title`; `publishedAt` auto-set on publish
- `rankedProducts` array-of-objects with nested `relationship` field works — `GET ...&depth=2` resolves `rankedProducts[].product` to full `pricing-data` docs
- `web/src/pages/best/[slug].astro` with `getStaticPaths` — renders at `/best/best-stove-top-protectors-of-2026-independently-tested`
- Playwright confirmed: H1, "HOW WE TESTED" methodology box, numbered ranking list (2 entries: rank badge, brand+product, score, best-overall/best-budget badges, positives/drawbacks, price, visit-site link), rich-text body, FAQ accordion, disclosure, sidebar TOC + "Our Top Pick"
- **Ranked-product prices come from linked `pricing-data`** — `$42.50` / `$44.95` (the live propagated prices), entries sorted by `rank` ascending defensively in the template
- `web/src/pages/best/index.astro` lists published guides; "Best Of" nav active state confirmed
- `web/src/lib/payload.ts` extended with `BuyerGuide` + `RankedProduct` types + 2 fetch fns
- `pnpm --filter web build` clean — `/best/[slug]` + `/best` emitted

**Design Fidelity (9/10):**
- Live `/best/[slug]` matches `.stitch/designs/buyer-guide.png`: breadcrumb, badge, serif H1, meta bar, methodology box, numbered ranking cards with score + badge, body, FAQ, dark CTA, sticky TOC + Top Pick sidebar
- Consistent with the "Authoritative Editorial" system across all 5 page types now
- Playwright: zero console errors, zero failed requests

**Data Integrity (10/10):**
- All fields/types correct; `slug` UNIQUE index
- `_ranked_products` array table backs the nested ranking; `_rels` backs `rankedProducts[].product` (→ pricing-data) and `relatedGuides` (self-ref)
- `rankedProducts[].product` resolves at `depth=2`
- Lexical→HTML converter renders heading + paragraph without dropping content

**Code Quality (9/10):**
- Fully typed; `BuyerGuide` / `RankedProduct` mirror the collection
- **Uses the new shared libs** introduced by the code-review remediation: `toKebabCase` from `cms/src/lib/slug.ts`, `validateHttpUrl` from `cms/src/lib/validateUrl.ts` (so `sources[].url` is scheme-validated from the start — no XSS gap)
- Template sorts `rankedProducts` by `rank` defensively rather than trusting API order
- Reuses `triggerDeploy`, `BaseLayout`, `lexical.ts`, `payload.ts` — no infra duplication
- No dead code, no secrets staged

### Failing

None.

## Independent Code Review (the "codex review" layer)

Before Issue #5 was built, an independent **Code Reviewer agent** audited the 6 prior completed issues (#1, #2, #8, #3, #6, #4) — separate from this harness Evaluator. It found:

- **2 BLOCKERS** — `web/src/lib/lexical.ts`: (1) `javascript:` URL XSS in link nodes, (2) `escapeHtml` didn't escape quotes → attribute breakout
- **1 critical SHOULD-FIX** — same XSS class: `sourceUrl` / `sources[].url` fields had no scheme validation

All three were **fixed before Issue #5**:
- `lexical.ts` — `escapeHtml` now escapes `"`/`'`; new `safeHref()` allow-lists `https?:`/`mailto:`/`tel:`/`/`/`#` schemes
- New `cms/src/lib/validateUrl.ts` — `validateHttpUrl` / `validateOptionalHttpUrl`, applied to `productUrl`, `comparisonRows[].sourceUrl`, and `sources[].url` across all collections
- Verified: a `javascript:alert(1)` source URL is now rejected at the API (`"field is invalid: Sources 1 > Url"`)

Also applied from the review (cheap wins): `Astro.redirect('/404')` → `Astro.rewrite('/404')` (correct for static builds), star-rating rounds to nearest half, `404.astro` carries `noindex`, `toKebabCase` extracted to `cms/src/lib/slug.ts` (was duplicated 4×).

**Deferred** (logged, lower priority — for a later cleanup issue): deploy-hook debounce / `previousDoc` gating (#6/#7), importing generated `payload-types.ts` instead of hand-mirrored types (#12), `depth` query trimming (#13).

Regression sweep after the fixes: all 5 page types (`/`, `/compare/[slug]`, `/reviews/[slug]`, `/guides/[slug]`, `/best/[slug]`) build clean and render with zero console errors.

## Feedback for Generator

No fixes required. Issue #5 passes round 1. Close and advance to Issue #7 (Brand Pages) per execution order.
