# Graph Report - stove-shield-project  (2026-05-14)

## Corpus Check
- 31 files · ~21,358 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 342 nodes · 329 edges · 24 communities (22 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `652961b3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_CMS & Editorial Roles|CMS & Editorial Roles]]
- [[_COMMUNITY_Build Harness Agents|Build Harness Agents]]
- [[_COMMUNITY_Site Stack & SEO|Site Stack & SEO]]
- [[_COMMUNITY_Design System|Design System]]
- [[_COMMUNITY_Visitor Role|Visitor Role]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 23|Community 23]]

## God Nodes (most connected - your core abstractions)
1. `stoveguard.us.com — Full Content Blueprint` - 13 edges
2. `StoveGuard Autonomous Build Harness` - 11 edges
3. `AI Build Workflow` - 10 edges
4. `Build Contract: Issue #2 — Pricing Data Collection` - 10 edges
5. `Plan: StoveGuard.us.com` - 8 edges
6. `On Each Invocation` - 8 edges
7. `StoveGuard.us.com — Requirements Document` - 7 edges
8. `Design System: Lemkus` - 7 edges
9. `4. Component Stylings` - 7 edges
10. `5. Layout Principles` - 7 edges

## Surprising Connections (you probably didn't know these)
- `StoveGuard.us.com` --semantically_similar_to--> `Lemkus Design System`  [EXTRACTED] [semantically similar]
  PRD.md → DESIGN.md
- `StoveGuard.us.com` --references--> `Silo Architecture`  [INFERRED]
  PRD.md → stoveguard-us-com-blueprint.md
- `StoveGuard.us.com` --implements--> `Astro`  [EXTRACTED]
  PRD.md → CLAUDE.md
- `Designer Agent` --references--> `Lemkus Design System`  [EXTRACTED]
  harness/agents/designer.md → DESIGN.md
- `Autonomous Build Harness` --references--> `Orchestrator Agent`  [EXTRACTED]
  harness/HARNESS.md → harness/agents/orchestrator.md

## Communities (24 total, 2 thin omitted)

### Community 0 - "CMS & Editorial Roles"
Cohesion: 0.06
Nodes (32): 10. Measurement Plan — How to Know If This Is Working, 11. Next Actions (do this week), 12. Open questions for you, 1.1 What the data actually says, 1.2 Positioning, 1.3 Search Quality & E-E-A-T notes (per my SEO standards), 1. Strategic Thesis (What I'm Optimizing For), 2. Competitor Landscape — Who You're Writing About (+24 more)

### Community 1 - "Build Harness Agents"
Cohesion: 0.07
Nodes (29): 1. Visual Theme & Atmosphere, 2. Color Palette & Roles, 3. Typography Rules, 4. Component Stylings, 5. Layout Principles, 6. Interaction & Motion, Border Philosophy, Buttons (+21 more)

### Community 2 - "Site Stack & SEO"
Cohesion: 0.08
Nodes (14): Media, PricingData, Users, GET, OPTIONS, POST, DELETE, GET (+6 more)

### Community 3 - "Design System"
Cohesion: 0.08
Nodes (25): 1. Functionality (threshold: 8/10), 2. Design Fidelity (threshold: 7/10), 3. Data Integrity (threshold: 9/10), 4. Code Quality (threshold: 7/10), Architecture, Autonomous Mode (recommended), Build Contract Format, code:block1 (WHILE open issues remain in state.json:) (+17 more)

### Community 4 - "Visitor Role"
Cohesion: 0.09
Nodes (20): Architecture, Autonomous Build Harness, code:block1 (/loop Build the next StoveGuard issue using the harness at h), code:block2 (Build issue #1 using the harness at harness/HARNESS.md), code:block3 (Orchestrator → picks issue, writes contract), code:block4 (.stitch/), code:block5 (#1 → #2 → #8 → #6 → #3 → #4 → #5 → #7 → #12 → #9 → #13 → #10), Commands (+12 more)

### Community 5 - "Community 5"
Cohesion: 0.1
Nodes (20): Auth, CollectionsWidget, Config, GeneratedTypes, Media, MediaSelect, PayloadKv, PayloadKvSelect (+12 more)

### Community 6 - "Community 6"
Cohesion: 0.1
Nodes (20): Acceptance criteria, Acceptance criteria, Acceptance criteria, Acceptance criteria, Acceptance criteria, Acceptance criteria, Architectural decisions, Phase 1: CMS Foundation + First Content Type (+12 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (16): Anti-Patterns to Avoid, code:bash (cd site && npm run dev), code:markdown (# Evaluation: Issue #{n} — {title} — Round {m}), code:json ({), code:json ({), code:json ({), code:json ({), Evaluator Agent (+8 more)

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (15): code:bash (gh issue view {number} --json title,body,labels), code:markdown (# Build Contract: Issue #{n} — {title}), code:json ({), code:json ({), Decision Rules, On Each Invocation, Orchestrator Agent, Step 1: Read State (+7 more)

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (14): code:json ({), code:json ({), code:block3 (feat(issue-{n}): {brief description of what was built}), Decision Rules, Generator Agent, Handling Evaluator Feedback (Round > 0), On Each Invocation, Step 1: Read Context (+6 more)

### Community 10 - "Community 10"
Cohesion: 0.14
Nodes (13): code:block1 (call: generate_screen_from_text), code:json ({), code:json ({), code:block4 (Design a {page type} for StoveGuard.us.com, an independent s), Design Principles, Designer Agent, On Each Invocation, Step 1: Read Context (+5 more)

### Community 11 - "Community 11"
Cohesion: 0.19
Nodes (4): importMap, Args, Args, Args

### Community 12 - "Community 12"
Cohesion: 0.15
Nodes (13): Silo Architecture, Lemkus Design System, Designer Agent, Evaluator Agent, Generator Agent, Orchestrator Agent, Astro, Editor (+5 more)

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (11): AI Build Workflow, code:block1 (pnpm create next-app@latest [app-name] --typescript --tailwi), Stage 1 — Requirements, Stage 2 — Architecture, Stage 3 — Frontend Prototype, Stage 4 — API Spec, Stage 5 — Database, Stage 6 — Connect Frontend (+3 more)

### Community 14 - "Community 14"
Cohesion: 0.17
Nodes (11): Acceptance Criteria, Access Control (placeholder for #2; tightened in #6), Build Contract: Issue #2 — Pricing Data Collection, code:ts (access: {), Definition of Done, Dependencies Satisfied, Design Reference, Field Specification (+3 more)

### Community 15 - "Community 15"
Cohesion: 0.18
Nodes (10): Actors, Constraints, Content architecture, Editor, Features in scope for v1, Separation of views, StoveGuard.us.com — Requirements Document, Super Admin (+2 more)

### Community 16 - "Community 16"
Cohesion: 0.2
Nodes (10): 3.1 Top-level structure, 3.2 Why this structure, specifically, 3.3 The ~40-article launch list (prioritized), 3. The Silo Architecture, code:block1 (stoveguard.us.com/), Silo 1: Brands, Silo 2: Comparisons, Silo 3: Buyer's Guides (+2 more)

### Community 17 - "Community 17"
Cohesion: 0.22
Nodes (8): Evaluation: Issue #2 — Round 1, Failing, Feedback for Generator, Findings, Minor Notes (non-blocking), Overall: PASS, Passing, Scores

### Community 18 - "Community 18"
Cohesion: 0.33
Nodes (6): 4.1 Hub-and-spoke within each silo, 4.2 Cross-silo linking rules, 4.3 Anchor text rules, 4.4 Homepage links out, 4. Internal Linking Strategy (the silo glue), code:block2 (/comparisons/stoveguard-vs-stove-shield/   ← pillar (anchor )

### Community 19 - "Community 19"
Cohesion: 0.4
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 20 - "Community 20"
Cohesion: 0.5
Nodes (3): dirname, filename, nextConfig

## Knowledge Gaps
- **223 isolated node(s):** `__filename`, `__dirname`, `compat`, `eslintConfig`, `filename` (+218 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `stoveguard.us.com — Full Content Blueprint` connect `CMS & Editorial Roles` to `Community 16`, `Community 18`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `3. The Silo Architecture` connect `Community 16` to `CMS & Editorial Roles`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `__filename`, `__dirname`, `compat` to the rest of the system?**
  _223 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CMS & Editorial Roles` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Build Harness Agents` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Site Stack & SEO` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Design System` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._