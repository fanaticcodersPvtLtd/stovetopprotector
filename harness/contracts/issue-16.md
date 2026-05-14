# Build Contract: Issue #16 — Interactive Comparison Tool

> GitHub issue #16. Sourced from `PRD.md`, `plans/stoveguard-site.md`, `.stitch/` designs.

## Scope

A client-side interactive tool: the visitor picks two protector products, gets a dynamic side-by-side comparison built from `pricing-data` (price + specs) — generated in the browser, no server round-trip.

Per PRD §"Interactive Comparison Tool":
> Visitors pick two brands and get a dynamic side-by-side comparison generated from pricing and specs data in real time.

**Route:** `/compare/tool` — a static route, which Astro resolves ahead of the dynamic `/compare/[slug]` (so no collision with comparison-articles). Linked from the `/compare` index page.

## Acceptance Criteria

- [ ] `web/src/pages/compare/tool.astro` — the tool page, renders at `/compare/tool`
- [ ] At **build time**, all published `pricing-data` entries are fetched and embedded into the page as a JSON island (e.g. a `<script type="application/json">` or `define:vars`) — the tool works fully client-side, no runtime API calls
- [ ] Two `<select>` dropdowns, each listing all products (`{brand} {productName}`)
- [ ] On selection change, a side-by-side comparison table renders: price, product line, in-stock, thickness, material, heat rating, warranty, dimensions — every `pricing-data` spec field
- [ ] Each side shows a "Visit official site" link to the product's `productUrl`
- [ ] Sensible default state: either pre-select the first two products, or show a clear "pick two products" empty state
- [ ] Same-product guard: if both selects point at the same product, show a gentle "pick two different products" note rather than a mirror table
- [ ] Client script is dependency-free, typed where it's a `.ts`, guarded against missing elements
- [ ] `web/src/pages/compare/index.astro` gets a visible link/CTA to `/compare/tool`
- [ ] `web/src/lib/payload.ts` — reuse existing `getPricingData`-style fetch, or add `getAllPricingData()` if none exists (there isn't a bare "all pricing" fetch yet — add one)
- [ ] Page uses `BaseLayout`, "Authoritative Editorial" styling, `activeNav="comparisons"`
- [ ] Empty-state: if fewer than 2 pricing-data entries exist, the page explains the tool needs more data rather than rendering broken selects
- [ ] `pnpm --filter web build` succeeds; `/compare/tool` emitted; `/compare/[slug]` articles still build (no route collision)
- [ ] Playwright: select two products → side-by-side table renders with correct prices/specs; zero console errors

## Design Reference

- Stitch design: `.stitch/designs/comparison-tool.html` + `.png` — Designer picks the better of 2 "Interactive Comparison Tool" variants (`c17c7935...`, `0317056...`) from project `6849064886324327137`
- Design tokens: `.stitch/DESIGN.md`
- Reuse the `web/` visual language

## Technical Constraints

- Stack: Astro 6 SSG — established. The tool is the first genuinely interactive (client-JS) page — keep the JS small, vanilla, typed
- Build-time data embed: serialize pricing-data to JSON safely (escape `<`)
- No new CMS work — `pricing-data` already has every field the tool needs
- Static route `compare/tool.astro` must not break dynamic `compare/[slug].astro` — verify both build
- Do not modify `pricing-data` collection or other templates

## Dependencies Satisfied

- Issue #2 — `pricing-data` collection (the data source — brand, productName, priceUsd, productLine, inStock, specs.*, productUrl)
- Issue #3 — Astro `web/` foundation, `BaseLayout`, `/compare` index
- Issue #9 — homepage links into `/compare`

## Definition of Done

1. All acceptance criteria verified — tool renders, two-product pick produces a correct side-by-side, build clean, no route collision
2. Evaluator (Playwright) grades: Functionality ≥ 8, Design Fidelity ≥ 7, Data Integrity ≥ 9, Code Quality ≥ 7
3. No regression in completed issues
4. Clean commit — no secrets, no `web/dist/`
