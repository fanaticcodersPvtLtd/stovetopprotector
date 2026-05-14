# Graph Report - stove-shield-project  (2026-05-14)

## Corpus Check
- 65 files · ~42,971 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 636 nodes · 681 edges · 48 communities (46 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e65d93fd`
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
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 47|Community 47]]

## God Nodes (most connected - your core abstractions)
1. `stoveguard.us.com — Full Content Blueprint` - 13 edges
2. `StoveGuard Autonomous Build Harness` - 11 edges
3. `AI Build Workflow` - 10 edges
4. `Build Contract: Issue #3 — Comparison Articles + Astro Frontend Bootstrap` - 10 edges
5. `Build Contract: Issue #2 — Pricing Data Collection` - 10 edges
6. `Build Contract: Issue #7 — Brand Pages` - 9 edges
7. `Build Contract: Issue #6 — Educational Guides` - 9 edges
8. `Build Contract: Issue #8 — Media Collection` - 9 edges
9. `Build Contract: Issue #5 — Buyer Guides` - 9 edges
10. `Build Contract: Issue #4 — Review Articles` - 9 edges

## Surprising Connections (you probably didn't know these)
- `StoveGuard.us.com` --semantically_similar_to--> `Lemkus Design System`  [EXTRACTED] [semantically similar]
  PRD.md → DESIGN.md
- `StoveGuard.us.com` --references--> `Silo Architecture`  [INFERRED]
  PRD.md → stoveguard-us-com-blueprint.md
- `StoveGuard.us.com` --implements--> `Astro`  [EXTRACTED]
  PRD.md → CLAUDE.md
- `Designer Agent` --references--> `Lemkus Design System`  [EXTRACTED]
  harness/agents/designer.md → DESIGN.md
- `GET()` --calls--> `getPublishedComparisonArticles()`  [EXTRACTED]
  web/src/pages/sitemap.xml.ts → web/src/lib/payload.ts

## Communities (48 total, 2 thin omitted)

### Community 0 - "CMS & Editorial Roles"
Cohesion: 0.08
Nodes (32): BrandPage, BuyerGuide, ComparisonArticle, ComparisonRow, EducationalGuide, Faq, getHomepageContent(), getPublishedBrandPages() (+24 more)

### Community 1 - "Build Harness Agents"
Cohesion: 0.05
Nodes (38): 10. Measurement Plan — How to Know If This Is Working, 11. Next Actions (do this week), 12. Open questions for you, 1.1 What the data actually says, 1.2 Positioning, 1.3 Search Quality & E-E-A-T notes (per my SEO standards), 1. Strategic Thesis (What I'm Optimizing For), 2. Competitor Landscape — Who You're Writing About (+30 more)

### Community 2 - "Site Stack & SEO"
Cohesion: 0.11
Nodes (18): BrandPages, BuyerGuides, ComparisonArticles, EducationalGuides, dirname, Media, PricingData, ReviewArticles (+10 more)

### Community 3 - "Design System"
Cohesion: 0.06
Nodes (30): Auth, BrandPage, BrandPagesSelect, BuyerGuide, BuyerGuidesSelect, CollectionsWidget, ComparisonArticle, ComparisonArticlesSelect (+22 more)

### Community 4 - "Visitor Role"
Cohesion: 0.07
Nodes (29): 1. Visual Theme & Atmosphere, 2. Color Palette & Roles, 3. Typography Rules, 4. Component Stylings, 5. Layout Principles, 6. Interaction & Motion, Border Philosophy, Buttons (+21 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (25): 1. Functionality (threshold: 8/10), 2. Design Fidelity (threshold: 7/10), 3. Data Integrity (threshold: 9/10), 4. Code Quality (threshold: 7/10), Architecture, Autonomous Mode (recommended), Build Contract Format, code:block1 (WHILE open issues remain in state.json:) (+17 more)

### Community 6 - "Community 6"
Cohesion: 0.09
Nodes (20): Architecture, Autonomous Build Harness, code:block1 (/loop Build the next StoveGuard issue using the harness at h), code:block2 (Build issue #1 using the harness at harness/HARNESS.md), code:block3 (Orchestrator → picks issue, writes contract), code:block4 (.stitch/), code:block5 (#1 → #2 → #8 → #6 → #3 → #4 → #5 → #7 → #12 → #9 → #13 → #10), Commands (+12 more)

### Community 7 - "Community 7"
Cohesion: 0.1
Nodes (20): Acceptance criteria, Acceptance criteria, Acceptance criteria, Acceptance criteria, Acceptance criteria, Acceptance criteria, Architectural decisions, Phase 1: CMS Foundation + First Content Type (+12 more)

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (16): Anti-Patterns to Avoid, code:bash (cd site && npm run dev), code:markdown (# Evaluation: Issue #{n} — {title} — Round {m}), code:json ({), code:json ({), code:json ({), code:json ({), Evaluator Agent (+8 more)

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (15): code:bash (gh issue view {number} --json title,body,labels), code:markdown (# Build Contract: Issue #{n} — {title}), code:json ({), code:json ({), Decision Rules, On Each Invocation, Orchestrator Agent, Step 1: Read State (+7 more)

### Community 10 - "Community 10"
Cohesion: 0.13
Nodes (14): Acceptance Criteria, Astro frontend — `web/` workspace, Build Contract: Issue #3 — Comparison Articles + Astro Frontend Bootstrap, CMS — `comparison-articles` collection, Comparison article template, Definition of Done, Dependencies Satisfied, Deploy Hook Utility (+6 more)

### Community 11 - "Community 11"
Cohesion: 0.13
Nodes (14): code:json ({), code:json ({), code:block3 (feat(issue-{n}): {brief description of what was built}), Decision Rules, Generator Agent, Handling Evaluator Feedback (Round > 0), On Each Invocation, Step 1: Read Context (+6 more)

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (13): code:block1 (call: generate_screen_from_text), code:json ({), code:json ({), code:block4 (Design a {page type} for StoveGuard.us.com, an independent s), Design Principles, Designer Agent, On Each Invocation, Step 1: Read Context (+5 more)

### Community 13 - "Community 13"
Cohesion: 0.19
Nodes (4): importMap, Args, Args, Args

### Community 14 - "Community 14"
Cohesion: 0.15
Nodes (13): Silo Architecture, Lemkus Design System, Designer Agent, Evaluator Agent, Generator Agent, Orchestrator Agent, Astro, Editor (+5 more)

### Community 15 - "Community 15"
Cohesion: 0.21
Nodes (11): checkScrollDepth(), cta, fired, getGtag(), Gtag, href, link, milestones (+3 more)

### Community 16 - "Community 16"
Cohesion: 0.17
Nodes (11): AI Build Workflow, code:block1 (pnpm create next-app@latest [app-name] --typescript --tailwi), Stage 1 — Requirements, Stage 2 — Architecture, Stage 3 — Frontend Prototype, Stage 4 — API Spec, Stage 5 — Database, Stage 6 — Connect Frontend (+3 more)

### Community 17 - "Community 17"
Cohesion: 0.17
Nodes (11): Acceptance Criteria, Astro template, Build Contract: Issue #7 — Brand Pages, CMS — `brand-pages` collection, Definition of Done, Dependencies Satisfied, Design Reference, Field Specification — `brand-pages` (+3 more)

### Community 18 - "Community 18"
Cohesion: 0.17
Nodes (11): Acceptance Criteria, Access Control (placeholder for #2; tightened in #6), Build Contract: Issue #2 — Pricing Data Collection, code:ts (access: {), Definition of Done, Dependencies Satisfied, Design Reference, Field Specification (+3 more)

### Community 19 - "Community 19"
Cohesion: 0.17
Nodes (11): Acceptance Criteria, Astro template, Build Contract: Issue #6 — Educational Guides, CMS — `educational-guides` collection, Definition of Done, Dependencies Satisfied, Design Reference, Field Specification — `educational-guides` (+3 more)

### Community 20 - "Community 20"
Cohesion: 0.17
Nodes (11): Acceptance Criteria, Astro template, Build Contract: Issue #5 — Buyer Guides, CMS — `buyer-guides` collection, Definition of Done, Dependencies Satisfied, Design Reference, Field Specification — `buyer-guides` (+3 more)

### Community 21 - "Community 21"
Cohesion: 0.17
Nodes (11): Acceptance Criteria, Astro template, Build Contract: Issue #4 — Review Articles, CMS — `review-articles` collection, Definition of Done, Dependencies Satisfied, Design Reference, Field Specification — `review-articles` (+3 more)

### Community 22 - "Community 22"
Cohesion: 0.18
Nodes (10): Actors, Constraints, Content architecture, Editor, Features in scope for v1, Separation of views, StoveGuard.us.com — Requirements Document, Super Admin (+2 more)

### Community 23 - "Community 23"
Cohesion: 0.18
Nodes (10): Acceptance Criteria, Build Contract: Issue #10 — SEO Foundation, Definition of Done, Dependencies Satisfied, JSON-LD, Meta / canonical / OG, Scope, Sitemap + robots (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.18
Nodes (10): Acceptance Criteria, Build Contract: Issue #8 — Media Collection, code:ts (upload: {), Definition of Done, Dependencies Satisfied, Design Reference, Field / Upload Specification, Hooks (+2 more)

### Community 25 - "Community 25"
Cohesion: 0.2
Nodes (10): 3.1 Top-level structure, 3.2 Why this structure, specifically, 3.3 The ~40-article launch list (prioritized), 3. The Silo Architecture, code:block1 (stoveguard.us.com/), Silo 1: Brands, Silo 2: Comparisons, Silo 3: Buyer's Guides (+2 more)

### Community 26 - "Community 26"
Cohesion: 0.2
Nodes (9): Activation Notes, Evaluation: Issue #11 — Round 1, Failing, Feedback for Generator, Findings, Minor Notes (non-blocking), Overall: PASS, Passing (+1 more)

### Community 27 - "Community 27"
Cohesion: 0.39
Nodes (8): escapeHtml(), LexicalNode, LexicalRichText, lexicalToHtml(), renderChildren(), renderNode(), renderText(), safeHref()

### Community 28 - "Community 28"
Cohesion: 0.22
Nodes (8): Evaluation: Issue #9 — Round 1, Failing, Feedback for Generator, Findings, Minor Notes (non-blocking), Overall: PASS, Passing, Scores

### Community 29 - "Community 29"
Cohesion: 0.22
Nodes (8): Evaluation: Issue #4 — Round 1, Failing, Feedback for Generator, Findings, Minor Notes (non-blocking), Overall: PASS, Passing, Scores

### Community 30 - "Community 30"
Cohesion: 0.22
Nodes (8): Evaluation: Issue #10 — Round 1, Failing, Feedback for Generator, Findings, Minor Notes (non-blocking), Overall: PASS, Passing, Scores

### Community 31 - "Community 31"
Cohesion: 0.22
Nodes (8): Evaluation: Issue #3 — Round 1, Failing, Feedback for Generator, Findings, Minor Notes (non-blocking), Overall: PASS, Passing, Scores

### Community 32 - "Community 32"
Cohesion: 0.22
Nodes (8): Evaluation: Issue #6 — Round 1, Failing, Feedback for Generator, Findings, Minor Notes (non-blocking), Overall: PASS, Passing, Scores

### Community 33 - "Community 33"
Cohesion: 0.22
Nodes (8): Evaluation: Issue #8 — Round 1, Failing, Feedback for Generator, Findings, Minor Notes (non-blocking), Overall: PASS, Passing, Scores

### Community 34 - "Community 34"
Cohesion: 0.22
Nodes (8): Evaluation: Issue #5 — Round 1, Failing, Feedback for Generator, Findings, Independent Code Review (the "codex review" layer), Overall: PASS, Passing, Scores

### Community 35 - "Community 35"
Cohesion: 0.22
Nodes (8): Evaluation: Issue #7 — Round 1, Failing, Feedback for Generator, Findings, Minor Notes (non-blocking), Overall: PASS, Passing, Scores

### Community 36 - "Community 36"
Cohesion: 0.22
Nodes (8): Evaluation: Issue #2 — Round 1, Failing, Feedback for Generator, Findings, Minor Notes (non-blocking), Overall: PASS, Passing, Scores

### Community 37 - "Community 37"
Cohesion: 0.22
Nodes (8): Evaluation: Issue #16 — Round 1, Failing, Feedback for Generator, Findings, Minor Notes (non-blocking), Overall: PASS, Passing, Scores

### Community 38 - "Community 38"
Cohesion: 0.25
Nodes (7): Acceptance Criteria, Build Contract: Issue #9 — Homepage & Navigation, Definition of Done, Dependencies Satisfied, Design Reference, Scope, Technical Constraints

### Community 39 - "Community 39"
Cohesion: 0.25
Nodes (7): Acceptance Criteria, Build Contract: Issue #16 — Interactive Comparison Tool, Definition of Done, Dependencies Satisfied, Design Reference, Scope, Technical Constraints

### Community 40 - "Community 40"
Cohesion: 0.29
Nodes (6): DELETE, GET, OPTIONS, PATCH, POST, PUT

### Community 41 - "Community 41"
Cohesion: 0.29
Nodes (6): Acceptance Criteria, Build Contract: Issue #11 — GA4 Tracking, Definition of Done, Dependencies Satisfied, Scope, Technical Constraints

### Community 42 - "Community 42"
Cohesion: 0.4
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 43 - "Community 43"
Cohesion: 0.5
Nodes (3): dirname, filename, nextConfig

## Knowledge Gaps
- **394 isolated node(s):** `target`, `link`, `href`, `url`, `cta` (+389 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `stoveguard.us.com — Full Content Blueprint` connect `Build Harness Agents` to `Community 25`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Why does `3. The Silo Architecture` connect `Community 25` to `Build Harness Agents`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._
- **What connects `target`, `link`, `href` to the rest of the system?**
  _394 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CMS & Editorial Roles` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Build Harness Agents` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Site Stack & SEO` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Design System` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._