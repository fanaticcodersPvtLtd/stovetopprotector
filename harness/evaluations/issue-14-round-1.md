# Evaluation: Issue #14 — Round 1

> Testing mode: `playwright` — auth-gated profile + submission history verified in the browser.

## Scores

| Criterion | Score | Threshold | Pass? |
|-----------|-------|-----------|-------|
| Functionality | 10/10 | 8 | YES |
| Design Fidelity | 9/10 | 7 | YES |
| Data Integrity | 9/10 | 9 | YES |
| Code Quality | 9/10 | 7 | YES |

## Overall: PASS

## Findings

### Passing

- `web/src/pages/profile.astro` renders at `/profile`, `noindex`, ships an empty shell filled client-side
- **Auth-gated, no flash of private content** — Playwright (logged-out) → "Please log in" state with a `/login` link; the shell never shows submission data before the `/api/users/me` check resolves
- **Logged-in** — Playwright confirmed: `displayName` ("Profile Tester") + email header, "Log out" button
- **Submission history** — fetched the visitor's own `visitor-reviews` (`?where[author][equals]=<me>` with the session); rendered 3 cards
- **Status badges** — Playwright found all three: `pending` (neutral), `rejected` (red), `approved` (green)
- **Rejection reason** — the rejected submission shows its `rejectionReason` in a highlighted block ("Off-topic — please review the product…")
- Each card shows star rating, body, target (`comparison-articles #1`), and `submittedAt` date
- `web/src/scripts/profile.ts` — reuses `auth.ts` `getCurrentVisitor()` + `logout()`; every fetch guarded; `esc()` on all interpolated user content
- Header nav "Profile Tester" link (from #12's `auth.ts`) lands here
- Build clean; `/profile` emits; zero console errors

**Design Fidelity (9/10):** matches `.stitch/designs/profile.png` — account header, "Your Submissions" list, status-badged cards. Consistent with the "Authoritative Editorial" system.

**Data Integrity (9/10):** relies on #13's `visitor-reviews` self-read access — a visitor sees their own `pending`/`rejected` docs (which the public cannot). Verified the profile fetch returns all three statuses. Scored at threshold — no new schema, it's a read-only view over #13's data.

**Code Quality (9/10):** fully client-rendered (correct for auth on SSG); reuses the auth helper module; status-badge map is a clean lookup; user content escaped before injection.

### Failing

None.

## Minor Notes (non-blocking)

- The submission card shows the target as `comparison-articles #1` (relationTo + id) rather than the article's title — resolving the title would need a second fetch per target or a denormalized title on the review. Acceptable for a profile history view; a polish follow-up could denormalize `targetTitle` like `authorName` was in #13.
- No "edit display name" affordance — PRD only specifies *viewing* the profile + history; editing is not in scope.
- curl cookie testing skipped per the known Payload+curl quirk; the real-browser flow (login → redirect to `/profile` → history renders) was Playwright-verified end to end.

## Feedback for Generator

No fixes required. Issue #14 passes round 1. The visitor account loop (#12 → #13 → #14) is complete. Remaining: #15 (Email — Resend), #17 (Newsletter — depends #15), #18 (Social — share buttons buildable, auto-post needs keys), #19 (AdSense — components buildable behind flag). Next per execution_order: #15.
