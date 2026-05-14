import type { Payload } from 'payload'

/**
 * Fire-and-forget POST to the Cloudflare Pages deploy hook.
 * No-ops cleanly in local dev (env var unset). Never throws — a failed
 * deploy trigger must not break a CMS write.
 */
export function triggerDeploy(payload: Payload, context: string): void {
  const url = process.env.CLOUDFLARE_DEPLOY_HOOK_URL

  if (!url) {
    payload.logger.debug(`[triggerDeploy] CLOUDFLARE_DEPLOY_HOOK_URL unset — skipping (${context})`)
    return
  }

  // Intentionally not awaited — the hook is fire-and-forget.
  fetch(url, { method: 'POST' })
    .then((res) => {
      if (res.ok) {
        payload.logger.info(`[triggerDeploy] Cloudflare rebuild triggered (${context})`)
      } else {
        payload.logger.error(
          `[triggerDeploy] deploy hook returned ${res.status} (${context})`,
        )
      }
    })
    .catch((err) => {
      payload.logger.error(`[triggerDeploy] deploy hook failed (${context}): ${String(err)}`)
    })
}
