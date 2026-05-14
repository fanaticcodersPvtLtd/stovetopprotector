# Build Contract: Issue #10 — SEO Foundation

> GitHub issue #10. `has_ui: false` — no Designer phase. Sourced from `PRD.md`, `plans/stoveguard-site.md` (Phase 3), `stoveguard-us-com-blueprint.md` §6.

## Scope

Site-wide technical SEO for the Astro frontend:

1. **JSON-LD structured data** appropriate to each page type
2. **Meta tags** — canonical URL + Open Graph, generated from content fields
3. **XML sitemap** — every published content URL
4. **robots.txt** — permissive crawl, sitemap reference

Per plan Phase 3:
> Add structured data (JSON-LD) appropriate to each page type (Article, FAQPage for brand pages, ItemList for buyer guides). Generate meta tags (title, description, OG image) from the structured fields on each content type. Auto-generate XML sitemap and robots.txt.

Per blueprint §6.2 (schema markup) + §6.5 (indexing): canonical tags on every page, permissive robots.txt, sitemap submitted day one.

## Acceptance Criteria

### JSON-LD
- [ ] `web/src/lib/seo.ts` exports JSON-LD builder functions, each returning a plain object
- [ ] `Article` JSON-LD for comparison-articles, review-articles, educational-guides (headline, description, datePublished, author = "StoveGuard Reviews")
- [ ] `ItemList` JSON-LD for buyer-guides (the ranked products as list items)
- [ ] `FAQPage` JSON-LD emitted on any page with a non-empty `faqs` array (comparison, review, educational, buyer, brand)
- [ ] review-articles also emit a `Review` JSON-LD with `reviewRating` from `ratingOutOf5`
- [ ] JSON-LD injected via a `<script type="application/ld+json">` — serialized with safe escaping (no `</script>` breakout)
- [ ] `BaseLayout` accepts a `jsonLd` prop (object or array of objects) and renders it

### Meta / canonical / OG
- [ ] `BaseLayout` renders a `<link rel="canonical">` — absolute URL built from `SITE_URL` + the current path
- [ ] `BaseLayout` renders Open Graph tags: `og:title`, `og:description`, `og:type`, `og:url`, `og:site_name`; Twitter card tags
- [ ] Each content template passes its real title/description into `BaseLayout` (already happening — verify canonical/OG pick them up)
- [ ] `noindex` prop still works (404 page) and suppresses nothing else

### Sitemap + robots
- [ ] `web/src/pages/sitemap.xml.ts` — an Astro endpoint that emits valid XML listing every published URL: `/`, all 5 index pages, every comparison/review/buyer/educational/brand detail page
- [ ] Sitemap URLs are absolute (built from `SITE_URL`)
- [ ] `web/public/robots.txt` — allows all crawlers, references the sitemap, may disallow query-param/filter paths
- [ ] `pnpm --filter web build` emits `sitemap.xml` and `robots.txt` into `dist/`

### Verification
- [ ] Built comparison/review/guide/buyer/brand pages each contain a valid `application/ld+json` block of the correct `@type`
- [ ] `dist/sitemap.xml` is well-formed XML and contains all seeded content URLs
- [ ] `dist/robots.txt` present, references sitemap
- [ ] Every page has exactly one `<link rel="canonical">`
- [ ] No regression — all pages still build, zero console errors

## Technical Constraints

- Stack: Astro 6 SSG — established
- `SITE_URL` from `web/.env` (`http://localhost:4321` dev; the build uses `astro.config.mjs` `site`)
- Prefer Astro's built-in `Astro.site` / `Astro.url` for absolute URL construction
- JSON-LD serialization MUST escape `<` to `<` (or equivalent) to prevent `</script>` injection from CMS content
- Do not break any existing template
- `seo.ts` is pure functions — no fetching

## Dependencies Satisfied

- Issue #3 — Astro `web/` foundation, `BaseLayout`, `payload.ts` with all content types
- Issue #9 — homepage + all index pages exist (sitemap needs to list them)
- Issues #4–#7 — all content collections exist with the fields JSON-LD reads (title, publishedAt, faqs, ratingOutOf5, rankedProducts)

## Definition of Done

1. All acceptance criteria verified — JSON-LD per page type, canonical + OG on every page, valid sitemap.xml, robots.txt
2. Evaluator grades: Functionality ≥ 8, Design Fidelity = 10 (auto, no UI), Data Integrity ≥ 9, Code Quality ≥ 7
3. No regression in completed issues
4. Clean commit — no secrets, no `web/dist/`
