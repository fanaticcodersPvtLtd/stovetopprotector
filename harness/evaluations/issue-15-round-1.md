# Evaluation: Issue #15 — Round 1

> Testing mode: `manual_degraded` — no UI. Verified via the CMS console-transport log on real status transitions.

## Scores

| Criterion | Score | Threshold | Pass? |
|-----------|-------|-----------|-------|
| Functionality | 10/10 | 8 | YES |
| Design Fidelity | 10/10 | 7 | YES (auto — no UI) |
| Data Integrity | 9/10 | 9 | YES |
| Code Quality | 9/10 | 7 | YES |

## Overall: PASS

## Findings

### Passing

- `cms/src/lib/notify.ts` — `sendReviewApprovedEmail` + `sendReviewRejectedEmail`; each builds subject + HTML + text, calls `payload.sendEmail`, wrapped in try/catch so a mail failure never throws into the CMS write
- Author email resolved server-side via `payload.findByID({ collection: 'users', ... })` — bypasses the public read gate on `users`. Verified: log shows `email sent to notifytest@example.com`
- `VisitorReviews.afterChange` — the `TODO(issue-15)` marker is replaced with real wiring:
  - status → `approved` → `triggerDeploy` + `sendReviewApprovedEmail` (fire-and-forget via `void`)
  - status → `rejected` → `sendReviewRejectedEmail` (includes `rejectionReason`)
  - guarded by `doc.status !== previousDoc.status` — a re-save of an unchanged-status review does not re-send
- **Verified end-to-end via console transport** (no `RESEND_API_KEY` in dev):
  - signup → `Email attempted ... Subject: 'Verify your email'` (Payload-native, #12)
  - approve → `Email attempted ... Subject: 'Your StoveGuard review is live'` + `[notify] review 6 approved — email sent`
  - reject → `Email attempted ... Subject: 'Update on your StoveGuard review submission'` + `[notify] review 6 rejected — email sent`
- No crash, no thrown error — the console transport handles all sends when the key is absent
- No regression in #13's moderation flow — approve/reject still work, `triggerDeploy` still fires on approval

### Failing

None.

## Activation Notes

Real delivery requires, in the CMS environment:
- `RESEND_API_KEY` — resend.com/api-keys
- `RESEND_FROM_EMAIL` — a verified sender (needs DNS on the sending domain)

With those set, `payload.config.ts` swaps the console transport for the Resend adapter automatically (the `email` config is already conditional from #12) — no code change needed. Until then, every send is logged to the console and the workflow is fully exercisable in dev.

## Minor Notes (non-blocking)

- Data Integrity at threshold (9): no schema change — this is behavior wired onto #13's existing collection.
- Email bodies are inline HTML (a small `emailShell` helper) — fine for 2 transactional emails; if the count grows, extract templates.
- Newsletter digest emails (#17) will reuse `payload.sendEmail` the same way — `notify.ts` is the pattern to extend.

## Feedback for Generator

No fixes required. Issue #15 passes round 1. Next per execution_order: #17 (Newsletter) — now unblocked (#15 done).
