/**
 * Client script for the visitor review submission form inside ReviewSection.
 * Auth-gated: shows the form only to logged-in visitors, otherwise a login
 * prompt. Posts to Payload with the session cookie.
 */
import { getCurrentVisitor } from './auth'

const API = (import.meta.env.PUBLIC_PAYLOAD_API_URL ||
  'http://localhost:3001/api') as string

async function initReviewForm(): Promise<void> {
  const root = document.querySelector<HTMLElement>('[data-review-form-root]')
  if (!root) return

  const targetType = root.dataset.targetType
  const targetId = root.dataset.targetId
  if (!targetType || !targetId) return

  const visitor = await getCurrentVisitor()

  if (!visitor) {
    root.innerHTML = `
      <div class="rounded-lg border border-border-subtle bg-surface-container p-6 text-center">
        <p class="mb-3 text-sm text-muted">Log in to write a review.</p>
        <a href="/login" class="inline-flex items-center gap-2 rounded-lg bg-primary-bright px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-hover">Log in</a>
      </div>`
    return
  }

  root.innerHTML = `
    <form data-review-form class="rounded-lg border border-border-subtle bg-white p-6">
      <h4 class="mb-4 font-bold text-ink">Write a review</h4>
      <label class="mb-1 block text-[11px] font-extrabold uppercase tracking-widest text-muted-soft">Rating</label>
      <select name="rating" required class="mb-4 w-full rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm">
        <option value="5">5 — Excellent</option>
        <option value="4">4 — Good</option>
        <option value="3">3 — Okay</option>
        <option value="2">2 — Poor</option>
        <option value="1">1 — Bad</option>
      </select>
      <label class="mb-1 block text-[11px] font-extrabold uppercase tracking-widest text-muted-soft">Your review</label>
      <textarea name="body" required maxlength="2000" rows="4" class="mb-4 w-full rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm"></textarea>
      <p data-review-msg class="mb-3 hidden rounded-lg px-4 py-2 text-sm"></p>
      <button type="submit" data-review-submit class="rounded-lg bg-primary-bright px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-hover disabled:opacity-60">Submit review</button>
    </form>`

  const form = root.querySelector<HTMLFormElement>('[data-review-form]')
  const msg = root.querySelector<HTMLElement>('[data-review-msg]')
  const btn = root.querySelector<HTMLButtonElement>('[data-review-submit]')

  form?.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (btn) btn.disabled = true
    msg?.classList.add('hidden')

    const fd = new FormData(form)
    try {
      const res = await fetch(`${API}/visitor-reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          body: String(fd.get('body') ?? ''),
          rating: Number(fd.get('rating') ?? 0),
          // author + status are server-enforced; target is the only ref we send.
          target: { relationTo: targetType, value: Number(targetId) },
        }),
      })
      const data = await res.json()
      if (!msg) return
      if (!res.ok) {
        msg.textContent = data?.errors?.[0]?.message ?? 'Could not submit your review.'
        msg.className = 'mb-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700'
        msg.classList.remove('hidden')
        if (btn) btn.disabled = false
        return
      }
      msg.textContent = 'Thanks — your review was submitted and is pending moderation.'
      msg.className = 'mb-3 rounded-lg bg-surface-warm px-4 py-2 text-sm text-ink'
      msg.classList.remove('hidden')
      form.reset()
    } catch {
      if (msg) {
        msg.textContent = 'Network error — please try again.'
        msg.className = 'mb-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700'
        msg.classList.remove('hidden')
      }
      if (btn) btn.disabled = false
    }
  })
}

initReviewForm()
