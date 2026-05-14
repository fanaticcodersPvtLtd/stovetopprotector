# Build Contract: Issue #13 — Review System

> GitHub issue #13. Sourced from `PRD.md`, `plans/stoveguard-site.md` (Phase 4).

## Scope

Visitor-submitted reviews + a moderation queue. Logged-in visitors submit a review on any content page; it lands in `pending`; a cms-admin approves/rejects in the Payload admin panel; approved reviews render on the page at next build.

Per PRD §"Visitor (Contributor)":
> Submit reviews and comments on any article or brand page ... Post content that goes live ONLY after moderation approval ... view their submission history and statuses.

Per plan Phase 4: account creation (done in #12), submission, moderation queue, email notifications (the email part is #15).

## Acceptance Criteria

### CMS — `visitor-reviews` collection
- [ ] `cms/src/collections/VisitorReviews.ts` — slug `visitor-reviews`, registered in `payload.config.ts`
- [ ] Fields: `body` (textarea, required), `rating` (number 1–5, required), `author` (relationship → `users`, required), `target` (**polymorphic relationship** → comparison-articles / review-articles / buyer-guides / educational-guides / brand-pages, required), `status` (select: `pending` / `approved` / `rejected`, default `pending`), `rejectionReason` (textarea, shown only when rejected), `submittedAt` (date, auto)
- [ ] Postgres tables created
- [ ] **Access control:**
  - `create` — logged-in visitors only (`req.user?.collection === 'users'`); the `author` is forced to the requesting user in a `beforeChange` hook (a visitor cannot submit as someone else), `status` forced to `pending` on create (a visitor cannot self-approve)
  - `read` — public sees only `approved`; a visitor also sees their *own* pending/rejected; cms-admins see all
  - `update` / `delete` — cms-admins only (moderation happens in the admin panel)
- [ ] `beforeChange` hook: on create, force `author = req.user.id` and `status = 'pending'`; set `submittedAt`
- [ ] `afterChange` hook: when `status` becomes `approved`, fire `triggerDeploy` (so the approved review appears on next build) — also a stub/marker for the email-on-approval notification (#15 wires the actual send)
- [ ] cms-admin can change `status` → `approved` / `rejected` in the admin panel; rejecting with a reason works
- [ ] `GET /api/visitor-reviews?where[status][equals]=approved&where[target...]` returns approved reviews for a target

### Frontend
- [ ] `web/src/components/ReviewSection.astro` — a component embedded in content templates:
  - At build time: fetches **approved** reviews for the current page, renders them (author displayName, rating stars, body, date)
  - Shows aggregate (review count + average rating) when reviews exist
  - A submission form — visible to logged-in visitors only (client-side auth check); logged-out visitors see a "Log in to write a review" prompt
  - The form POSTs to `/api/visitor-reviews` with `credentials: 'include'`; on success shows "submitted — pending moderation"
- [ ] `ReviewSection` wired into `comparison-articles`, `review-articles`, and `brand-pages` templates (the primary "content pages" per PRD)
- [ ] `web/src/scripts/reviewForm.ts` — client script for the submission form (auth-gated, posts, handles errors)
- [ ] `web/src/lib/payload.ts` — `getApprovedReviewsFor(targetType, targetId)` helper
- [ ] `pnpm --filter web build` succeeds; pages with the review section build
- [ ] Playwright: logged-out → sees login prompt, no form; logged-in → sees form, can submit → review created `pending`; after a cms-admin approves, the review appears on rebuild

## Hooks

- `visitor-reviews.beforeChange` — force `author`/`status` on create, set `submittedAt`
- `visitor-reviews.afterChange` — `triggerDeploy` on approval; email-notification hook point (actual send deferred to #15)

## Design Reference

- No dedicated Stitch review-system screen — the review section is a component within article pages. Build consistent with the "Authoritative Editorial" system; the "What Real Users Say" block already in the comparison-article Stitch design is the visual reference.
- `.stitch/DESIGN.md`

## Technical Constraints

- Stack: Payload 3.84.1 + Astro 6 — established
- Reuse `triggerDeploy`, `access.ts`, `BaseLayout`, `auth.ts` patterns
- Polymorphic relationship: Payload `relationTo: [...]` array form
- The submission form is client-side (SSG site) — posts with the visitor's session cookie
- Security: the `author` and `status` MUST be server-enforced in `beforeChange` — never trust the client payload for those
- Do not break the 13 completed issues

## Dependencies Satisfied

- Issue #12 — visitor `users` collection + auth + `access.ts` helpers
- Issue #3 — Astro foundation, content templates to embed the section into
- Issues #4, #7 — review-articles + brand-pages templates (also get the section)

## Definition of Done

1. All acceptance criteria verified — submission works for logged-in visitors, moderation works in admin, approved-only renders, author/status server-enforced
2. Postgres `visitor_reviews` table exists
3. Evaluator (Playwright) grades: Functionality ≥ 8, Design Fidelity ≥ 7, Data Integrity ≥ 9, Code Quality ≥ 7
4. No regression
5. Clean commit — no secrets
