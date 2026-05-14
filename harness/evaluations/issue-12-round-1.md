# Evaluation: Issue #12 — Round 1

> Testing mode: `playwright` — auth flow verified through a real browser (CORS, cookies, client-side auth state). Plus REST/Postgres introspection.
>
> **Scope change recorded:** OAuth (Google/Facebook) dropped per project-owner direction 2026-05-14. Email-only signup/login with verification. This removed the external-credential blocker — issue is fully delivered, not partial.

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

**CMS:**
- `cms-admins` collection — `auth: true`, `name` + `role` (super-admin/editor) fields; `role` field gated to super-admins only
- `payload.config.ts` `admin.user` switched to `cms-admins`; first super-admin **re-seeded** (`salilkhan19@gmail.com`) via `/api/cms-admins/first-register` after the config swap — verified in `cms_admins` table
- `users` reworked as visitor accounts — `auth: { verify: true }`, `displayName` field, `admin.hidden` for non-admins, `access.admin: () => false` (visitors can never reach the admin panel)
- `cms/src/lib/access.ts` — `isCmsAdmin`, `isSuperAdmin`, `isSuperAdminField`, `isSelfOrCmsAdmin`
- **Access control hardened across all 7 content/data collections** — `create/update/delete` → `isCmsAdmin`; the `TODO(issue-6)` placeholder comments are gone. Verified: a visitor token creating `pricing-data` → "You are not allowed to perform this action."; a cms-admin token → succeeds
- Email adapter: `@payloadcms/email-resend` used when `RESEND_API_KEY` set, else Payload's console transport — verified the console path logs the verification-email attempt
- CORS + CSRF configured for the Astro origin (`FRONTEND_URLS`, defaults `http://localhost:4321`)
- Postgres `cms_admins` table created; migration handled the pre-existing admin row in `users` (cleared — it was the old admin auth, now meaningless)

**Frontend — Playwright-verified end-to-end:**
- `/register` — form POSTs to `/api/users`; success → "check your email to verify" message; verified in-browser, CORS clean
- Login **blocked before verification** → "Please verify your email before logging in." (correct — `verify: true`)
- `/verify?token=` — POSTs to `/api/users/verify/:token`; verified → DB `_verified` flips to `true`
- `/login` — form POSTs to `/api/users/login` with `credentials: 'include'`; success → redirects to `/profile`, Payload session cookie set
- `web/src/scripts/auth.ts` — client auth helper; `getCurrentVisitor()` via `/api/users/me`, `logout()`, `renderAuthNav()`
- `BaseLayout` header `[data-auth-slot]` — Playwright confirmed: logged-out → "Log in"; logged-in → "Playwright User / Log out" with a working logout button
- All auth pages `noindex`, `BaseLayout`, "Authoritative Editorial" styling
- Build clean — 16 pages, all 3 auth pages emit

**Data Integrity (10/10):** two distinct auth collections, role field, verification token flow, access constraints (`isSelfOrCmsAdmin` returns a query constraint for visitors). All verified against Postgres + live API.

**Code Quality (9/10):** access helpers centralized in one module; auth forms share a consistent error/success pattern; `auth.ts` escapes the displayName before injecting into the nav; every fetch guarded.

### Failing

None.

## Minor Notes (non-blocking)

- **Design Fidelity 8/10:** the Stitch project had no login/register screens — auth forms were built consistent with the established `web/` system (correct call, but no pixel reference to score against, hence 8 not 9+).
- `/profile` 404s after login — that's **Issue #14**, expected. Login itself succeeds and the cookie is set; only the redirect target is pending.
- curl-based `/api/users/me` cookie test was inconclusive (curl cookie-jar quirk with httpOnly+SameSite); the **browser** path works — Playwright confirmed `auth.ts` reads `/me` and populates the nav. Browser is the real target.
- Production needs `FRONTEND_URLS` set to the real domain for CORS, and `RESEND_API_KEY` for real verification emails (console-only in dev). Documented.

## Feedback for Generator

No fixes required. Issue #12 passes round 1. **Unblocks #13 (Review System) and #14 (Profile Page).** Next per execution_order: #13.
