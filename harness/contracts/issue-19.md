# Build Contract: Issue #19 — AdSense

> GitHub issue #19. Sourced from `PRD.md`, `stoveguard-us-com-blueprint.md` §6.4.

## Scope

Google AdSense display-ad slots integrated into the article templates. The site's only revenue source (no affiliates). Per PRD: ads must be "integrated into article design without compromising editorial credibility" — tasteful placement, not aggressive.

**Credential-gated, built behind a flag:** the ad-slot components are fully built now; they render the real AdSense markup **only when `ADSENSE_ENABLED=true` AND `ADSENSE_PUBLISHER_ID` is set**. Until AdSense approval comes through (1–4 week external process), `ADSENSE_ENABLED=false` and slots render nothing — zero layout shift, zero broken markup. Flipping the flag + adding the publisher ID activates ads with no code change.

## Acceptance Criteria

- [ ] `web/src/components/AdSlot.astro` — renders a Google AdSense `<ins class="adsbygoogle">` unit + the `(adsbygoogle = window.adsbygoogle || []).push({})` activation, **only when** `ADSENSE_ENABLED === 'true'` and `ADSENSE_PUBLISHER_ID` is set. Otherwise renders nothing (an empty fragment) — no placeholder box, no layout shift.
- [ ] Accepts a `slot` prop (the AdSense ad-unit slot id) and an optional `label` for the small "Advertisement" disclosure text required by AdSense policy
- [ ] `BaseLayout` includes the AdSense loader script (`pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=...`) in `<head>` — **only when** AdSense is enabled + the publisher id is set; `async`, `crossorigin`
- [ ] `ADSENSE_ENABLED` + `ADSENSE_PUBLISHER_ID` read via `import.meta.env`; documented in `web/.env.example` (and `web/.env` has them present, `ADSENSE_ENABLED=false`)
- [ ] Ad slots embedded **tastefully** in the article templates — per PRD "without compromising editorial credibility": at most ~2 slots per long article (e.g. one mid-content, one after the article body / before sources). NOT in the hero, NOT between every paragraph. Applied to `comparison-articles`, `review-articles`, `buyer-guides`, `educational-guides`, `brand-pages`.
- [ ] When disabled (current state): built pages contain **no** `adsbygoogle` markup and **no** `googlesyndication` script — verified
- [ ] When enabled (simulated build with the env vars): built pages contain the loader script + the `<ins>` units with the correct `data-ad-client` / `data-ad-slot`
- [ ] `pnpm --filter web build` succeeds in both states
- [ ] No regression in the 18 completed issues; no layout shift introduced when ads are off

## Technical Constraints

- Stack: Astro 6 SSG — established
- AdSense env vars exposed to client build via `import.meta.env` (the loader + `<ins>` are client-side markup)
- The `<ins>` ad units must have explicit dimensions or `data-ad-format="auto"` + `data-full-width-responsive` to avoid CLS — follow AdSense responsive-unit guidance
- Slot ids are placeholders (e.g. `0000000000`) until real ad units are created in the AdSense dashboard post-approval — documented
- Do not break any template; `AdSlot` renders nothing when disabled, so embedding it is always safe
- Per blueprint §6.4: no full-screen interstitials, lazy-load below-the-fold — keep ad placement CWV-friendly

## Dependencies Satisfied

- Issue #9 — homepage + article templates exist
- Issues #3–#7 — the 5 content templates to place slots into
- Issue #11 — established the `import.meta.env` flag-gating pattern (GA4) that AdSlot mirrors

## Definition of Done

1. `AdSlot.astro` built — renders real AdSense markup only when enabled, nothing when disabled
2. Loader script conditional in `BaseLayout`
3. Slots embedded tastefully (≤2 per article) across all 5 article templates
4. Verified: disabled build = zero ad markup; enabled build = correct loader + `<ins>` units
5. Evaluator grades: Functionality ≥ 8, Design Fidelity = 10 (auto — slots are functional, minimal visual), Data Integrity ≥ 9, Code Quality ≥ 7
6. No regression
7. Clean commit — no secrets
8. Evaluation notes: activation = set `ADSENSE_PUBLISHER_ID` + `ADSENSE_ENABLED=true` after AdSense approval, replace placeholder slot ids
