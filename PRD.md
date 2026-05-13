# StoveGuard.us.com — Requirements Document

## What it is

An independent, unbiased consumer review and comparison site for stove top protectors. It serves US consumers researching which stove protector brand to buy by aggregating pricing from official brand websites and user reviews from Trustpilot, BBB, Reddit, and Amazon into structured comparison articles, individual brand reviews, buyer guides, and appliance brand pages. The site has no brand affiliations, no affiliate links, no ad commissions. Revenue comes from AdSense display ads. Community trust is built through moderated user-submitted reviews and comments.

## Actors

### Super Admin

**Access:** The first account is created during deployment. This person creates all other accounts from within the Payload CMS dashboard. No self-signup, no invite links.

**What they see:** The full Payload admin panel including all content collections, user management, API keys, webhook configuration, and deployment settings.

**What they can do:** Everything an editor can do, plus create/delete user accounts, assign roles, configure system settings, and manage infrastructure-level CMS configuration.

**What they cannot do:** N/A — full system access.

### Editor

**Access:** An existing admin creates their account from inside the Payload dashboard and assigns the editor role. No self-signup.

**What they see:** The Payload CMS dashboard with the left sidebar showing content collections: Comparison Articles, Review Articles, Buyer Guides, Educational Guides, Brand Pages, Pricing Data, Media, and the moderation queue for visitor submissions.

**What they can do:**

- Write and publish comparison articles (brand vs brand matchups), review articles (single brand reviews), buyer guides (ranked product lists), and educational guides (informational content)
- Manage brand pages by filling structured fields: brand name, popular stove models (series, type, burner count, size), protector comparison tables (brands, prices, specs), and FAQ entries
- Update pricing in the shared Pricing Data collection — one update propagates to every article and brand page referencing that product on next site build
- Upload images for articles and OG images
- Review, approve, or reject visitor-submitted reviews and comments from the moderation queue, providing rejection reasons when applicable
- Manage social media auto-posting and newsletter content

**What they cannot do:** Access user management, API keys, webhook configuration, or deployment settings.

### Visitor (Contributor)

**Access:** Self-registration with email or social login (Google, Facebook). Social login accounts skip email verification since the provider already verified the email. Email-only accounts require email verification. Account creation is open to anyone.

**What they see (logged out):** The full public site — homepage, all articles, comparison tables, pricing data, brand pages, interactive comparison tool. A "Log in to leave a review" prompt at the bottom of content pages. A "Log in" link in the top nav.

**What they see (logged in):** Identical content experience as logged out, plus:

- A "Write a review" button at the bottom of articles and brand pages
- Their profile icon in the top nav
- A profile page showing display name, submission history, and status of each submission (pending, approved, rejected with reason)

**What they can do:**

- Create an account via Google, Facebook, or email with a display name (no real name required)
- Submit reviews and comments on any article or brand page
- View their submission history and statuses
- Receive email notifications when submissions are approved

**What they cannot do:** Post content that goes live without moderation approval, edit or delete published articles, access the admin panel, see other users' personal information, create brand listings, or modify pricing data.

## Separation of views

**Admin panel vs. public site:** Completely separate interfaces. The admin panel (Payload CMS) is only accessible to super admins and editors. Visitors never see it.

**Super admin vs. editor (within admin panel):** Editors see only content collections and the moderation queue. Super admins see everything including user management, API keys, webhooks, and deployment settings.

**Logged-in vs. logged-out visitor (public site):** Content is identical. The only differences are: the review submission button (vs. login prompt), profile icon in nav (vs. login link), and access to the profile/submission history page. No content is gated behind login.

## Content architecture

**Comparison Articles** — Brand vs brand matchups (e.g., StoveGuard vs Stove Shield). Rich text body with structured fields: title, meta description, read time, publish date, related articles, sources.

**Review Articles** — Individual brand deep-dives (e.g., StoveGuard Review). Same structured fields as comparisons.

**Buyer Guides** — Ranked product lists (e.g., Best Stove Protectors 2026, Best for Gas Stoves). Same structured fields.

**Educational Guides** — Informational content (e.g., Thickness Guide, Safety Guide). Same structured fields.

**Brand Pages** — Structured data for each appliance brand (GE, Samsung, Frigidaire, etc.). Fields: brand name, popular stove model list (series name, type, burner count, size), protector comparison table (which protector brands serve this appliance, prices, specs), FAQ entries. The frontend template auto-generates page layout from this data.

**Pricing Data** — Shared collection. All brand pricing maintained in one place and referenced across all content types. Single update propagates everywhere on next build.

**Media** — Image uploads for articles and OG images.

**Interactive Comparison Tool** — Visitors pick two brands and get a dynamic side-by-side comparison generated from pricing and specs data in real time.

## Features in scope for v1

- **Social media auto-posting** — automatic distribution when articles are published, plus social sharing buttons on all articles
- **Newsletter** — email capture on the site, subscriber management, content digest emails
- **AdSense** — display ad placements integrated into article design without compromising editorial credibility (applied for once content/traffic thresholds are met)
- **Interactive comparison tool** — dynamic two-brand side-by-side comparison from structured data
- **User review/comment system** — account creation, submission, moderation queue, email notifications
- **SEO-first architecture** — every content page designed as a potential search landing page

## Constraints

**External dependencies:**

- Cloudflare Pages (frontend hosting) — free tier, 500 builds/month, unlimited bandwidth
- Railway or Render (Payload CMS hosting) — $5–$10/month, Postgres included
- GA4 — free, tracks outbound clicks, scroll depth, CTA engagement
- Resend (email notifications) — free tier, 3,000 emails/month (sufficient for expected volume)
- Google AdSense — requires approval; dependent on content volume and traffic thresholds

**Budget:** Total infrastructure under $15/month. No usage-based billing exposure — static site served from CDN means hosting cost doesn't scale with traffic.

**Out of scope for v1:**

- Original video production (will embed relevant third-party YouTube reviews only)
- Automated price tracking or scraping — all pricing manually verified
- Multi-language or multi-region support — English only, US market only
- Native mobile app — responsive web covers mobile
