# Build Contract: Issue #12 — Auth (Visitor Accounts)

> GitHub issue #12. **Scope change:** PRD specified Google/Facebook OAuth. Per the project owner's direction (2026-05-14), OAuth is dropped — **email-only signup/login with email verification**. This removes the external-credential blocker; the issue is now fully buildable. OAuth can be re-added later as an additive plugin if desired.

## Scope

1. **`cms-admins` Payload collection** — the admin-panel users (super-admin + editor roles). Becomes Payload's `admin.user`.
2. **`users` collection reworked as visitor accounts** — public-site accounts. Email + password auth, **email verification** (`auth.verify`), `displayName`. No admin-panel access.
3. **Payload email adapter** — Resend when `RESEND_API_KEY` is set, otherwise Payload's default console adapter (dev). Verification + future notification emails route through it.
4. **Access-control hardening** — replace the `({ req:{ user } }) => Boolean(user)` placeholder across ALL existing collections with a real role gate (`isCmsAdmin`). Resolves the long-standing `TODO(issue-6)` debt.
5. **Frontend auth** — `/register`, `/login`, `/verify` pages; client-side auth state in the nav (logged-out: "Log in"; logged-in: profile link + logout). SSG site → auth state is resolved client-side against the Payload users API.

## Acceptance Criteria

### CMS
- [ ] `cms/src/collections/CmsAdmins.ts` — slug `cms-admins`, `auth: true`, fields: `name` (text), `role` (select: `super-admin` / `editor`, default `editor`)
- [ ] `payload.config.ts` `admin.user` switched to `cms-admins`
- [ ] First `cms-admin` re-seeded (super-admin, `salilkhan19@gmail.com`) — done via API after restart since `admin.user` collection starts empty; documented
- [ ] `users` collection reworked: `auth: { verify: true }`, fields: `displayName` (text, required); not usable for admin-panel login
- [ ] `cms/src/lib/access.ts` — exports `isCmsAdmin` (`req.user?.collection === 'cms-admins'`) and `isSuperAdmin` (also `role === 'super-admin'`)
- [ ] All 7 content/data collections (`pricing-data`, `media`, `comparison-articles`, `review-articles`, `buyer-guides`, `educational-guides`, `brand-pages`) updated: `create`/`update`/`delete` → `isCmsAdmin`; `read` stays public. The `TODO(issue-6)` comments removed.
- [ ] `cms-admins` access: only super-admins create/delete admins; editors can read; editors cannot touch `role`
- [ ] `users` access: a visitor reads/updates only their own record; `cms-admins` can read all; public can create (register)
- [ ] Email adapter: `payload.config.ts` uses `@payloadcms/email-resend` when `RESEND_API_KEY` set, else omits adapter (Payload logs to console)
- [ ] `GET /api/cms-admins` and `GET /api/users` both work; admin panel login uses `cms-admins`
- [ ] Restart clean; Postgres `cms_admins` table created; existing collections unaffected

### Frontend
- [ ] `web/src/pages/register.astro` — email + password + displayName form; POSTs to `/api/users` (create); shows "check your email to verify" on success
- [ ] `web/src/pages/login.astro` — email + password; POSTs to `/api/users/login`; on success stores the Payload session + redirects
- [ ] `web/src/pages/verify.astro` — reads `?token=`, calls `/api/users/verify/:token`, shows success/failure
- [ ] `web/src/scripts/auth.ts` — client auth helper: checks `/api/users/me`, exposes login/logout, updates nav
- [ ] `BaseLayout` header shows auth state client-side: logged-out → "Log in" link; logged-in → displayName + "Log out"
- [ ] Auth forms handle + display API errors (bad credentials, unverified, duplicate email)
- [ ] All auth pages use `BaseLayout`, "Authoritative Editorial" styling, `noindex` (auth pages shouldn't be indexed)
- [ ] `pnpm --filter web build` succeeds; auth pages emit
- [ ] Playwright: register a visitor → user created + unverified; verify via the console-logged token → verified; login → `/api/users/me` returns the user; nav reflects state

## Hooks / Behaviour

- `users` — email verification is Payload-native (`auth.verify: true`); the verification email routes through the configured adapter (console in dev)
- No deploy-hook on `users`/`cms-admins` — account changes don't rebuild the static site

## Design Reference

- Stitch: the project has User Profile screens (`11bfdcb4...`, `211afa2a...`) — auth form screens aren't in the project, so login/register are built consistent with the "Authoritative Editorial" system (the Designer downloads the profile screen for #14's benefit and notes auth-form styling follows the established `web/` patterns)
- `.stitch/DESIGN.md`

## Technical Constraints

- Stack: Payload 3.84.1 + Astro 6 — established
- `@payloadcms/email-resend` — add to `cms/package.json`
- Re-seeding the first `cms-admin`: after the config swap + restart, `cms-admins` is empty → Payload permits unauthenticated first-user creation; seed via `POST /api/cms-admins` (or the first-register endpoint)
- The existing `users` row for `salilkhan19@gmail.com` (was the admin) — delete it after the cms-admin is seeded, so `users` is purely visitors
- Visitor auth on a static frontend: Payload sets an httpOnly cookie on `/api/users/login`; the Astro pages are pre-built, so nav auth state is resolved by a client-side `/api/users/me` fetch
- `PAYLOAD_API_URL` must be reachable from the browser at runtime for auth — fine in dev (`localhost:3001`); prod needs CORS configured (note for later)
- Do not break the 12 completed issues

## Dependencies Satisfied

- Issue #1 — Payload scaffold (the `users` collection being reworked here)
- Issue #3 — Astro `web/` foundation, `BaseLayout`

## Definition of Done

1. All acceptance criteria verified — register/login/verify flow works, access control enforced, nav reflects auth state
2. Postgres `cms_admins` table exists; super-admin re-seeded; admin panel reachable
3. Evaluator (Playwright) grades: Functionality ≥ 8, Design Fidelity ≥ 7, Data Integrity ≥ 9, Code Quality ≥ 7
4. No regression — all 12 completed issues still work; admin panel still manages content
5. Clean commit — no secrets
6. `.env.example` updated: OAuth keys removed/marked dropped; `RESEND_API_KEY` noted as optional-in-dev
