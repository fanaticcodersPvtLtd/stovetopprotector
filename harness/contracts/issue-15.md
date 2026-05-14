# Build Contract: Issue #15 — Email Notifications

> GitHub issue #15. `has_ui: false` — no Designer phase. Sourced from `PRD.md`, `plans/stoveguard-site.md` (Phase 4).

## Scope

Transactional email notifications via the Resend adapter (already wired in #12, gated on `RESEND_API_KEY`). This issue adds the **notification sends**:

1. **Review approved** — when a cms-admin approves a `visitor-reviews` submission, email the author "your review is live".
2. **Review rejected** — when rejected, email the author with the `rejectionReason`.
3. Email verification (account signup) already works — Payload-native, routed through the same adapter (built in #12). This issue does not re-do it; it's noted as covered.

Per PRD §"Visitor (Contributor)":
> Receive email notifications when submissions are approved.

Per plan Phase 4: "email notifications" for the review workflow.

**Graceful degradation:** with `RESEND_API_KEY` unset (dev), Payload's console transport logs the send attempt — no crash, no error. With the key set (prod), real email goes out. The notification CODE is fully built and verifiable in dev via the console transport; only the real delivery is credential-gated.

## Acceptance Criteria

- [ ] `cms/src/lib/notify.ts` — notification helpers: `sendReviewApprovedEmail(payload, review)` and `sendReviewRejectedEmail(payload, review)`. Each builds a subject + HTML/text body and calls `payload.sendEmail(...)`. Never throws — wrapped so a mail failure can't break the CMS write.
- [ ] Emails address the author by `authorName`, sent to the author's email (resolved from the `author` relationship — server-side, so the gated `users` collection is readable here)
- [ ] `VisitorReviews.afterChange` — the existing `TODO(issue-15)` hook point now calls:
  - `sendReviewApprovedEmail` when `status` transitions to `approved`
  - `sendReviewRejectedEmail` when `status` transitions to `rejected` (includes the `rejectionReason`)
  - transition detection uses `previousDoc.status !== doc.status` so a re-save of an already-approved review doesn't re-send
- [ ] The approval branch still fires `triggerDeploy` (from #13) — order: deploy trigger + email, both non-blocking
- [ ] Sends are fire-and-forget — `afterChange` does not `await` the email in a way that blocks the response; failures are logged via `payload.logger`, never thrown
- [ ] With `RESEND_API_KEY` unset: a status change logs the console-transport attempt (`To: <author email>, Subject: ...`) — verified, no error
- [ ] `.env.example` already documents `RESEND_API_KEY` / `RESEND_FROM_EMAIL` — verify the comment notes "console transport in dev; real send needs the key"
- [ ] Payload restart clean; no regression in the review moderation flow (#13)

## Technical Constraints

- Stack: Payload 3.84.1 — established; Resend adapter already configured in `payload.config.ts` (#12)
- Use `payload.sendEmail({ to, subject, html, text })` — Payload routes it through whatever adapter is configured (Resend or console)
- Resolving the author's email: in `afterChange` use `req.payload.findByID({ collection: 'users', id: authorId })` (server context — bypasses the public read gate) or read from `doc.author` if depth resolved it
- `notify.ts` functions must be pure-ish: take `payload` + data, no module-level state
- Do not change the `visitor-reviews` schema or access control
- Email bodies: simple, on-brand, plain — no heavy templating dependency

## Dependencies Satisfied

- Issue #12 — Resend email adapter wired in `payload.config.ts` (gated on `RESEND_API_KEY`); `users` collection has the email
- Issue #13 — `visitor-reviews` collection + the `afterChange` hook with the `TODO(issue-15)` marker; `authorName` denormalized

## Definition of Done

1. All acceptance criteria verified — approval + rejection both attempt-send on the right transition, console-safe without the key, never throw
2. Evaluator grades: Functionality ≥ 8, Design Fidelity = 10 (auto, no UI), Data Integrity ≥ 9, Code Quality ≥ 7
3. No regression in #13's moderation flow
4. Clean commit — no secrets
5. Evaluation notes: how to activate real delivery (set `RESEND_API_KEY` + verified `RESEND_FROM_EMAIL`)
