# Evaluation: Issue #17 — Round 1

> Testing mode: `playwright` — signup form verified in-browser; the double-opt-in flow + endpoints verified via REST/DB.

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

**CMS — `newsletter-subscribers` collection:**
- Registered; Postgres `newsletter_subscribers` table created with a UNIQUE index on `email` and an index on `confirmation_token`
- Fields: `email` (unique), `status` (pending/subscribed/unsubscribed), `confirmationToken`, `subscribedAt`, `unsubscribedAt`
- `beforeValidate` on create: email lowercased + trimmed, `status` forced to `pending`, `confirmationToken` generated (`randomUUID`)
- `afterChange` on create: fires `sendNewsletterConfirmationEmail` — verified in the console log (`Subject: 'Confirm your StoveGuard Reviews newsletter subscription'` + `[notify] newsletter confirmation email sent`)
- **Access:** `create` public; `read`/`update`/`delete` → `isCmsAdmin`. Confirm/unsubscribe go through token-keyed custom endpoints with `overrideAccess` — open `update` is never exposed
- **Custom endpoints verified:**
  - `POST /confirm { token }` → `status: subscribed`, `subscribedAt` set
  - `POST /unsubscribe { token }` → `status: unsubscribed`
  - bad token → 404
  - the token is kept on the row after confirm (it's the stable secret the unsubscribe link relies on)
- Duplicate signup → rejected by the unique constraint ("field is invalid: email")

**Frontend — Playwright-verified:**
- `NewsletterSignup.astro` — `footer` + `panel` variants; signup posts to `/api/newsletter-subscribers`; success → "Almost there — check your email to confirm"
- Embedded site-wide in the `BaseLayout` footer (Playwright confirmed 1 in the footer)
- `web/src/pages/newsletter/index.astro` — dedicated landing page with value prop
- `newsletter/confirm.astro` + `newsletter/unsubscribe.astro` — token-reading pages, pending/success/error states, `noindex`
- `web/src/scripts/newsletter.ts` — handles every signup form on the page, friendly duplicate-email message
- Build clean — 3 newsletter pages emit; zero console errors

**Digest helper:**
- `sendNewsletterDigest(payload, { subject, introHtml, items })` in `notify.ts` — fetches `status: subscribed` subscribers, sends each a digest with a per-subscriber unsubscribe link, fire-and-forget per recipient, returns `{ sent, failed }`. Admin/scheduler-triggered (no cron in scope).

**Data Integrity (10/10):** unique email constraint, token-keyed state transitions (no open update), double opt-in enforced (signup → pending, only the tokened endpoint → subscribed). All verified against the live DB.

### Failing

None.

## Minor Notes (non-blocking)

- **Design Fidelity 8/10:** no dedicated Stitch newsletter screen — built consistent with the "Authoritative Editorial" system (footer + panel variants).
- A confirm-endpoint test initially appeared to fail — it was a test-script bug (`confirmationtoken` vs the real `confirmation_token` column name); the endpoint itself works (re-verified). Payload endpoint handlers read the body via `req.data`.
- The digest helper is built and reusable but has no automated trigger — wiring it to a schedule (cron / Payload job) is intentionally out of #17's scope; an operator or a later issue can call it.
- Real email delivery still needs `RESEND_API_KEY` — same gate as #15; works via console transport in dev.

## Feedback for Generator

No fixes required. Issue #17 passes round 1. Remaining: #18 (Social — share buttons buildable, auto-post needs API keys), #19 (AdSense — components behind a flag, serving needs publisher ID + approval). Next per execution_order: #18.
