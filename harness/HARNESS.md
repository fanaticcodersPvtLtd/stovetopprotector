# StoveGuard Autonomous Build Harness

> Based on [Harness Design for Long-Running Application Development](https://www.anthropic.com/engineering/harness-design-long-running-apps) by Prithvi Rajasekaran, Anthropic Labs.

## Architecture

Four-agent system with file-based communication. Each agent addresses a specific gap observed in solo implementations:

| Agent | File | Why It Exists |
|-------|------|---------------|
| **Orchestrator** | `agents/orchestrator.md` | Solo agents pick wrong issue order, skip dependencies, under-scope contracts |
| **Designer** | `agents/designer.md` | Solo agents produce generic UI. Stitch MCP forces deliberate visual design before code |
| **Generator** | `agents/generator.md` | Implements features. Single continuous session — Opus 4.6 doesn't need sprint decomposition |
| **Evaluator** | `agents/evaluator.md` | Solo agents praise their own work. Separate QA catches real bugs via Playwright |

### What the article taught us

1. **Generator-evaluator separation** is the highest-leverage change. Agents can't honestly evaluate their own work.
2. **Opus 4.6 removed context anxiety** — no need for context resets or sprint decomposition. Single continuous sessions with compaction.
3. **Every harness component encodes an assumption about model limitations.** If the model can do it alone, remove the component.
4. **Explicit grading criteria guide behavior** even before evaluation feedback reaches the generator.
5. **File-based communication** between agents — one writes, another reads and responds.
6. **Build contracts before code** — negotiated agreement on what "done" looks like prevents scope drift.

## The Loop

```
WHILE open issues remain in state.json:

  ORCHESTRATOR:
    1. Read state.json → find next unblocked issue from execution_order
    2. Fetch issue from GitHub (gh issue view {n})
    3. Write build contract → harness/contracts/issue-{n}.md
    4. Update state.json → phase: "design" or "build", active_issue: n

  DESIGNER (only if issue has_ui: true):
    5. Read build contract
    6. Read .stitch/DESIGN.md for visual tokens
    7. Generate page design via Stitch MCP
    8. Save to .stitch/designs/{page}.html and .stitch/designs/{page}.png
    9. Update state.json → phase: "build"

  GENERATOR:
    10. Read build contract + Stitch design (if exists)
    11. Implement the feature
    12. Self-test (run dev server, check basic functionality)
    13. Update state.json → phase: "evaluate", round: 1

  EVALUATOR:
    14. Read build contract acceptance criteria
    15. Start dev server, test via Playwright (or manual URL verification)
    16. Grade against four criteria with hard thresholds
    17. Write evaluation → harness/evaluations/issue-{n}-round-{m}.md
    18. IF all pass → update state.json, close GitHub issue, move to next
    19. IF any fail → write specific feedback, Generator retries (max 3 rounds)
    20. IF 3 rounds exhausted → mark issue as failed, log to state.json, move on
```

## Grading Criteria

Adapted from the article's frontend design + full-stack criteria for a content/review site:

### 1. Functionality (threshold: 8/10)

Does the feature work as specified? Evaluator walks through each acceptance criterion from the GitHub issue and tests it. Binary per criterion — it either works or it doesn't. Score = (passing criteria / total criteria) * 10.

**Fail examples from article:** "Tool only places tiles at drag start/end points instead of filling the region." "Delete key handler requires both selection AND selectedEntityId but clicking only sets one."

### 2. Design Fidelity (threshold: 7/10)

Does the implementation match the Stitch design? Compare the live page against `.stitch/designs/{page}.png`. Check: layout structure, color usage, typography hierarchy, spacing consistency, responsive behavior.

Skipped for non-UI issues (scored 10/10 automatically).

### 3. Data Integrity (threshold: 9/10)

Do CMS collections have correct fields and types? Do relationship references resolve? Does pricing data propagate to all referencing pages? Are hooks firing correctly? Is access control enforced?

Highest threshold because data bugs cascade silently.

### 4. Code Quality (threshold: 7/10)

TypeScript types correct. No `any` types where avoidable. No security vulnerabilities (XSS, injection). Follows Astro SSG/SSR patterns. Follows Payload collection patterns. No dead code or debug artifacts.

## Build Contract Format

Each contract in `harness/contracts/issue-{n}.md`:

```markdown
# Build Contract: Issue #{n} — {title}

## Scope
What this issue delivers. Copied from issue body "What to build" section.

## Acceptance Criteria
Copied verbatim from GitHub issue. These are the evaluator's test cases.

## Design Reference
- Stitch design: .stitch/designs/{page}.html (if applicable)
- Screenshot: .stitch/designs/{page}.png (if applicable)
- Design system: .stitch/DESIGN.md

## Technical Constraints
- Stack: Astro + Payload CMS + Postgres
- Existing patterns to follow (from earlier issues)
- Files that must not be broken

## Dependencies Satisfied
Which issues are already complete and what they provide.

## Definition of Done
All acceptance criteria pass via Playwright/manual testing.
Evaluator grades all four criteria above threshold.
No regressions in previously completed issues.
```

## Evaluation Report Format

Each report in `harness/evaluations/issue-{n}-round-{m}.md`:

```markdown
# Evaluation: Issue #{n} — Round {m}

## Scores
| Criterion | Score | Threshold | Pass? |
|-----------|-------|-----------|-------|
| Functionality | x/10 | 8 | YES/NO |
| Design Fidelity | x/10 | 7 | YES/NO |
| Data Integrity | x/10 | 9 | YES/NO |
| Code Quality | x/10 | 7 | YES/NO |

## Overall: PASS / FAIL

## Findings
### Passing
- [criterion]: what worked

### Failing
- [criterion]: FAIL — specific description of what's broken, where in code, how to reproduce

## Feedback for Generator
Concrete list of what to fix. No vague suggestions — file paths, line numbers, expected vs actual behavior.
```

## Running the Harness

### Autonomous Mode (recommended)

Invoke with `/loop`:
```
/loop Build the next StoveGuard issue using the harness at harness/HARNESS.md
```

Each loop iteration:
1. Reads `harness/state.json` to determine current phase
2. Executes the appropriate agent for that phase
3. Updates state and prepares for next iteration

### Human-in-the-Loop Mode

Run one issue at a time:
```
Build issue #1 using the harness at harness/HARNESS.md
```

Review the build contract before Generator starts. Review evaluation before closing the issue.

### Resuming After Interruption

State persists in `state.json`. On resume:
- If `phase: "build"` → Generator picks up from the contract
- If `phase: "evaluate"` → Evaluator runs QA
- If `phase: "idle"` → Orchestrator picks next issue

## File Structure

```
harness/
  HARNESS.md                    # This document
  state.json                    # Current state + issue queue + history
  agents/
    orchestrator.md             # Picks issues, writes contracts
    designer.md                 # Stitch MCP visual design
    generator.md                # Implements features
    evaluator.md                # Playwright QA + grading
  contracts/
    issue-{n}.md                # Build contract per issue
  evaluations/
    issue-{n}-round-{m}.md      # QA report per round
```

## Cost & Performance Tracking

Every history entry in `state.json` must include:
- `duration_seconds` — wall-clock time for the agent phase
- `cost_usd` — estimated from token counts (input * $15/MTok + output * $75/MTok for Opus 4.6)
- `tokens_input` / `tokens_output` — from API response metadata
- `testing_mode` — `"playwright"` or `"manual_degraded"` (evaluator only)

This data enables the article's principle: "re-evaluate which harness components remain load-bearing." If the evaluator consistently passes round 1 with high scores, the Generator may be reliable enough to drop the evaluator. If the Designer adds $5 per issue but Design Fidelity scores don't improve, the Designer may not be load-bearing.

Review cost data after every 5 issues to decide whether to simplify the harness.

## Cost Expectations

Based on article benchmarks (DAW app: $124 over 4 hours for ~16 features):

| Component | Estimated per issue | Notes |
|-----------|-------------------|-------|
| Orchestrator | ~$0.50 | Quick — reads state, writes contract |
| Designer | ~$2-5 | Stitch API calls + prompt |
| Generator | ~$15-40 | Main build work, varies by complexity |
| Evaluator | ~$3-5 | Playwright testing + grading |
| **Total per issue** | **~$20-50** | Simple CMS issues cheaper, UI-heavy issues costlier |
| **Full 19-issue build** | **~$400-900** | Rough estimate |

## When to Remove Components

Per the article: "re-evaluate which harness components remain load-bearing."

- **Remove Designer** if: Stitch MCP is unavailable, or the site adopts a component library where visual design decisions are pre-made.
- **Remove Evaluator** if: Generator consistently passes all criteria on first round (check history in state.json).
- **Remove Orchestrator** if: Running issues manually one at a time in known order.
- **Never remove** the build contract step — it's the cheapest component and prevents the most scope drift.
