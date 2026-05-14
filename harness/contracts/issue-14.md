# Build Contract: Issue #14 — Profile Page

> GitHub issue #14. Sourced from `PRD.md`, `plans/stoveguard-site.md` (Phase 4), `.stitch/` designs.

## Scope

The visitor profile page at `/profile` — shows the logged-in visitor their account info and their full submission history with moderation statuses. Fully client-side (auth-gated) since the site is SSG.

Per PRD §"Visitor (Contributor)":
> A profile page showing display name, submission history, and status of each submission (pending, approved, rejected with reason).

## Acceptance Criteria

- [ ] `web/src/pages/profile.astro` renders at `/profile`, `noindex`, `BaseLayout`
- [ ] **Auth-gated client-side:** on load, checks `/api/users/me`; if not logged in → shows a "please log in" state with a link to `/login` (no flash of private content)
- [ ] When logged in, shows: `displayName`, `email`, account-verified indicator
- [ ] **Submission history:** fetches the visitor's own `visitor-reviews` (`?where[author][equals]=<me>`, with the session cookie) and lists each — review body, rating, target, `submittedAt`, and a **status badge** (pending / approved / rejected)
- [ ] Rejected submissions show the `rejectionReason`
- [ ] Empty state: "You haven't submitted any reviews yet" with a link to browse content
- [ ] A "Log out" action on the page (in addition to the nav one)
- [ ] `web/src/scripts/profile.ts` — the client script driving all of the above; reuses `auth.ts` helpers; every fetch guarded, no uncaught errors
- [ ] Visitor-reviews access already lets a visitor read their own pending/rejected docs (built in #13) — verify the profile fetch returns them
- [ ] `pnpm --filter web build` succeeds; `/profile` emits
- [ ] Playwright: logged-out → "please log in" state; logged-in with submissions → history list with correct status badges; logged-in with none → empty state
- [ ] Header nav "profile" link (from #12's `auth.ts`) points here and works

## Design Reference

- Stitch design: `.stitch/designs/profile.html` + `.png` — Designer downloads a "User Profile" screen (`11bfdcb4...` or `211afa2a...`) from project `6849064886324327137`
- `.stitch/DESIGN.md`
- Reuse the `web/` "Authoritative Editorial" system

## Technical Constraints

- Stack: Astro 6 SSG + client JS — established
- Fully client-rendered: the page ships an empty shell + `profile.ts` fills it after the `/api/users/me` check (avoids any flash of unauthenticated/private content)
- Reuse `auth.ts` (`getCurrentVisitor`, `logout`) and the `PUBLIC_PAYLOAD_API_URL` env
- `visitor-reviews` read access for own docs was built in #13 — no CMS change needed
- Status badge styling consistent with the design system (pending = neutral, approved = primary/green, rejected = red)
- Do not break the 14 completed issues

## Dependencies Satisfied

- Issue #12 — visitor auth, `auth.ts`, `/login`
- Issue #13 — `visitor-reviews` collection + its self-read access (a visitor can read their own pending/rejected)
- Issue #3 — Astro foundation, `BaseLayout`

## Definition of Done

1. All acceptance criteria verified — profile shows account + submission history with statuses; auth-gated; empty + rejected states handled
2. Evaluator (Playwright) grades: Functionality ≥ 8, Design Fidelity ≥ 7, Data Integrity ≥ 9, Code Quality ≥ 7
3. No regression
4. Clean commit — no secrets
