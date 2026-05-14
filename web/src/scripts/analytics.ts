/**
 * Client-side GA4 custom-event tracking: outbound clicks, scroll depth,
 * CTA engagement. Every handler is guarded — if `gtag` is not present
 * (GA4 unset, failed to load, or blocked) all of this no-ops silently.
 */

type Gtag = (command: string, eventName: string, params?: Record<string, unknown>) => void

function getGtag(): Gtag | null {
  const g = (window as unknown as { gtag?: Gtag }).gtag
  return typeof g === 'function' ? g : null
}

function track(eventName: string, params: Record<string, unknown>): void {
  const gtag = getGtag()
  if (gtag) gtag('event', eventName, params)
}

// ---- Outbound clicks ----
document.addEventListener('click', (e) => {
  const target = e.target as Element | null
  const link = target?.closest('a')
  if (!link) return
  const href = link.getAttribute('href')
  if (!href) return
  try {
    const url = new URL(href, window.location.href)
    if (url.origin !== window.location.origin) {
      track('outbound_click', { destination: url.href, link_text: link.textContent?.trim() ?? '' })
    }
  } catch {
    // unparseable href — ignore
  }
})

// ---- CTA engagement ----
document.addEventListener('click', (e) => {
  const target = e.target as Element | null
  const cta = target?.closest('[data-cta]')
  if (!cta) return
  track('cta_click', { cta_label: cta.getAttribute('data-cta') ?? 'unknown' })
})

// ---- Scroll depth ----
const milestones = [25, 50, 75, 100]
const fired = new Set<number>()
let ticking = false

function checkScrollDepth(): void {
  const doc = document.documentElement
  const scrollable = doc.scrollHeight - doc.clientHeight
  if (scrollable <= 0) return
  const percent = (doc.scrollTop / scrollable) * 100
  for (const m of milestones) {
    if (percent >= m && !fired.has(m)) {
      fired.add(m)
      track('scroll_depth', { percent: m })
    }
  }
}

window.addEventListener(
  'scroll',
  () => {
    if (ticking) return
    ticking = true
    window.requestAnimationFrame(() => {
      checkScrollDepth()
      ticking = false
    })
  },
  { passive: true },
)
