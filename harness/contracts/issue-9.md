# Build Contract: Issue #9 — Homepage & Navigation

> GitHub issue #9. Sourced from `PRD.md`, `plans/stoveguard-site.md` (Phase 3), `stoveguard-us-com-blueprint.md` §3/§4, `.stitch/` designs.

## Scope

1. **Real homepage** at `/` — replaces the current minimal placeholder. Featured content + category navigation + recent articles across all 5 content types.
2. **Site-wide navigation** — header + footer already exist in `BaseLayout` from Issue #3; this issue makes the footer/nav links resolve to real index pages and ensures every content category is reachable.
3. **Internal linking** — homepage links out to each content silo (comparisons, reviews, best, guides, brands).

Per plan Phase 3:
> Build the homepage at / with featured content, category navigation, and recent articles. Add site-wide navigation (header and footer) with links to all content categories.

Per blueprint §4.4:
> Homepage links out — to each silo hub, not buried deep pages.

## Acceptance Criteria

- [ ] `web/src/pages/index.astro` rebuilt as a full homepage (not the placeholder list)
- [ ] Homepage pulls from **all 5 content collections** — comparison-articles, review-articles, buyer-guides, educational-guides, brand-pages
- [ ] Hero section with site value proposition (independent, no affiliate links)
- [ ] **Category navigation block** — visible cards/links to all 5 silos (`/compare`, `/reviews`, `/best`, `/guides`, `/brands`)
- [ ] **Featured / recent content sections** — recent comparison articles, recent reviews, recent guides; each links to its detail page; each section links to its index
- [ ] Empty-state handled per section (if a collection has no published docs, that section degrades gracefully — no crash, no empty shell)
- [ ] `web/src/lib/payload.ts` extended with a homepage data helper (e.g. `getHomepageContent()`) that fetches recent published docs from each collection with sensible limits
- [ ] Header nav already has all 6 links (Home/Comparisons/Reviews/Best Of/Guides/By Brand) — verify each resolves to a real page (200), no dead links in the primary nav
- [ ] Footer links (Privacy/Terms/Contact/About/All Brands) — `/brands` resolves; the legal pages (`/privacy`, `/terms`, `/contact`, `/about`) may 404 for now (those screens exist in Stitch but are out of #9 scope) — **do not** add fake legal pages; instead point footer "All Brands" to `/brands` which works, and leave legal links as known-pending (note in evaluation)
- [ ] Homepage visually consistent with the Stitch homepage design (`.stitch/designs/homepage.png`) and the "Authoritative Editorial" system
- [ ] `pnpm --filter web build` succeeds; `/` emits with real content
- [ ] Playwright: homepage renders all sections, category nav links work, zero console errors
- [ ] No regression — all 5 content templates + their index pages still build and render

## Design Reference

- Stitch design: `.stitch/designs/homepage.html` + `.png` — Designer picks the better of 2 homepage variants (`96294f89...`, `f9114e05...`) from project `6849064886324327137`
- Design tokens: `.stitch/DESIGN.md`
- Reuse the `web/` visual language and `BaseLayout`

## Technical Constraints

- Stack: Astro 6 SSG + Payload 3.84.1 — established
- Reuse `BaseLayout`, `payload.ts`, `global.css`
- Homepage fetches at build time only (SSG)
- Do not modify content collections or their detail/index templates
- Do not break any of the 5 content templates
- `getHomepageContent()` should be resilient — if one collection fetch returns empty, the others still render

## Dependencies Satisfied

- Issue #3 — Astro `web/` foundation, `BaseLayout` with header/footer, comparison template + index
- Issues #4, #5, #6, #7 — review/buyer/educational/brand collections + templates + index pages (all 5 silos exist to link to)
- Issue #2 — pricing-data (already feeding the content)

## Definition of Done

1. All acceptance criteria verified — homepage renders all content sections, category nav works, build succeeds
2. Evaluator (Playwright) grades: Functionality ≥ 8, Design Fidelity ≥ 7, Data Integrity ≥ 9, Code Quality ≥ 7
3. No regression in completed issues
4. Clean commit — no secrets, no `web/dist/`
