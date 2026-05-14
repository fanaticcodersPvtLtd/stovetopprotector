/**
 * Client script for the newsletter signup form (NewsletterSignup.astro).
 * Posts to Payload's public `newsletter-subscribers` create endpoint.
 * Handles every signup form on the page.
 */

const API = (import.meta.env.PUBLIC_PAYLOAD_API_URL ||
  'http://localhost:3001/api') as string

function showMsg(root: HTMLElement, text: string, ok: boolean): void {
  const msg = root.querySelector<HTMLElement>('[data-newsletter-msg]')
  if (!msg) return
  msg.textContent = text
  msg.classList.remove('hidden')
  // keep the variant text colour, just nudge tone for errors
  msg.style.color = ok ? '' : '#dc2626'
}

document.querySelectorAll<HTMLElement>('[data-newsletter-signup]').forEach((root) => {
  const form = root.querySelector<HTMLFormElement>('[data-newsletter-form]')
  const btn = root.querySelector<HTMLButtonElement>('[data-newsletter-submit]')
  if (!form) return

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (btn) btn.disabled = true

    const email = String(new FormData(form).get('email') ?? '').trim()
    try {
      const res = await fetch(`${API}/newsletter-subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        // Unique-constraint violation → friendly message.
        const raw = data?.errors?.[0]?.message ?? ''
        const friendly = /unique|duplicate/i.test(raw)
          ? "You're already on the list (or pending confirmation)."
          : raw || 'Could not subscribe — please try again.'
        showMsg(root, friendly, false)
        if (btn) btn.disabled = false
        return
      }
      showMsg(root, 'Almost there — check your email to confirm your subscription.', true)
      form.reset()
    } catch {
      showMsg(root, 'Network error — please try again.', false)
      if (btn) btn.disabled = false
    }
  })
})
