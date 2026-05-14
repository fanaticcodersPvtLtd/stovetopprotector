# Evaluation: Issue #13 — Round 1

> Testing mode: `playwright` — submission + moderation + render verified via REST/DB and the browser.

## Scores

| Criterion | Score | Threshold | Pass? |
|-----------|-------|-----------|-------|
| Functionality | 10/10 | 8 | YES |
| Design Fidelity | 8/10 | 7 | YES |
| Data Integrity | 10/10 | 9 | YES |
| Code Quality | 9/10 | 7 | YES |

## Overall: PASS

## Findings

### Passing

**CMS — `visitor-reviews` collection:**
- Registered; Postgres `visitor_reviews` + `_rels` tables created
- Fields: `body`, `rating` (1–5), `author` (→ users), `authorName` (denormalized), `target` (polymorphic → 5 content collections), `status`, `rejectionReason` (conditional), `submittedAt`
- **Security — server-enforced, verified:** submitted a review with a spoofed `author: 999` + `status: "approved"` payload → Payload stored `author: 5` (the real authenticated visitor) and `status: "pending"`. The client cannot forge authorship or self-approve.
- `authorName` denormalized in `beforeChange` from `req.user.displayName` — the `users` collection isn't publicly readable, so this is how the SSG build shows reviewer names without exposing user records
- Access control verified:
  - unauthenticated create → 403
  - public read → only `approved` (pending review not visible)
  - cms-admin PATCH `status: approved` → succeeds
- `afterChange` fires `triggerDeploy` on approval (+ a documented `TODO(issue-15)` hook point for the approval email)

**Frontend — `ReviewSection.astro`, Playwright-verified:**
- Embedded in `comparison-articles`, `review-articles`, `brand-pages` templates
- Approved reviews render at build time — "Jane Reviewer" review visible on `/compare/stoveguard-vs-stove-shield` with stars + body + date + aggregate
- **Logged-out** → "Log in to write a review" prompt, no form
- **Logged-in** → submission form with rating select + body textarea
- `web/src/scripts/reviewForm.ts` — auth-gated, posts with `credentials: 'include'`, server-enforces target only (author/status come from the session)
- `getApprovedReviewsFor()` helper uses the polymorphic `target.relationTo` + `target.value` query; `depth=0` (authorName is denormalized, no relationship resolution needed)
- Zero console errors

**Data Integrity (10/10):** polymorphic relationship works; author/status forge-proof; access constraints enforced at every level (create/read/update); approved-only public visibility confirmed against the live API.

**Code Quality (9/10):** access logic reuses `access.ts` patterns; the security-critical `beforeChange` enforcement is explicit and commented; `reviewForm.ts` reuses `auth.ts`'s `getCurrentVisitor()`.

### Failing

None.

## Minor Notes (non-blocking)

- **Design Fidelity 8/10:** no dedicated Stitch review-system screen — `ReviewSection` was built consistent with the "Authoritative Editorial" system and the "What Real Users Say" block from the comparison-article mock. No pixel reference to score against.
- The approval email ("your review was approved") is a documented `TODO(issue-15)` hook point — the actual send lands with #15's Resend notification wiring. The rebuild-on-approval already works.
- curl cookie-jar testing of the visitor session was unreliable (same Payload+curl quirk noted in #12); JWT-header and real-browser paths both verified correctly.
- Comments (vs. reviews) — PRD mentions "reviews and comments". This issue delivers the review system; lightweight comments could be a follow-up using the same pattern, or reviews-with-body covers the need. Flagged, not blocking.

## Feedback for Generator

No fixes required. Issue #13 passes round 1. Unblocks #14 (Profile Page). Next per execution_order: #14.
