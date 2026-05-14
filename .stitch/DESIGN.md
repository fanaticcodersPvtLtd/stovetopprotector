# .stitch/DESIGN.md — Active Visual System

> **This file reflects what the Stitch project actually built**, extracted from the exported HTML/Tailwind config of project `6849064886324327137` ("The Authoritative Editorial" design system).
>
> **Divergence note:** the repo-root `DESIGN.md` describes a different system ("Lemkus" — parchment/charcoal/gold sneaker-store aesthetic). The team evolved past it inside Stitch. **The Generator follows THIS file + the Stitch screenshots**, not repo-root `DESIGN.md`.

## Aesthetic

"The Authoritative Editorial" — a premium investigative-journalism look. Burnt-orange accent against warm off-white, near-black text, generous whitespace, no heavy 1px borders for sectioning (uses tonal background shifts instead). Editorial, trustworthy, scannable.

## Color Tokens

| Token | Hex | Role |
|---|---|---|
| `primary` | `#a33900` | Burnt orange — primary accent, CTAs, "recommended" markers, links |
| `primary-container` | `#cc4900` | Brighter orange — gradient end, hover |
| `accent-bright` | `#EA580C` | Project override primary — bright orange highlight |
| `surface` / page bg | `#faf9f7` | Warm off-white canvas |
| `surface-warm` | `#FFF7ED` | Warmer panel tint (verdict box, callouts) |
| `surface-container` | `#F7F6F3` / `#efeeec` | Sectional background shift |
| `surface-card` | `#ffffff` | Cards / tables that "pop" |
| `on-surface` (text) | `#1a1c1b` / `#18181B` | Near-black body + headline text |
| `text-muted` | `#57534E` / `#71717A` | Secondary text, metadata, captions |
| `border-subtle` | `#E4E4E7` | Faint dividers / table lines (use sparingly) |
| `border-faint` | `#A1A1AA` | Slightly stronger faint border |
| `on-primary` | `#ffffff` | Text on orange |
| dark sections | `#1C1917` / `#18181B` | Inverted CTA / footer blocks |

## Typography

| Role | Font | Notes |
|---|---|---|
| Display + Headlines + UI | **Plus Jakarta Sans** | Bold, tight tracking. The structural "anchor" |
| Body / long-form | **Source Serif** (Source Serif 4) | Serif = editorial authority, used for article prose |
| Labels / metadata | Plus Jakarta Sans | Uppercase, letter-spaced for "data" feel |
| Icons | Material Symbols Outlined | |

Load via Google Fonts: `Plus+Jakarta+Sans`, `Source+Serif+4`, `Material+Symbols+Outlined`.

## Structural Rules

- **No 1px solid borders for sectioning** — separate sections with background tone shifts (`surface` ↔ `surface-container`).
- Tables: light zebra striping, faint `#E4E4E7` rules only where data legibility needs it.
- Generous whitespace between major editorial sections (64px+).
- Long-form text left-aligned, never centered.
- Dark inverted blocks (`#1C1917`) for the bottom CTA and footer.
- Comparison spec table sits high on the page, scannable, every row citable.
- Right-hand sticky TOC sidebar on long article pages.

## For the Generator

- Tailwind config: port the `tailwind.config` color tokens from `.stitch/designs/comparison-article.html` directly into `web/tailwind.config` (or `@theme` in Tailwind v4).
- Match the Stitch screenshot `.stitch/designs/comparison-article.png` for layout, spacing, type hierarchy.
- The HTML in `.stitch/designs/` is a static reference — extract structure + classes, do not ship it verbatim (it has no data binding).
