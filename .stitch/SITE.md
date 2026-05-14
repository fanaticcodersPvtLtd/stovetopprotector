# .stitch/SITE.md — Site Map & Design Coverage

Stitch project `6849064886324327137` has the full site visually designed (~30 screens). This tracks which routes have designs and which harness issue consumes them.

## Routes & Design Status

| Route | Page type | Issue | Stitch screen | Built? |
|---|---|---|---|---|
| `/compare/[slug]` | Comparison article | #3 | `comparison-article` ✅ downloaded | in progress |
| `/` | Homepage | #9 | homepage (2 variants) | no |
| `/guides/[slug]` | Educational guide | #6 | educational-guide ✅ downloaded | in progress |
| `/best/[slug]` | Buyer guide | #5 | buyer-guide ✅ downloaded | in progress |
| `/reviews/[slug]` | Review article | #4 | review-article ✅ downloaded | in progress |
| `/brands/[slug]` | Appliance brand page | #7 | brand-page-ge (3 variants) | no |
| `/brands` | Brand hub | #9 | brand-hub | no |
| `/compare` | Comparison index | #9 | comparisons-index | no |
| `/articles` | All articles index | #9 | articles-index | no |
| `/compare` (tool) | Interactive comparison tool | #16 | comparison-tool | no |
| `/profile` | User profile | #14 | user-profile | no |
| `/terms`, `/privacy`, `/disclaimer`, `/about`, `/contact` | Legal/info | #9 area | legal screens | no |

## Design System

`.stitch/DESIGN.md` — "The Authoritative Editorial". Burnt orange `#a33900` + warm off-white, Plus Jakarta Sans + Source Serif.

## Notes

- All screens are DESKTOP, 2560px wide. Mobile variants not yet designed — Generator makes templates responsive from the desktop reference.
- Screen IDs for not-yet-downloaded pages are in `.stitch/metadata.json` → `availableScreensNotDownloaded`. Future Designer runs download from there instead of generating.
- Project title says "Homepage" but it contains the whole site.
