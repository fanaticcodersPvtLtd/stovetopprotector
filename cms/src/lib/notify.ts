import type { Payload } from 'payload'

/**
 * Transactional notification emails. Routed through whatever email adapter
 * `payload.config.ts` has configured — Resend when `RESEND_API_KEY` is set,
 * Payload's console transport otherwise (dev).
 *
 * Every function here is fire-and-forget and never throws — a mail failure
 * must not break the CMS write that triggered it.
 */

const SITE = process.env.PAYLOAD_SERVER_URL || 'http://localhost:3001'

type ReviewLike = {
  id: number | string
  authorName?: string | null
  author?: number | string | { id: number | string; email?: string } | null
  rejectionReason?: string | null
}

/** Resolve the author's email — `author` may be an id or an embedded doc. */
async function resolveAuthorEmail(
  payload: Payload,
  review: ReviewLike,
): Promise<string | null> {
  const author = review.author
  if (author && typeof author === 'object' && 'email' in author && author.email) {
    return author.email
  }
  const id = typeof author === 'object' && author ? author.id : author
  if (id === null || id === undefined) return null
  try {
    // Server context — bypasses the public read gate on `users`.
    const user = await payload.findByID({ collection: 'users', id })
    return (user as { email?: string })?.email ?? null
  } catch {
    return null
  }
}

function emailShell(heading: string, bodyHtml: string): string {
  return `<div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;max-width:480px;margin:0 auto;color:#1a1c1b">
    <h2 style="color:#a33900;font-size:20px;margin:0 0 16px">${heading}</h2>
    ${bodyHtml}
    <p style="color:#71717a;font-size:12px;margin-top:24px;border-top:1px solid #e4e4e7;padding-top:12px">
      StoveGuard Reviews — independent stove top protector reviews.
    </p>
  </div>`
}

export async function sendReviewApprovedEmail(
  payload: Payload,
  review: ReviewLike,
): Promise<void> {
  try {
    const to = await resolveAuthorEmail(payload, review)
    if (!to) {
      payload.logger.warn(`[notify] review ${review.id} approved — no author email, skipping`)
      return
    }
    const name = review.authorName || 'there'
    await payload.sendEmail({
      to,
      subject: 'Your StoveGuard review is live',
      text: `Hi ${name},\n\nGood news — your review has been approved and is now live on StoveGuard Reviews.\n\nThanks for contributing.`,
      html: emailShell(
        'Your review is live',
        `<p>Hi ${name},</p><p>Good news — your review has been approved and is now published on StoveGuard Reviews. Thanks for contributing.</p>
         <p><a href="${SITE}" style="color:#a33900;font-weight:bold">Visit StoveGuard Reviews</a></p>`,
      ),
    })
    payload.logger.info(`[notify] review ${review.id} approved — email sent to ${to}`)
  } catch (err) {
    payload.logger.error(`[notify] approval email failed for review ${review.id}: ${String(err)}`)
  }
}

export async function sendReviewRejectedEmail(
  payload: Payload,
  review: ReviewLike,
): Promise<void> {
  try {
    const to = await resolveAuthorEmail(payload, review)
    if (!to) {
      payload.logger.warn(`[notify] review ${review.id} rejected — no author email, skipping`)
      return
    }
    const name = review.authorName || 'there'
    const reason = review.rejectionReason?.trim()
    const reasonHtml = reason
      ? `<p style="background:#fff7ed;border-left:3px solid #a33900;padding:12px 16px"><strong>Reason:</strong> ${reason}</p>`
      : ''
    const reasonText = reason ? `\n\nReason: ${reason}` : ''
    await payload.sendEmail({
      to,
      subject: 'Update on your StoveGuard review submission',
      text: `Hi ${name},\n\nThanks for your submission. After moderation, this review wasn't published.${reasonText}\n\nYou're welcome to submit another review any time.`,
      html: emailShell(
        'Update on your submission',
        `<p>Hi ${name},</p><p>Thanks for your submission. After moderation, this review wasn't published.</p>${reasonHtml}
         <p>You're welcome to submit another review any time.</p>`,
      ),
    })
    payload.logger.info(`[notify] review ${review.id} rejected — email sent to ${to}`)
  } catch (err) {
    payload.logger.error(`[notify] rejection email failed for review ${review.id}: ${String(err)}`)
  }
}
