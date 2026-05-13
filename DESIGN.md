# Design System: Lemkus
**Source URL:** https://lemkus.com/blogs/news
**Platform:** Shopify (Theme v45)

---

## 1. Visual Theme & Atmosphere

Lemkus exudes a **bold, streetwear-editorial** aesthetic rooted in Cape Town sneaker culture. The design language is confident and typographically driven — massive condensed display headlines collide with warm, humanist serif body text against a creamy parchment canvas. The overall mood is **curated and gallery-like**, treating sneaker releases and cultural stories with the reverence of a fashion magazine.

The site operates on a striking **inverted dual-mode system**: the primary palette uses a warm ivory background with near-black foreground (the "soft" mode), while the blog/culture section flips this entirely — plunging into a deep charcoal background with ivory text. This inversion signals a shift from commerce to storytelling and gives the culture section a distinct, immersive identity.

Interactions are deliberate and tactile — pill-shaped buttons feature scrolling marquee text on hover, navigation links flash to amber-gold, and a custom cursor reinforces the sense of a crafted, editorial experience. The density is moderate; generous whitespace lets the photography and typography breathe, while thin 1px borders provide structure without weight.

**Key adjectives:** Editorial, Typographic, Warm, Confident, Gallery-like, Streetwear-luxe.

---

## 2. Color Palette & Roles

### Primary Palette

| Descriptive Name | Hex Code | Functional Role |
|---|---|---|
| **Warm Parchment Ivory** | `#fdfbf5` | Primary background ("soft" mode); foreground text color in dark/blog mode. A warm, slightly yellowed white that avoids sterility. |
| **Deep Charcoal Black** | `#191919` | Primary text and border color ("dark"); becomes the background in blog/culture mode. Not pure black — retains warmth. |
| **Burnished Gold** | `#fec333` | Brand accent color. Used for the footer background, primary call-to-action buttons, and active states. The signature Lemkus color. |
| **Amber Flash** | `#f9b510` | Interactive hover state for navigation links, article titles, and pagination. A slightly deeper, warmer gold that signals interactivity. |

### Secondary & Utility Palette

| Descriptive Name | Hex Code | Functional Role |
|---|---|---|
| **Whisper Gray** | `#f6f6f6` | Neutral light background variant; used for tag pills and alternate surface contexts inside inverted sections. |
| **Dusty Rose Blush** | `#e6cac6` | Soft accent color for select decorative elements and promotional highlights. Adds femininity and range to the palette. |
| **Signal Red** | `#bf2020` | Error states, sold-out indicators, and urgent messaging. Used sparingly for maximum impact. |
| **Faded Silver** | `#b7b7b7` | Inactive pagination numbers, disabled states, and muted secondary text. Communicates "available but not current." |
| **Pure White** | `#ffffff` | Product card navigation arrows, sold-out button text, and overlay backgrounds. |

### The Inversion System

The blog/culture section swaps the two primary roles:
- **`--soft` becomes `#191919`** (dark background)
- **`--dark` becomes `#fdfbf5`** (light text/borders)

This CSS custom property swap means all components automatically adapt — borders, text, backgrounds, and pills all invert without separate dark-mode styling. Article category badges explicitly override to `--soft: #f6f6f6` and `--dark: #191919` to remain legible against the inverted background.

---

## 3. Typography Rules

Lemkus employs a deliberate **three-tier type hierarchy** that blends display impact with editorial warmth:

### Display Tier — DharmaGothicE (Condensed Sans-Serif)
- **DharmaGothicE-Bold** (`--dharma`) — Primary display headlines
- **DharmaGothicE-ExBold** (`--dharmaex`) — Maximum-impact titles (e.g., "CULTURE" section headers at ~30rem/300px)
- **Character:** Extremely tall and narrow; tightly condensed with sharp, industrial geometry. Used exclusively for headlines and display moments — never for body text. Evokes protest posters and sports typography. Always uppercase.
- **Usage:** Blog article titles (2.6rem mobile, 3rem desktop), section headings, filter panel titles (4rem), hero text.

### Editorial Tier — RecoletaAlt (Humanist Serif)
- **RecoletaAlt-Regular** (`--reco` / `--serif`) — Body serif, descriptive text
- **RecoletaAlt-Medium** (`--recomed`) — Medium-weight emphasis
- **RecoletaAlt-SemiBold** (`--recosemi`) — UI elements, buttons, navigation labels, category badges, pagination
- **Character:** Rounded, warm serif with a retro-organic quality. Soft terminals and generous curves contrast beautifully against DharmaGothic's severity. Provides approachability and editorial credibility.
- **Usage:** Button labels, cookie consent text, newsletter inputs, pagination numbers, filter labels, article category tags.

