# Build Contract: Issue #18 — Social Sharing & Auto-Posting

> GitHub issue #18. Sourced from `PRD.md`, `plans/stoveguard-site.md`.

## Scope — split into buildable now vs. credential-gated

Per PRD §"Features in scope":
> Social media auto-posting — automatic distribution when articles are published, plus social sharing buttons on all articles.

**Two halves:**
1. **Share buttons** (no credentials needed) — share-to-social buttons on every article. Fully buildable now.
2. **Auto-posting** (needs `TWITTER_*`, `FACEBOOK_PAGE_ACCESS_TOKEN`, `PINTEREST_ACCESS_TOKEN`) — a Payload `afterChange` hook that posts to social when an article is published. **The code is built and wired; it no-ops cleanly when the keys are absent.** Real posting activates when the keys are set.

## Acceptance Criteria

### Share buttons (fully delivered)
- [ ] `web/src/components/ShareButtons.astro` — share-to X/Twitter, Facebook, Pinterest, and a copy-link button
- [ ] Each share link is a correct intent URL built from the page's canonical URL + title (X: `twitter.com/intent/tweet`, Facebook: `facebook.com/sharer`, Pinterest: `pinterest.com/pin/create`)
- [ ] Copy-link button copies the canonical URL to the clipboard (client JS, with a "copied" confirmation)
- [ ] `ShareButtons` embedded in `comparison-articles`, `review-articles`, `buyer-guides`, `educational-guides`, `brand-pages` templates
- [ ] Buttons styled consistent with the "Authoritative Editorial" system; accessible labels
- [ ] Share links open in a new tab with `rel="noopener noreferrer"`

### Auto-posting (built + gated)
- [ ] `cms/src/lib/socialPost.ts` — `autoPostArticle(payload, { title, url, platform-config })`. Reads `TWITTER_API_KEY` / `FACEBOOK_PAGE_ACCESS_TOKEN` / `PINTEREST_ACCESS_TOKEN` from env. For each platform whose credentials are present, posts; for those unset, logs a debug skip. **Never throws** — a social API failure cannot break a CMS publish.
- [ ] Wired into the `afterChange` hooks of the 5 content collections: when `status` transitions to `published`, call `autoPostArticle` (fire-and-forget)
- [ ] With **no** social keys set (current state): publishing an article logs a clean "social auto-post skipped — no credentials" and does not error
- [ ] The actual platform POST calls are implemented (correct endpoints/payloads) but only execute when their key is present — so setting the key later activates them with no code change
- [ ] `.env.example` social section already documents the keys — verify the comment notes "auto-post no-ops without these; share buttons work regardless"

### Verification
- [ ] Built article pages contain the share buttons with correct intent URLs
- [ ] Publishing an article with no social keys → clean skip log, no error, publish succeeds
- [ ] `pnpm --filter web build` succeeds
- [ ] No regression in the 17 completed issues (esp. the content collections' existing `afterChange` — `triggerDeploy` must still fire)

## Technical Constraints

- Stack: Astro 6 + Payload 3.84.1 — established
- Share buttons: pure client-side, no dependencies, intent URLs only (no SDK embeds — those hurt Core Web Vitals)
- `socialPost.ts`: env-gated per platform; each platform call wrapped so one failure doesn't block the others or the publish
- The auto-post hook must compose with the existing `afterChange` hooks (`triggerDeploy` from #3, etc.) — additive, not replacing
- Do not break completed issues

## Dependencies Satisfied

- Issue #9 — article templates exist to embed share buttons into
- Issues #3–#7 — the 5 content collections with their `afterChange` hooks
- Issue #15 — established the `notify.ts` env-gated-helper pattern that `socialPost.ts` mirrors

## Definition of Done

1. Share buttons delivered + verified on all 5 article types
2. Auto-post code built, wired, env-gated — verified it no-ops cleanly without keys
3. Evaluator grades: Functionality ≥ 8, Design Fidelity ≥ 7, Data Integrity ≥ 9, Code Quality ≥ 7
4. No regression
5. Clean commit — no secrets
6. Evaluation notes: auto-posting activates when `TWITTER_*` / `FACEBOOK_PAGE_ACCESS_TOKEN` / `PINTEREST_ACCESS_TOKEN` are provided
