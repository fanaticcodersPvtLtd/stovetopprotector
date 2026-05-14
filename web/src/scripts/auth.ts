/**
 * Client-side visitor auth helper. The site is statically generated, so
 * auth state is resolved in the browser against the Payload `users` API.
 * Payload sets an httpOnly session cookie on login; every request here
 * uses `credentials: 'include'` so that cookie rides along.
 */

const API = (import.meta.env.PUBLIC_PAYLOAD_API_URL ||
  import.meta.env.PAYLOAD_API_URL ||
  'http://localhost:3001/api') as string

export type Visitor = { id: number; email: string; displayName: string }

/** Returns the logged-in visitor, or null. Never throws. */
export async function getCurrentVisitor(): Promise<Visitor | null> {
  try {
    const res = await fetch(`${API}/users/me`, { credentials: 'include' })
    if (!res.ok) return null
    const data = (await res.json()) as { user: Visitor | null }
    return data.user ?? null
  } catch {
    return null
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${API}/users/logout`, { method: 'POST', credentials: 'include' })
  } catch {
    // ignore — best effort
  }
}

/**
 * Renders auth state into the header. Looks for `[data-auth-slot]` and
 * fills it: logged-out → "Log in"; logged-in → displayName + "Log out".
 */
export async function renderAuthNav(): Promise<void> {
  const slot = document.querySelector<HTMLElement>('[data-auth-slot]')
  if (!slot) return

  const visitor = await getCurrentVisitor()

  if (!visitor) {
    slot.innerHTML =
      '<a href="/login" class="text-[13px] font-bold text-primary-bright hover:underline">Log in</a>'
    return
  }

  slot.innerHTML = `
    <a href="/profile" class="text-[13px] font-medium text-ink hover:text-primary">${escapeHtml(visitor.displayName)}</a>
    <button type="button" data-logout class="text-[13px] font-medium text-muted hover:text-ink">Log out</button>
  `
  slot.querySelector('[data-logout]')?.addEventListener('click', async () => {
    await logout()
    window.location.href = '/'
  })
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Auto-run on every page that includes this script.
renderAuthNav()