### Utility Tier — OpenSans (Neo-Grotesque Sans-Serif)
- **OpenSans-Regular** (`--sans`) — Body copy, footer links, utility text
- **OpenSans-SemiBold** (`--opensemi`) — Emphasized utility text
- **OpenSans-Bold** (`--openbold`) — Header navigation (SEARCH, ACCOUNT, WISHLIST), Cape Town time display
- **Character:** Clean, neutral, and highly legible at small sizes. Serves as the workhorse font — invisible and functional. Always uppercase in navigation contexts.
- **Usage:** Footer menu links (1.16rem), header account/search labels, product prices, size selectors.

### Supplementary
- **Inter** (Google Fonts, weights 300/400/700) — Used in supplementary contexts and third-party widget integrations.

### Sizing Philosophy
- Base font size scales fluidly: `2.66667vw` (mobile) → `1.51515vw` (tablet) → `0.73206vw` (desktop), creating a fully responsive type scale without breakpoint jumps.
- Line height is set to `1` globally — deliberately tight, reinforcing the editorial density.

---

## 4. Component Stylings

### Buttons
- **Shape:** Pill-shaped with fully rounded ends (`border-radius: 50px`). Never squared, never subtly rounded — always a complete pill.
- **Primary (CTA):** Burnished Gold (`#fec333`) background, Deep Charcoal (`#191919`) 1px border, RecoletaAlt-SemiBold text. Standard size: `11.9rem` wide × `3.9rem` tall. On blog pages, wider variants reach `18.2rem` or `27.9rem`.
- **Dark Variant:** Deep Charcoal background with Warm Parchment text. Used for checkout, add-to-cart, and emphasized actions.
- **Cream Variant (`.cream-v`):** Used in the blog filter button — inverted to work against the dark culture section background.
- **Hover Behavior:** A distinctive **scrolling marquee effect** — static label fades to `opacity: 0` while a duplicate label scrolls horizontally in an infinite loop (`animation: marquee var(--time) infinite linear`). This is a signature Lemkus interaction.
- **Disabled/Sold-Out:** Deep Charcoal background with white text, no hover effect.

### Cards — Article Cards
- **Image Container:** Full-width with a thin 1px border in the foreground color. Fixed height of `42.8rem` (mobile) / `39.8rem` (desktop). Images fill via `object-fit: cover`.
- **Category Badge:** Pill-shaped, positioned absolutely at `top-right` of the image. Uses the Whisper Gray/Charcoal override palette. Displays category + date in RecoletaAlt-SemiBold. Format: `Releases - 18.03.26`.
- **Title:** DharmaGothicE-Bold, uppercase, `2.6rem` (mobile) → `3rem` (desktop). Transitions to Amber Flash on hover.
- **Spacing:** Cards separated by `1px solid` bottom borders on mobile; on desktop, displayed in a 4-column CSS grid with `2.6rem` row gap and `1.9rem` column gap.

### Cards — Product Cards
- **Navigation Arrows:** Pill-shaped containers (`8.5rem` × `3.9rem`), white background with 1px dark border. On hover, background fills to Deep Charcoal with white arrow SVGs. Arrow animation slides in from the edge with a cubic-bezier easing.
- **Brand Logo:** Small brand identifier image positioned near the product.
- **Size Selectors:** Inline text links (S, M, L or size ranges like 2-5, 5-8).
- **Price:** Displayed in South African Rand format (`R 319.00`).

### Inputs & Forms
- **Newsletter Input:** Transparent background, no visible border except a bottom stroke. Text in the foreground color. Placeholder inherits the text color.
- **Search Input:** Bottom border only (`1px solid`), RecoletaAlt font, `1.4rem` size.
- **Cost/Raffle Inputs:** Centered text, 2px bottom border in muted charcoal (`#363636`), large display size (`2.4rem` → `3.5rem`). Placeholder at 25% opacity.

### Cookie Consent
- **Container:** Fixed to bottom-right on desktop (`31.2rem` wide), full-width bottom bar on mobile. 1px border all around, cream background.
- **Text:** RecoletaAlt serif, `1.2rem`, centered.
- **Buttons:** Two pill buttons side-by-side ("LEARN" and "ACCEPT"), using the standard Lemkus button style with marquee hover.

