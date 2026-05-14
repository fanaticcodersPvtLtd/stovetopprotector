# Evaluation: Issue #8 — Round 1

> Testing mode: `manual_degraded` — no UI, no Playwright. Verified via REST upload + file URL resolution + Postgres introspection + dev server log.

## Scores

| Criterion | Score | Threshold | Pass? |
|-----------|-------|-----------|-------|
| Functionality | 10/10 | 8 | YES |
| Design Fidelity | 10/10 | 7 | YES (auto — no UI) |
| Data Integrity | 10/10 | 9 | YES |
| Code Quality | 9/10 | 7 | YES |

## Overall: PASS

## Findings

### Passing

**Functionality — all acceptance criteria verified:**
- `Media.ts` exports `CollectionConfig` slug `media` with full `upload` config
- Image upload via REST → 200, doc returned with `sizes` object
- All 4 image sizes generated: `thumbnail` 400x250, `card` 768x480, `feature` 1200x750, `og` 1200x630 (center-cropped)
- All generated sizes are WebP (`mimeType: image/webp`)
- All sizes well under blueprint's 150KB ceiling: thumbnail 9.9KB, card 22KB, feature 34KB, og 33.7KB
- All 5 file URLs (original + 4 sizes) resolve 200 with correct content-type
- MIME restriction works: `.txt` upload rejected ("field is invalid: file")
- `alt` required, `caption` + `credit` optional — all three persist correctly
- Focal point enabled: `focalX`/`focalY` default to 50/50
- Admin route `/admin/collections/media` reachable; `GET /api/media` → 200 paginated envelope
- Access control: unauthenticated upload → "You are not allowed to perform this action."; public read → 200
- Delete → "Deleted successfully.", `totalDocs` back to 0

**Data Integrity:**
- Postgres `media` table has all expected columns: `alt`, `caption`, `credit`, `focal_x`, `focal_y`, and the full `sizes_{thumbnail,card,feature,og}_{url,width,height,mime_type,filesize,filename}` set
- Index on `sizes_card_filename` (and siblings) auto-created
- `payload-types.ts` regenerated: `Media` interface includes `sizes?`, `caption?`, `credit?`, `focalX?`/`focalY?`; `MediaSelect` mirrors it
- Uploaded files land in repo-root `media/` — confirmed gitignored (`git check-ignore media/` passes), so test artifacts never stage

**Code Quality:**
- `dirname` resolved via the same `fileURLToPath(import.meta.url)` pattern as `payload.config.ts`
- `staticDir` correctly resolves three levels up from `cms/src/collections/` to repo-root `media/`
- Placeholder write access carries explicit `TODO(issue-6)` comment, consistent with `pricing-data`
- No hooks (correct — Sharp resizing is declarative via `imageSizes`, not hook logic)
- No dead code, no debug artifacts

### Failing

None.

## Minor Notes (non-blocking)

- `code_quality` docked 1 point: `og` size uses `crop: 'center'` — sensible default, but once real product photos are uploaded an editor should set focal points per-image so the 1200x630 social crop doesn't decapitate the subject. Not a code defect; flag for content-ops.
- `thumbnailURL` came back `null` in the upload response — Payload only populates that when an `adminThumbnail` is configured. Not required by the contract; the `thumbnail` size in `sizes` is what matters. No action.
- Dev server log clean on startup — only the expected `WARN: No email adapter` (Resend → Issue #15).

## Feedback for Generator

No fixes required. Issue #8 passes round 1. Close and advance to Issue #6 (Educational Guides) per execution order.
