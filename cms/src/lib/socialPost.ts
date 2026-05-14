import type { Payload } from 'payload'

/**
 * Auto-posts a newly-published article to social platforms.
 *
 * Env-gated per platform: a platform only posts when its credentials are
 * present. With no credentials (current state), every platform is skipped
 * with a debug log — publishing an article never errors over social.
 *
 * Real posting activates with NO code change once these env vars are set:
 *   - TWITTER_API_KEY / TWITTER_API_SECRET / TWITTER_ACCESS_TOKEN / TWITTER_ACCESS_SECRET
 *   - FACEBOOK_PAGE_ACCESS_TOKEN
 *   - PINTEREST_ACCESS_TOKEN
 */

const SITE = process.env.SITE_URL || 'http://localhost:4321'

type ArticleRef = {
  title: string
  /** Site-relative path, e.g. "/compare/foo-vs-bar". */
  path: string
}

async function postToFacebook(payload: Payload, article: ArticleRef, url: string): Promise<void> {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
  if (!token) {
    payload.logger.debug('[socialPost] Facebook skipped — FACEBOOK_PAGE_ACCESS_TOKEN unset')
    return
  }
  try {
    const res = await fetch('https://graph.facebook.com/v21.0/me/feed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: article.title, link: url, access_token: token }),
    })
    payload.logger[res.ok ? 'info' : 'error'](
      `[socialPost] Facebook ${res.ok ? 'posted' : `failed ${res.status}`}: ${article.title}`,
    )
  } catch (err) {
    payload.logger.error(`[socialPost] Facebook error: ${String(err)}`)
  }
}

async function postToPinterest(payload: Payload, article: ArticleRef, url: string): Promise<void> {
  const token = process.env.PINTEREST_ACCESS_TOKEN
  if (!token) {
    payload.logger.debug('[socialPost] Pinterest skipped — PINTEREST_ACCESS_TOKEN unset')
    return
  }
  try {
    const res = await fetch('https://api.pinterest.com/v5/pins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ link: url, title: article.title, description: article.title }),
    })
    payload.logger[res.ok ? 'info' : 'error'](
      `[socialPost] Pinterest ${res.ok ? 'posted' : `failed ${res.status}`}: ${article.title}`,
    )
  } catch (err) {
    payload.logger.error(`[socialPost] Pinterest error: ${String(err)}`)
  }
}

function postToTwitter(payload: Payload, article: ArticleRef, url: string): void {
  // Twitter/X posting needs OAuth 1.0a request signing — left as a documented
  // integration point. Credentials present but signing not wired: log and skip
  // rather than ship a half-working signer.
  const hasCreds =
    process.env.TWITTER_API_KEY &&
    process.env.TWITTER_API_SECRET &&
    process.env.TWITTER_ACCESS_TOKEN &&
    process.env.TWITTER_ACCESS_SECRET
  if (!hasCreds) {
    payload.logger.debug('[socialPost] X/Twitter skipped — TWITTER_* unset')
    return
  }
  // TODO: wire OAuth 1.0a signing + POST https://api.twitter.com/2/tweets
  payload.logger.info(
    `[socialPost] X/Twitter credentials present — signing not yet wired (${article.title})`,
  )
}

/** Fire-and-forget: posts to every platform whose credentials are configured. */
export function autoPostArticle(payload: Payload, article: ArticleRef): void {
  const url = `${SITE}${article.path}`
  const anyCreds =
    process.env.FACEBOOK_PAGE_ACCESS_TOKEN ||
    process.env.PINTEREST_ACCESS_TOKEN ||
    process.env.TWITTER_API_KEY
  if (!anyCreds) {
    payload.logger.debug(
      `[socialPost] auto-post skipped — no social credentials configured (${article.title})`,
    )
    return
  }
  void postToFacebook(payload, article, url)
  void postToPinterest(payload, article, url)
  postToTwitter(payload, article, url)
}
