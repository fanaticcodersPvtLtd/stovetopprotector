# Build Contract: Issue #8 — Media Collection

> Status: GitHub issues not filed. Contract sourced from `PRD.md`, `plans/stoveguard-site.md` (Phase 2), and `stoveguard-us-com-blueprint.md` §6.3/§6.4.

## Scope

Expand the template stub `cms/src/collections/Media.ts` into a production image collection. Media serves two purposes per PRD: images embedded in articles, and OG (social share) images. The blueprint adds hard image-SEO constraints: WebP format, small file sizes, explicit dimensions, descriptive alt text.

Per PRD §"Media":
> Image uploads for articles and OG images.

Per plan Phase 2:
> Media collection supports image uploads and images can be embedded in articles and used as OG images.

Per blueprint §6.3 (Image SEO):
> All images WebP, <150KB each, explicit width/height on `<img>` tags. Alt text descriptive.

## Acceptance Criteria

- [ ] `cms/src/collections/Media.ts` exports `CollectionConfig` slug `media` with `upload` configured
- [ ] Uploads restricted to image MIME types only (`image/*`) — non-image upload rejected
- [ ] `alt` field required (already present — keep)
- [ ] `caption` field (optional text) — shown under image when rendered in articles
- [ ] `credit` field (optional text) — attribution for third-party images (PRD allows embedded third-party content)
- [ ] Image sizes auto-generated on upload: `thumbnail` (400w), `card` (768w), `feature` (1200w), `og` (1200x630, cropped)
- [ ] All generated sizes output as WebP
- [ ] Focal point enabled (`focalPoint: true`) so `og` crop stays sensible
- [ ] Original upload also stored; `feature` and `og` cover render + social needs
- [ ] Admin panel `/admin/collections/media` reachable (200)
- [ ] Uploading an image via admin or REST produces all 4 sizes; URLs resolve (200)
- [ ] Postgres `media` table has columns for each size (`sizes_thumbnail_*`, `sizes_card_*`, `sizes_feature_*`, `sizes_og_*`) plus `caption`, `credit`, focal point columns
- [ ] REST `GET /api/media` → 200 paginated envelope
- [ ] `access.read` is public (`() => true`) — SSG build fetches images. Already present — keep
- [ ] Write access placeholder: `({ req: { user } }) => Boolean(user)` with `TODO(issue-6)` comment, consistent with `pricing-data`
- [ ] `payload-types.ts` regenerated, contains `Media` interface with `sizes` shape
- [ ] Uploaded files land in a gitignored dir (`media/` is already in `.gitignore`); confirm `staticDir` resolves there
- [ ] Server starts cleanly — no errors

## Field / Upload Specification

```ts
upload: {
  staticDir: path.resolve(dirname, '../../media'),   // repo-root /media, gitignored
  mimeTypes: ['image/*'],
  focalPoint: true,
  imageSizes: [
    { name: 'thumbnail', width: 400,  formatOptions: { format: 'webp', options: { quality: 80 } } },
    { name: 'card',      width: 768,  formatOptions: { format: 'webp', options: { quality: 80 } } },
    { name: 'feature',   width: 1200, formatOptions: { format: 'webp', options: { quality: 82 } } },
    { name: 'og',        width: 1200, height: 630, crop: 'center',
      formatOptions: { format: 'webp', options: { quality: 82 } } },
  ],
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `alt` | text | yes | Descriptive — blueprint: "StoveGuard Premium installed on a GE 5-burner gas stove", not "stove image 2" |
| `caption` | text | no | Optional visible caption under image in article render |
| `credit` | text | no | Optional attribution for third-party/embedded images |

`admin.useAsTitle`: `alt`.

## Hooks

None required for Issue #8. (Sharp resizing is handled by Payload's `upload.imageSizes` config, not a hook.)

## Design Reference

N/A — `has_ui: false`. Admin UI provided by Payload.

## Technical Constraints

- Stack: Payload CMS 3.84.1 + Postgres 16 + Next.js 16, `sharp` already installed (Issue #1)
- `dirname` pattern: follow `payload.config.ts` — `path.dirname(fileURLToPath(import.meta.url))`
- Do not modify `Users.ts` or `PricingData.ts`
- `staticDir` must resolve to repo-root `media/` (already gitignored) — not inside `cms/`
- Generator restarts dev server, uploads a real test image, confirms all 4 sizes generate as WebP

## Dependencies Satisfied

- Issue #1 (Payload scaffold) — provides: `sharp`, Postgres, payload.config.ts, admin at :3001, Media stub
- Issue #2 (pricing-data) — provides: established collection + placeholder-access pattern to mirror

## Definition of Done

1. All acceptance criteria verified — upload test produces 4 WebP sizes, URLs resolve
2. Postgres `media` table has size columns (verify: `\d media`)
3. Evaluator grades: Functionality ≥ 8, Data Integrity ≥ 9, Code Quality ≥ 7, Design Fidelity = 10 (auto)
4. No regression — admin loads, `users` / `pricing-data` still work
5. Clean commit, no secrets, uploaded test image not staged (gitignored `media/`)