### Pagination
- **Container:** Pill-shaped border wrapping all page numbers. `1px solid` border, RecoletaAlt-SemiBold numbers.
- **Active State:** White/Ivory text (full contrast).
- **Inactive State:** Faded Silver (`#b7b7b7`) numbers that transition to Burnished Gold on hover.

---

## 5. Layout Principles

### Spacing System
- **Primary gap variable:** `--gap` — `1.5rem` (mobile/tablet) → `2.5rem` (desktop). Used consistently for horizontal page margins and grid gutters.
- **Content wrapper (`.e-hold`):** `width: calc(100vw - var(--gap) * 2)` with left margin of `var(--gap)`. On desktop, transforms to percentage-based widths (70%–83%) with left padding for the expanded logo area.
- **Vertical rhythm:** Sections separated by thin 1px borders rather than whitespace alone. This creates a structured, editorial grid feel.

### Grid Strategy
- **Blog page:** 2-column flexbox on mobile (`gap: 1rem`) → 4-column CSS grid on desktop (`grid-template-columns: repeat(4, 1fr)`, `gap: 2.6rem 1.9rem`).
- **Blog index (featured posts):** Horizontal scrolling flex row with fixed-width cards (`27.3rem` mobile → `31.5rem` desktop), `2.5rem` gap between cards.
- **Product collections:** 2-column grid on mobile → 3-column grid with optional filter sidebar (filter takes `33.3vw`, products take `66.5vw`).
- **Footer:** CSS Grid with named areas that restructure between mobile (2-column stacked) and desktop (4-column: newsletter, menu, legal, customer).

### Header/Navigation
- **Fixed positioning:** Logo, navigation links, account/search/wishlist, and hamburger menu are all `position: fixed` at the top of the viewport.
- **Logo:** SVG mark, starts at `100px` wide on mobile, scales to `12.6rem` on tablet, and expands dramatically to `131.7rem` on large desktop (functioning as a background watermark). Transitions with a spring-like cubic-bezier easing.
- **Cape Town Clock:** Real-time local time display in the header — a distinctive brand detail emphasizing Lemkus's roots.
- **Hamburger Menu:** Fixed to the top-right, `65px` square area with a `1px solid` left border. Three horizontal lines (`1px` height, `24px` wide, `6px` gap).

### Border Philosophy
Borders are the primary structural device — used everywhere instead of (or in addition to) shadows:
- All card images: `1px solid var(--dark)`
- Section dividers: `1px solid var(--dark)`
- Button outlines: `1px solid var(--dark)`
- Footer grid implicit lines
- Filter panel dividers
- The entire layout reads as a carefully ruled grid, reminiscent of newspaper layout or architectural drawings.

### Depth & Elevation
The design is essentially **flat** — there are no visible box-shadows on any primary UI elements. Depth is communicated through:
- **Layering via z-index:** Fixed header elements (z-index 7–9), overlays, and the custom cursor.
- **Border containment:** Elements feel "pressed into" the surface rather than floating above it.
- **Color inversion:** The blog section's dark background creates perceived depth through contrast rather than shadow.
- **Opacity transitions:** Hover states and page transitions use opacity and `clip-path: inset()` animations rather than elevation changes.

### Responsive Philosophy
- Fully fluid typography (vw-based font-size on `<html>`)
- No fixed breakpoints for type — layout shifts at `1025px` (desktop) and implicitly at smaller tablet/mobile sizes
- Mobile-first structure with progressive enhancement via `@media (min-width: 1025px)`
- Touch-friendly: 55px minimum hit targets for mobile navigation

---

## 6. Interaction & Motion

### Signature Animations
- **Button Marquee:** On hover, label scrolls infinitely left via `@keyframes marquee`. Speed controlled by `--time: 20s` (slow, deliberate scroll). Duplicate text via `content: attr(data-hover)` after pseudo-element ensures seamless loop.
- **Link Hover:** All navigation and article links transition to Amber Flash (`#f9b510`) with `transition: color 0.2s ease-out`.
- **Image Hover:** Article card and product images use a paired hover system — hovering the image triggers a class on the title (`hover-img-js`), creating a connected interaction.
- **Logo Animation:** Spring-like transform transition (`cubic-bezier(.16, 1.08, .38, .98)` over `0.6s`) — overshoots slightly before settling.
- **Page Transitions:** Elements animate in via `transform: translate(0%, 30%)` with `opacity: 0` → visible, and `clip-path: inset(0% 0% 100%)` reveals.

### Custom Cursor
A branded cursor element (`.cursor`) replaces the default pointer on desktop, featuring a circular background with text overlay — reinforcing the editorial, gallery-like browsing experience.
