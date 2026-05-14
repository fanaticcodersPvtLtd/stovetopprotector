# Build Contract: Issue #11 — GA4 Tracking

> GitHub issue #11. `has_ui: false` — no Designer phase.

## Scope

Site-wide GA4 analytics with custom event tracking. Must **degrade gracefully** — if `GA4_MEASUREMENT_ID` is unset (current local/dev state), nothing renders and no script errors.

Per plan Phase 3:
> Integrate GA4 site-wide. Add ... GA4 outbound click event tracking. GA4 tracks page views, outbound clicks, scroll depth, and CTA engagement.

## Acceptance Criteria

- [ ] `web/.env.example` documents `GA4_MEASUREMENT_ID` (format `G-XXXXXXXXXX`); `web/.env` has the key present-but-empty
- [ ] `BaseLayout` renders the GA4 `gtag.js` snippet **only when `GA4_MEASUREMENT_ID` is set** — when unset, zero analytics markup, zero JS errors
- [ ] A client-side analytics script (`web/src/scripts/analytics.ts` or inline component) that, when GA4 is active, tracks:
  - **Outbound clicks** — any `<a>` whose href is external (different origin) fires a GA4 `outbound_click` event with the destination URL
  - **Scroll depth** — fires `scroll_depth` events at 25 / 50 / 75 / 100% milestones, each once per page
  - **CTA engagement** — clicks on elements marked `data-cta` fire a `cta_click` event with a label
- [ ] The tracking script is itself guarded — if `gtag` is not on `window`, every handler no-ops silently (so it's safe even if GA4 fails to load or is blocked)
- [ ] At least the primary CTAs in the content templates carry `data-cta="..."` attributes (the "See all comparisons" / hero CTAs) — minimal, not exhaustive
- [ ] `pnpm --filter web build` succeeds; with `GA4_MEASUREMENT_ID` empty, built pages contain **no** `googletagmanager.com` script and no analytics inline script
- [ ] No regression — all pages build, zero console errors
- [ ] Implementation note in the evaluation: how to activate (set the env var) and what events fire

## Technical Constraints

- Stack: Astro 6 SSG — established
- GA4 ID read via `import.meta.env.GA4_MEASUREMENT_ID` (consistent with how `seo.ts`/`payload.ts` read env)
- The gtag snippet is the standard Google one; the custom-event script is hand-written, small, dependency-free
- Outbound-click detection: compare link origin to `location.origin`
- Scroll-depth: `scroll` listener, throttled, milestones tracked in a `Set` so each fires once
- Do not break any template; `data-cta` is additive
- No analytics in dev when the var is empty — verified by build output

## Dependencies Satisfied

- Issue #3 — `BaseLayout`, `web/` foundation
- Issue #9 — homepage + all pages exist to instrument

## Definition of Done

1. All acceptance criteria verified — gtag conditional, custom-event script, graceful no-op confirmed in build output
2. Evaluator grades: Functionality ≥ 8, Design Fidelity = 10 (auto), Data Integrity ≥ 9, Code Quality ≥ 7
3. No regression
4. Clean commit — no secrets, no `web/dist/`
