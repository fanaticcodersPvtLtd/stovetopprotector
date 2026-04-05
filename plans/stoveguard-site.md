# Plan: StoveGuard.us.com

> Source PRD: `PRD.md`

## Architectural decisions

Durable decisions that apply across all phases:

- **Frontend**: Astro static site deployed to Cloudflare Pages. Pages rebuild on content publish via webhook.
- **CMS**: Payload 3.0 self-hosted on Railway/Render with Postgres. All content schemas defined in TypeScript.
- **Roles**: Two CMS roles — `super-admin` (full access) and `editor` (content collections + moderation only). First super-admin seeded at deployment.
- **Visitor accounts**: Separate from CMS accounts. Email-based registration, no social login. Stored in the same Postgres database but in a distinct collection with no CMS panel access.
- **Pricing model**: Shared `Pricing Data` collection. All content types reference pricing entries by relationship. One update propagates on next build.
- **Email**: Resend for transactional email (account verification, review approval notifications).
- **Analytics**: GA4 with custom events for outbound clicks, scroll depth, CTA engagement.
- **Routes (public site)**:
  - `/` — homepage
  - `/compare/[brand1]-vs-[brand2]` — comparison articles
  - `/reviews/[brand-slug]` — review articles
  - `/best/[topic-slug]` — buyer guides
  - `/guides/[guide-slug]` — educational guides
  - `/brands/[brand-slug]` — appliance brand pages
  - `/compare` — interactive comparison tool
  - `/login`, `/register`, `/profile` — visitor auth and profile
  - `/newsletter` — subscription management
- **Schema (Payload collections)**:
  - `admins` — CMS users (super-admin, editor roles)
  - `visitors` — public site accounts (display name, email, password hash)
  - `comparison-articles` — rich text + structured fields, references pricing-data
  - `review-articles` — rich text + structured fields, references pricing-data
  - `buyer-guides` — rich text + structured fields, references pricing-data
  - `educational-guides` — rich text + structured fields
  - `brand-pages` — structured fields (models array, protector comparison table, FAQs)
  - `pricing-data` — brand name, product name, price, specs, official site URL
  - `media` — image uploads
  - `reviews` — visitor-submitted content (body, author ref, target content ref, status: pending/approved/rejected, rejection reason)
  - `newsletter-subscribers` — email, subscription status, preferences

---

## Phase 1: CMS Foundation + First Content Type

**User stories**: Super admin creates editor accounts; editor creates pricing entries and publishes a comparison article; visitor reads a comparison article with live pricing on the public site.

### What to build

Deploy Payload CMS with Postgres. Define the `admins` collection with role-based access control (super-admin sees everything, editor sees only content collections). Define `pricing-data` and `comparison-articles` collections, with comparison articles referencing pricing entries by relationship. Seed the first super-admin account at deployment. Build a minimal Astro frontend that fetches comparison article data from Payload's REST API and renders a single article page with pricing pulled from the referenced pricing-data entries. Set up the Cloudflare Pages deployment with a Payload webhook triggering rebuilds on content publish.

### Acceptance criteria

- [ ] Payload CMS is deployed and accessible at its hosted URL
- [ ] Super-admin account exists after first deployment
- [ ] Super-admin can create an editor account from the Payload dashboard
- [ ] Editor can create/edit pricing-data entries (brand, product, price, specs, URL)
- [ ] Editor can create/edit/publish a comparison article with references to pricing-data
- [ ] Editor cannot access user management or system settings
- [ ] Astro frontend renders a published comparison article at `/compare/[brand1]-vs-[brand2]`
- [ ] Pricing displayed on the article page comes from the referenced pricing-data entries
- [ ] Updating a pricing-data entry and rebuilding the site updates the price on the article page
- [ ] Cloudflare Pages rebuilds automatically when content is published via webhook

---

## Phase 2: Full Content Collections

**User stories**: Editor manages all content types; visitor browses brand pages, guides, and reviews; pricing data propagates across all content types.

### What to build

Add the remaining Payload collections: `review-articles`, `buyer-guides`, `educational-guides`, `brand-pages`, and `media`. Review articles, buyer guides, and educational guides follow the same structured field pattern as comparison articles (title, meta description, read time, publish date, related articles, sources) with pricing-data references where applicable. Brand pages use a distinct schema: brand name, popular stove model list (series name, type, burner count, size), protector comparison table (which protector brands serve this appliance brand, with pricing-data references), and FAQ entries. Build Astro templates for each content type rendering at their defined routes. All templates pull pricing from the shared pricing-data collection.

### Acceptance criteria

- [ ] Editor can create/edit/publish review articles, buyer guides, educational guides, and brand pages
- [ ] Brand pages have structured fields for model list, protector comparison table (with pricing refs), and FAQ entries
- [ ] Media collection supports image uploads and images can be embedded in articles and used as OG images
- [ ] Astro renders review articles at `/reviews/[brand-slug]`
- [ ] Astro renders buyer guides at `/best/[topic-slug]`
- [ ] Astro renders educational guides at `/guides/[guide-slug]`
- [ ] Astro renders brand pages at `/brands/[brand-slug]` with model list, comparison table, and FAQs auto-generated from structured data
- [ ] Pricing-data references resolve correctly across all content types
- [ ] Related articles field links between content types and renders on the frontend

---

## Phase 3: SEO & Site Structure

**User stories**: Visitor lands from Google on any content page and can navigate to related content; search engines crawl and index all pages correctly.

### What to build

