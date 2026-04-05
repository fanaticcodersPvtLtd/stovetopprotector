# AI Build Workflow

The full process for going from idea to working prototype with a connected backend, using AI agents at every stage.

The prompts in the `commands/` folder can be used with any AI agent. If you use Claude Code, drop them into `.claude/commands/` to use them as slash commands.

---

## Stage 1 — Requirements

**Prompt:** `create-prd.md`

Run this prompt with your agent and let it interview you. Don't shortcut it. One question at a time until it has everything it needs.

What it extracts:
- What the product is and who it's for (one sentence)
- Every actor — how they get in, what they see, what they can and can't do
- Where different actors see different things at the same URL
- External dependencies, budget limits, and what's explicitly out of scope for v1

**Output:** `PRD.md`

---

## Stage 2 — Architecture

**Prompt:** `layer.md`

Run this after the PRD is confirmed. The agent reads the PRD and produces a structured blueprint — no code, no UI decisions.

What it produces:
- Every page and route, who can see it, what's on it, where actions lead
- Every data model with fields, relationships, and lifecycle
- Every user flow including edge cases and access failures

**Output:** `ARCHITECTURE.md`

---

## Stage 3 — Frontend Prototype

**Prompt:** `frontend-skill.md`

Install a Next.js app first:

```
pnpm create next-app@latest [app-name] --typescript --tailwind --eslint --app
```

Then run this prompt. The agent reads `ARCHITECTURE.md` and builds the full frontend with mock data — no backend required yet. This is what you show the client or use to validate the direction before building anything real.

What it produces:
- All routes and pages
- Working navigation
- Mock data throughout
- Strong design (distinctive fonts, cohesive color system, motion)

**Output:** Complete frontend with all routes and mock data

---

## Stage 4 — API Spec

**Prompt:** `api-spec.md`

Run this after the frontend is built. The agent reads the frontend code, PRD, and ARCHITECTURE.md and defines every endpoint as a contract — not an implementation.

What it defines per endpoint:
- Route and method
- Who can call it
- What it receives and returns
- What errors it handles

**Output:** `API_SPEC.md`

---

## Stage 5 — Database

**Prompt:** `supabase-schema.md`

Run this with a Supabase MCP configured. The agent reads PRD, ARCHITECTURE.md, and API_SPEC.md and creates the full schema directly — tables, relationships, RLS policies, triggers. No manual SQL.

**Output:** Live database, migrations run, schema documented

---

## Stage 6 — Connect Frontend

**Prompt:** `connect-frontend.md`

Run this after the database is set up. The agent connects the frontend to Supabase — real auth, live queries replacing all mock data, every form wired up. Design stays untouched.

**Output:** Fully connected frontend pulling real data

---

## Stage 7 — Backend API (Cloud Agent)

**Prompt:** `backend-api.md`

Stage 6 connects the frontend directly to Supabase — that covers auth, data fetching, and standard CRUD. But some things can't run in the browser: payment webhooks, email sending, rate limiting, server-side analytics. That's what this stage is for.

Delegate this to a cloud agent. It's a long-running task you can hand off and come back to.

Run `backend-api.md` against your repo using whatever cloud agent platform you're using.

**Output:** Full backend API layer pushed to repo

---

## What each stage produces

| Stage | Prompt | Output |
|-------|--------|--------|
| 1 | `create-prd.md` | `PRD.md` |
| 2 | `layer.md` | `ARCHITECTURE.md` |
| 3 | `frontend-skill.md` | Full frontend (mock data) |
| 4 | `api-spec.md` | `API_SPEC.md` |
| 5 | `supabase-schema.md` | Live database |
| 6 | `connect-frontend.md` | Connected frontend |
| 7 | Cloud agent | Backend API routes |

---

## When to use a separate backend

Next.js handles most cases. You need a separate Python backend only when:

- You need libraries not available in Node (ML, heavy data processing)
- You need serious background job orchestration

Otherwise Next.js API routes are enough.
