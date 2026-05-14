/**
 * Client script for /profile. The page ships an empty shell; this fills it
 * after an /api/users/me check — so there's no flash of private content and
 * no server-side auth needed on a static site.
 */
import { getCurrentVisitor, logout } from './auth'

const API = (import.meta.env.PUBLIC_PAYLOAD_API_URL ||
  'http://localhost:3001/api') as string

type ReviewTarget = { relationTo: string; value: number } | number | null
type ProfileReview = {
  id: number
  body: string
  rating: number
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
  submittedAt?: string
  target?: ReviewTarget
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function fmtDate(iso?: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-surface-container text-muted',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-700',
}

async function fetchMyReviews(authorId: number): Promise<ProfileReview[]> {
  try {
    const res = await fetch(
      `${API}/visitor-reviews?where[author][equals]=${authorId}&depth=0&limit=100&sort=-submittedAt`,
      { credentials: 'include' },
    )
    if (!res.ok) return []
    const data = (await res.json()) as { docs: ProfileReview[] }
    return data.docs ?? []
  } catch {
    return []
  }
}

function renderReview(r: ProfileReview): string {
  const badge = STATUS_BADGE[r.status] ?? STATUS_BADGE.pending
  const target =
    r.target && typeof r.target === 'object'
      ? `${esc(r.target.relationTo)} #${r.target.value}`
      : ''
  return `
    <li class="rounded-lg border border-border-subtle bg-white p-5">
      <div class="mb-2 flex items-center justify-between gap-3">
        <span class="flex items-center gap-1 text-sm font-bold text-primary">
          ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
        </span>
        <span class="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badge}">
          ${esc(r.status)}
        </span>
      </div>
      <p class="m-0 mb-2 text-sm leading-relaxed text-ink-soft">${esc(r.body)}</p>
      ${
        r.status === 'rejected' && r.rejectionReason
          ? `<p class="m-0 mb-2 rounded bg-red-50 px-3 py-2 text-xs text-red-700"><strong>Reason:</strong> ${esc(r.rejectionReason)}</p>`
          : ''
      }
      <div class="flex items-center gap-3 text-[11px] text-muted-soft">
        ${target ? `<span>${target}</span>` : ''}
        ${r.submittedAt ? `<span>${fmtDate(r.submittedAt)}</span>` : ''}
      </div>
    </li>`
}

async function initProfile(): Promise<void> {
  const root = document.querySelector<HTMLElement>('[data-profile-root]')
  if (!root) return

  const visitor = await getCurrentVisitor()

  if (!visitor) {
    root.innerHTML = `
      <div class="rounded-lg border border-border-subtle bg-surface-card p-10 text-center">
        <h1 class="mb-2 font-headline text-2xl font-bold text-ink">Please log in</h1>
        <p class="mb-6 text-sm text-muted">You need to be logged in to view your profile.</p>
        <a href="/login" class="inline-flex items-center gap-2 rounded-lg bg-primary-bright px-6 py-3 font-bold text-white transition-colors hover:bg-primary-hover">Log in</a>
      </div>`
    return
  }

  const reviews = await fetchMyReviews(visitor.id)

  root.innerHTML = `
    <div class="mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 class="mb-1 font-headline text-3xl font-bold text-ink">${esc(visitor.displayName)}</h1>
        <p class="text-sm text-muted">${esc(visitor.email)}</p>
      </div>
      <button type="button" data-profile-logout class="rounded-lg border border-border-subtle px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-primary">
        Log out
      </button>
    </div>

    <h2 class="mb-4 font-headline text-xl font-bold text-ink">Your Submissions</h2>
    ${
      reviews.length === 0
        ? `<div class="rounded-lg border border-border-subtle bg-surface-card p-8 text-center">
             <p class="mb-4 text-sm text-muted">You haven't submitted any reviews yet.</p>
             <a href="/compare" class="font-semibold text-primary hover:underline">Browse comparisons →</a>
           </div>`
        : `<ul class="space-y-4">${reviews.map(renderReview).join('')}</ul>`
    }`

  root.querySelector('[data-profile-logout]')?.addEventListener('click', async () => {
    await logout()
    window.location.href = '/'
  })
}

initProfile()