Build the homepage at `/` with featured content, category navigation, and recent articles. Add site-wide navigation (header and footer) with links to all content categories. Implement internal linking: related articles render as clickable links at the bottom of each article, brand pages link to relevant comparison and review articles, and buyer guides link to individual reviews. Add structured data (JSON-LD) appropriate to each page type (Article, FAQPage for brand pages, ItemList for buyer guides). Generate meta tags (title, description, OG image) from the structured fields on each content type. Auto-generate XML sitemap and robots.txt. Ensure responsive design across all templates. Add outbound "Visit official site" links on brand mentions with GA4 outbound click event tracking. Integrate GA4 site-wide.

### Acceptance criteria

- [ ] Homepage renders at `/` with featured content and category navigation
- [ ] Header and footer navigation present on all pages with links to content categories
- [ ] Related articles render as navigable links on all article pages
- [ ] Brand pages link to relevant comparison and review articles
- [ ] JSON-LD structured data present on all page types (Article, FAQPage, ItemList as appropriate)
- [ ] Meta title, description, and OG image generated from content fields on every page
- [ ] XML sitemap generated and includes all published content URLs
- [ ] robots.txt present and allows search engine crawling
- [ ] All pages are responsive across mobile, tablet, and desktop
- [ ] "Visit official site" links go directly to brand websites with no affiliate parameters
- [ ] GA4 tracks page views, outbound clicks, scroll depth, and CTA engagement

---

## Phase 4: User Accounts & Review System

**User stories**: Visitor creates account, submits review, sees pending status; editor reviews and approves/rejects; visitor gets email notification and sees approved review live on the page.

### What to build

Add the `visitors` collection in Payload for public site accounts (display name, email, password hash) — separate from the `admins` collection. Build registration at `/register` (email + display name, no social login) and login at `/login`. Add the `reviews` collection in Payload (body, author reference, target content reference, status enum: pending/approved/rejected, rejection reason). On article and brand pages, logged-in visitors see a "Write a review" button; logged-out visitors see "Log in to leave a review." Submitted reviews enter the moderation queue. Editors see the moderation queue in the Payload dashboard and can approve or reject with a reason. Approved reviews appear on the associated content page. Build the visitor profile page at `/profile` showing display name, all submissions, and each submission's status (including rejection reason). Integrate Resend for email notifications: send confirmation on account creation and notification when a review is approved.

### Acceptance criteria

- [ ] Visitor can register with email and display name at `/register`
- [ ] Visitor can log in at `/login` and sees their profile icon in the top nav
- [ ] Logged-in visitor sees "Write a review" on articles and brand pages
- [ ] Logged-out visitor sees "Log in to leave a review" instead
- [ ] Submitted review appears in the Payload moderation queue with "pending" status
- [ ] Editor can approve or reject a review with a reason from the Payload dashboard
- [ ] Approved reviews display on the associated content page
- [ ] Rejected reviews do not appear on the public site
- [ ] Visitor profile at `/profile` shows submission history with statuses and rejection reasons
- [ ] Visitor receives email notification via Resend when their review is approved
- [ ] Visitor accounts cannot access the Payload admin panel

---

## Phase 5: Interactive Comparison Tool

**User stories**: Visitor selects two brands and sees a dynamically generated comparison with pricing, specs, and links.

### What to build

Build the interactive comparison tool at `/compare`. The page presents a selector where the visitor picks two protector brands from the available pricing-data entries. On selection, the page generates a side-by-side comparison table pulling pricing, specs, and official site links from the pricing-data collection. This is dynamic — not a pre-written article. The comparison renders client-side from the structured data. If a pre-written comparison article exists for the selected pair, link to it from the tool results. The tool should also be linked from relevant brand pages and the homepage.

### Acceptance criteria

- [ ] `/compare` page loads with brand selectors populated from pricing-data
- [ ] Selecting two brands generates a side-by-side comparison table with prices, specs, and official site links
- [ ] Comparison data is sourced from the pricing-data collection, not hardcoded
- [ ] If a matching comparison article exists, a link to it appears in the results
- [ ] The tool is linked from the homepage and relevant brand pages
- [ ] Works on mobile with a responsive layout

---

## Phase 6: Newsletter, Social & AdSense

**User stories**: Visitor subscribes to newsletter; articles auto-post to social on publish; ad slots render without disrupting content experience.

### What to build

Add the `newsletter-subscribers` collection in Payload. Build an email capture form component that appears on the homepage and article pages. Subscriber management: confirm subscription via email (Resend), allow unsubscribe. Build content digest email capability — editors can trigger or schedule digest emails to subscribers. Add social sharing buttons (Twitter/X, Facebook, Pinterest) to all article pages. Implement social auto-posting: when an article is published, a Payload hook triggers posts to configured social accounts. Integrate AdSense ad placement slots into article templates — designated positions that render ads without breaking the reading flow. Ad slots should degrade gracefully if AdSense is not yet approved or if the visitor uses an ad blocker.

### Acceptance criteria

- [ ] Email capture form appears on homepage and article pages
- [ ] Submitting an email creates a subscriber entry and sends a confirmation email via Resend
- [ ] Subscribers can unsubscribe via a link in any email
- [ ] Editors can send content digest emails to subscribers from the Payload dashboard
- [ ] Social sharing buttons (Twitter/X, Facebook, Pinterest) appear on all article pages
- [ ] Publishing an article triggers auto-posts to configured social accounts
- [ ] AdSense ad slots are positioned in article templates without disrupting content layout
- [ ] Ad slots render gracefully when AdSense is not active (no broken layout or errors)
