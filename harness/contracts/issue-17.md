# Build Contract: Issue #17 — Newsletter

> GitHub issue #17. Sourced from `PRD.md`, `plans/stoveguard-site.md` (Phase 4).

## Scope

Email capture + subscriber management + content digest emails.

1. **`newsletter-subscribers` collection** — double opt-in (pending → subscribed), unsubscribe support
2. **Signup form** — embeddable component + a `/newsletter` page
3. **Double opt-in flow** — `/newsletter/confirm?token=` and `/newsletter/unsubscribe?token=` pages
4. **Digest helper** — a `sendNewsletterDigest` utility (extends `notify.ts` pattern) that emails subscribed users; admin/scheduler-triggered, gated on `RESEND_API_KEY` like all email

Per PRD §"Features in scope": "Newsletter — email capture on the site, subscriber management, content digest emails."

## Acceptance Criteria

### CMS — `newsletter-subscribers` collection
- [ ] `cms/src/collections/NewsletterSubscribers.ts` — slug `newsletter-subscribers`, registered in `payload.config.ts`
- [ ] Fields: `email` (text, required, **unique**), `status` (select: `pending` / `subscribed` / `unsubscribed`, default `pending`), `confirmationToken` (text, generated), `subscribedAt` (date), `unsubscribedAt` (date)
- [ ] Postgres table created
- [ ] **Access:** `create` public (anyone can sign up); `read`/`update`/`delete` → `isCmsAdmin`. The double opt-in confirm/unsubscribe happen through dedicated unauthenticated endpoints/hooks keyed on the token, not via open `update` access.
- [ ] `beforeChange` (create): generate a random `confirmationToken`, force `status = 'pending'`, normalize email to lowercase
- [ ] On create, send the confirmation email (via `notify.ts`-style helper) with a `/newsletter/confirm?token=` link — console transport in dev
- [ ] Duplicate email → the unique constraint rejects gracefully (signup form shows a friendly message)

### Confirm / unsubscribe
- [ ] A Payload custom endpoint or hook handles `confirm` (token → `status: subscribed`, set `subscribedAt`, clear token) and `unsubscribe` (token → `status: unsubscribed`, set `unsubscribedAt`). These are token-keyed and do not require the open `update` access.
- [ ] `web/src/pages/newsletter/confirm.astro` — reads `?token=`, calls the confirm endpoint, shows success/failure
- [ ] `web/src/pages/newsletter/unsubscribe.astro` — reads `?token=`, calls the unsubscribe endpoint, shows confirmation

### Frontend
- [ ] `web/src/components/NewsletterSignup.astro` — email input + submit; posts to `/api/newsletter-subscribers`; success → "check your email to confirm"
- [ ] `NewsletterSignup` embedded in the site footer (`BaseLayout`) OR the homepage — visible site-wide or on `/`
- [ ] `web/src/pages/newsletter/index.astro` — a dedicated newsletter landing page with the signup + value prop
- [ ] `web/src/scripts/newsletter.ts` — client script for the signup form (post, handle duplicate/error/success)
- [ ] All newsletter pages: `BaseLayout`, design-system styled; confirm/unsubscribe are `noindex`

### Digest helper
- [ ] `sendNewsletterDigest(payload, { subject, items })` in `cms/src/lib/notify.ts` (or a sibling) — fetches `status: subscribed` subscribers, sends each the digest; fire-and-forget per recipient, never throws; gated on the email adapter (console in dev)
- [ ] Documented as admin/scheduler-triggered — no automated cron in this issue (out of scope), just the reusable send function

### Verification
- [ ] Signup → subscriber row created `pending` with a token; confirmation email attempt logged
- [ ] Confirm with the token → `status: subscribed`, `subscribedAt` set
- [ ] Unsubscribe with the token → `status: unsubscribed`
- [ ] Duplicate signup → rejected by the unique constraint, friendly UI message
- [ ] `pnpm --filter web build` succeeds; newsletter pages emit
- [ ] No regression in the 16 completed issues

## Technical Constraints

- Stack: Payload 3.84.1 + Astro 6 — established
- Reuse `access.ts`, `BaseLayout`, the `notify.ts` email pattern, `triggerDeploy` not needed (subscriber changes don't rebuild the site)
- Confirm/unsubscribe MUST be token-keyed — never expose open `update` on the collection
- Token generation: `crypto.randomUUID()` or similar, server-side
- Email normalization: lowercase + trim before the unique check
- Do not break completed issues

## Dependencies Satisfied

- Issue #15 — email adapter wired + `notify.ts` pattern to extend
- Issue #3 — Astro foundation, `BaseLayout` (footer to embed the signup into)
- Issue #12 — `access.ts` helpers, `cms-admins` for the moderation/read side

## Definition of Done

1. All acceptance criteria verified — signup → pending → confirm → subscribed → unsubscribe all work; duplicate handled; digest helper exists
2. Postgres `newsletter_subscribers` table exists
3. Evaluator grades: Functionality ≥ 8, Design Fidelity ≥ 7, Data Integrity ≥ 9, Code Quality ≥ 7
4. No regression
5. Clean commit — no secrets
