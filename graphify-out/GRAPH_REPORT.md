# Graph Report - .  (2026-05-13)

## Corpus Check
- Corpus is ~16,971 words - fits in a single context window. You may not need a graph.

## Summary
- 14 nodes · 12 edges · 5 communities (3 shown, 2 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.9)
- Token cost: 24,919 input · 1,498 output

## Community Hubs (Navigation)
- [[_COMMUNITY_CMS & Editorial Roles|CMS & Editorial Roles]]
- [[_COMMUNITY_Build Harness Agents|Build Harness Agents]]
- [[_COMMUNITY_Site Stack & SEO|Site Stack & SEO]]
- [[_COMMUNITY_Design System|Design System]]
- [[_COMMUNITY_Visitor Role|Visitor Role]]

## God Nodes (most connected - your core abstractions)
1. `StoveGuard.us.com` - 4 edges
2. `Autonomous Build Harness` - 4 edges
3. `Payload CMS` - 3 edges
4. `Editor` - 2 edges
5. `Lemkus Design System` - 2 edges
6. `Designer Agent` - 2 edges
7. `Super Admin` - 1 edges
8. `Astro` - 1 edges
9. `Pricing Data Collection` - 1 edges
10. `Orchestrator Agent` - 1 edges

## Surprising Connections (you probably didn't know these)
- `StoveGuard.us.com` --semantically_similar_to--> `Lemkus Design System`  [EXTRACTED] [semantically similar]
  PRD.md → DESIGN.md
- `StoveGuard.us.com` --references--> `Silo Architecture`  [INFERRED]
  PRD.md → stoveguard-us-com-blueprint.md
- `StoveGuard.us.com` --implements--> `Astro`  [EXTRACTED]
  PRD.md → CLAUDE.md
- `Designer Agent` --references--> `Lemkus Design System`  [EXTRACTED]
  harness/agents/designer.md → DESIGN.md
- `Autonomous Build Harness` --references--> `Designer Agent`  [EXTRACTED]
  harness/HARNESS.md → harness/agents/designer.md

## Communities (5 total, 2 thin omitted)

### Community 0 - "CMS & Editorial Roles"
Cohesion: 0.5
Nodes (4): Editor, Payload CMS, Pricing Data Collection, Super Admin

### Community 1 - "Build Harness Agents"
Cohesion: 0.5
Nodes (4): Evaluator Agent, Generator Agent, Orchestrator Agent, Autonomous Build Harness

### Community 2 - "Site Stack & SEO"
Cohesion: 0.67
Nodes (3): Silo Architecture, Astro, StoveGuard.us.com

## Knowledge Gaps
- **8 isolated node(s):** `Super Admin`, `Visitor (Contributor)`, `Astro`, `Pricing Data Collection`, `Orchestrator Agent` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `StoveGuard.us.com` connect `Site Stack & SEO` to `CMS & Editorial Roles`, `Design System`?**
  _High betweenness centrality (0.577) - this node is a cross-community bridge._
- **Why does `Lemkus Design System` connect `Design System` to `Site Stack & SEO`?**
  _High betweenness centrality (0.449) - this node is a cross-community bridge._
- **Why does `Designer Agent` connect `Design System` to `Build Harness Agents`?**
  _High betweenness centrality (0.410) - this node is a cross-community bridge._
- **What connects `Super Admin`, `Visitor (Contributor)`, `Astro` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._