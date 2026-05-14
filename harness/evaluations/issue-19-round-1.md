# Evaluation: Issue #19 — AdSense — Round 1

> Testing mode: `manual_degraded` — verified via build output with `ADSENSE_ENABLED` both false and true.

## Scores

| Criterion | Score | Threshold | Pass? |
|-----------|-------|-----------|-------|
| Functionality | 10/10 | 8 | YES |
| Design Fidelity | 10/10 | 7 | YES (auto — minimal functional component) |
| Data Integrity | 9/10 | 9 | YES |
| Code Quality | 9/10 | 7 | YES |

## Overall: PASS

## Findings

### Passing

- `web/src/components/AdSlot.astro` — renders the AdSense `<ins class="adsbygoogle">` unit + the `push({})` activation **only when** `ADSENSE_ENABLED === 'true'` AND `ADSENSE_PUBLISHER_ID` is set; otherwise renders an empty fragment — no placeholder box, no layout shift
- `slot` prop + optional `label` (the "Advertisement" disclosure AdSense policy requires)
- Responsive unit: `data-ad-format="auto"` + `data-full-width-responsive="true"` — CLS-friendly per blueprint §6.4
- `BaseLayout` loads the AdSense script (`pagead2.googlesyndication.com/.../adsbygoogle.js?client=...`, `async`, `crossorigin`) — **only when** enabled + publisher id present
- One `AdSlot` embedded per article template across all 5 types (`compare`, `reviews`, `guides`, `best`, `brands`), placed before the CTA — tasteful, one slot per long article per PRD ("without compromising editorial credibility")
- **Verified DISABLED build** (`ADSENSE_ENABLED=false`, current state): **0** `adsbygoogle` references, **0** `googlesyndication` scripts across the whole `dist/` — completely inert
- **Verified ENABLED build** (`ADSENSE_ENABLED=true ADSENSE_PUBLISHER_ID=ca-pub-...`): loader script present, 1 `<ins class="adsbygoogle">` unit per article with the correct `data-ad-client`
- Restored to disabled → 0 ad markup again — the flag flips cleanly both directions
- `web/.env` + `.env.example` document `ADSENSE_ENABLED` / `ADSENSE_PUBLISHER_ID`
- No regression — all 5 templates + the rest of the site build clean in both states

### Failing

None.

## Activation Notes

After Google AdSense **approves the site** (the 1–4 week external review — apply early):
1. Set `ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX` in `web/.env` (and the prod build env)
2. Set `ADSENSE_ENABLED=true`
3. Create real ad units in the AdSense dashboard and replace the placeholder `slot` ids (`1000000001`–`1000000005`) in the 5 templates
4. Rebuild — ads go live with no other code change

This is the **only credential-gated remainder** of the project. The component + wiring are complete; only the publisher id + approval (both external) are pending.

## Minor Notes (non-blocking)

- Data Integrity at threshold (9): no schema — flag-gated component, like #11 (GA4).
- Placeholder `slot` ids are intentional and documented — real ad-unit ids only exist post-approval.
- Per blueprint §6.4: no interstitials used, the single in-article slot sits below the fold — CWV-conscious.

## Feedback for Generator

No fixes required. Issue #19 passes round 1. **This is the final issue — all 19 are now complete.**
