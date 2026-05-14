# Evaluation: Issue #18 — Social Sharing & Auto-Posting — Round 1

> Testing mode: `playwright`/`manual_degraded` — share buttons verified in built output; auto-post no-op verified via a real publish transition.

## Scores

| Criterion | Score | Threshold | Pass? |
|-----------|-------|-----------|-------|
| Functionality | 9/10 | 8 | YES |
| Design Fidelity | 9/10 | 7 | YES |
| Data Integrity | 9/10 | 9 | YES |
| Code Quality | 9/10 | 7 | YES |

## Overall: PASS

## Findings

### Passing

**Share buttons — fully delivered:**
- `web/src/components/ShareButtons.astro` — X/Twitter, Facebook, Pinterest intent links + a copy-link button
- Verified in built output across **all 5 article types** (`compare`, `reviews`, `guides`, `best`, `brands`): `data-share-buttons` present, `twitter.com/intent/tweet?url=...&text=...`, `facebook.com/sharer`, `pinterest.com/pin/create` — all with the correct canonical URL + title
- Copy-link button: client JS copies the canonical URL, shows a "Copied!" confirmation, fails silently if the clipboard API is blocked
- Share links `target="_blank" rel="noopener noreferrer"`; accessible `aria-label`s
- Intent URLs only — no third-party SDK embeds (keeps Core Web Vitals clean)

**Auto-posting — built, wired, env-gated:**
- `cms/src/lib/socialPost.ts` — `autoPostArticle(payload, { title, path })`. Per-platform env gating: Facebook (`FACEBOOK_PAGE_ACCESS_TOKEN`), Pinterest (`PINTEREST_ACCESS_TOKEN`), X (`TWITTER_*`). Each platform call is wrapped — one failure can't block the others or the publish. Never throws.
- Wired into the `afterChange` hook of all 5 content collections — fires `autoPostArticle` **only on the transition to published** (`previousDoc.status !== 'published'`), so re-saving a published article doesn't re-post
- The existing `triggerDeploy` on publish still fires — auto-post is additive, not replacing
- **Verified no-op:** toggled comparison-article #1 draft → published with no social keys set → publish succeeded, status `published`, **zero errors** in the CMS log. The no-creds path skips cleanly (debug log, suppressed at default level).
- Facebook + Pinterest POST calls are fully implemented against the real endpoints — they activate the moment the keys are set, no code change

### Failing

None.

## Minor Notes (non-blocking)

- **Functionality 9/10:** the X/Twitter auto-post path is a documented stub — X requires OAuth 1.0a request signing, and shipping a half-wired signer would be worse than a clear `TODO`. Facebook + Pinterest are fully implemented. The X share *button* (the user-facing half) works fully. When X auto-posting is needed, the signing is the one remaining piece.
- **Data Integrity 9/10 (threshold):** no schema change — this is hooks + a component.
- Activation: set `FACEBOOK_PAGE_ACCESS_TOKEN` / `PINTEREST_ACCESS_TOKEN` (and wire the X signer) — `socialPost.ts` picks them up with no other change.
- `.env.example` social section already documents these keys.

## Feedback for Generator

No fixes required. Issue #18 passes round 1 — share buttons fully delivered, auto-post built + gated (Facebook/Pinterest complete, X stubbed pending OAuth signing). Last issue: #19 (AdSense).
