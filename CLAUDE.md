# CLAUDE.md

## Project Overview

StoveGuard.us.com — independent consumer review and comparison site for stove top protectors. Built with Astro, Payload CMS 3.0, Postgres. Revenue from AdSense. No affiliates.

See `PRD.md` for full requirements, `DESIGN.md` for visual system (Lemkus-inspired), `workflow.md` for stage-by-stage build process.

## Autonomous Build Harness

This project uses a multi-agent harness for autonomous development. Based on [Anthropic's harness design article](https://www.anthropic.com/engineering/harness-design-long-running-apps).

**Read `harness/HARNESS.md` for the full design.**

### Architecture

Four agents, file-based communication, issue-driven execution:

| Agent | Role | Prompt |
|-------|------|--------|
| Orchestrator | Picks next issue, writes build contract | `harness/agents/orchestrator.md` |
| Designer | Stitch MCP visual design before code | `harness/agents/designer.md` |
| Generator | Implements feature against contract + design | `harness/agents/generator.md` |
| Evaluator | Playwright QA, grades with hard thresholds | `harness/agents/evaluator.md` |

### Running the Harness

**Autonomous mode:**
```
/loop Build the next StoveGuard issue using the harness at harness/HARNESS.md
```

**Single issue:**
```
Build issue #1 using the harness at harness/HARNESS.md
```

**Resume after interruption:**
Read `harness/state.json` — it tracks current phase, active issue, and round number.

### The Loop

```
Orchestrator → picks issue, writes contract
Designer → Stitch design (UI issues only)
Generator → implements
Evaluator → grades (pass → close issue, fail → retry, max 3 rounds)
```

### State Tracking

- `harness/state.json` — current phase, issue queue, dependency graph, history
- `harness/contracts/issue-{n}.md` — build contract per issue
- `harness/evaluations/issue-{n}-round-{m}.md` — QA reports

### Grading Criteria

| Criterion | Threshold | What It Measures |
|-----------|-----------|------------------|
| Functionality | 8/10 | Acceptance criteria pass |
| Design Fidelity | 7/10 | Matches Stitch screenshot |
| Data Integrity | 9/10 | CMS fields, relationships, hooks correct |
| Code Quality | 7/10 | TypeScript, security, patterns |

## Design-First Development with Stitch

**Every page gets designed in Stitch before any code is written.** The Designer agent handles this automatically within the harness loop.

### Stitch MCP Tools

| Step | Tool | Purpose |
|------|------|---------|
| 1 | `create_project` or `get_project` | Get/create Stitch project |
| 2 | `create_design_system` or `apply_design_system` | Set visual tokens from `DESIGN.md` |
| 3 | `generate_screen_from_text` | Generate page design from prompt |
| 4 | `get_screen` | Retrieve HTML + screenshot |
| 5 | `generate_variants` | Create alternate versions if needed |
| 6 | `edit_screens` | Refine specific elements |

### Design-to-Code Rules

- Download both HTML and screenshot (append `=w{width}` to screenshot URL)
- Save to `.stitch/designs/` before converting
- Match colors, spacing, typography, layout from Stitch output
- Use `DESIGN.md` tokens as Tailwind config values
- Cross-reference Stitch screenshot against running dev server

### Stitch Files

```
.stitch/
  metadata.json    # Stitch project + screen IDs
  DESIGN.md        # Visual design system for Stitch prompts
  SITE.md          # Site vision, sitemap, roadmap
  next-prompt.md   # Current task baton (for stitch-loop skill)
  designs/         # Staging: {page}.html + {page}.png
```

## Tech Stack

- **Frontend:** Astro (SSG default, selective SSR), TypeScript, Tailwind CSS
- **CMS:** Payload CMS 3.0
- **Database:** Postgres (via Payload on Railway/Render)
- **Design:** Stitch MCP for visual design, then hand-coded implementation
- **Hosting:** Cloudflare Pages (frontend), Railway/Render (CMS)
- **Email:** Resend (transactional)
- **Analytics:** GA4
- **Ads:** Google AdSense
- **Auth:** Payload Auth (separate `cms-admins` and `users` collections)

## Issue Execution Order

Dependency-resolved order for the 19 GitHub issues:

```
#1 → #2 → #8 → #6 → #3 → #4 → #5 → #7 → #12 → #9 → #13 → #10 → #11 → #14 → #15 → #16 → #17 → #18 → #19
```

See `harness/state.json` for full dependency graph and completion status.

## Commands

Slash commands in `.claude/commands/`. Use for manual workflow stages if not using the harness.

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
