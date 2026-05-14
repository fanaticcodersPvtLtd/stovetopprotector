/**
 * Typed Payload REST client. Used by Astro at build time only (SSG).
 * No client-side calls — every fetch here runs during `astro build`.
 */
import type { LexicalRichText } from './lexical'

const API_URL = import.meta.env.PAYLOAD_API_URL ?? 'http://localhost:3001/api'

// ---- Types (mirror the Payload collections; kept narrow to what the frontend uses) ----

export type PricingData = {
  id: number
  brand: string
  brandSlug: string
  productName: string
  productLine?: 'lite' | 'premium' | 'pro' | 'grip' | 'standard' | 'other'
  priceUsd: number
  currency: 'USD'
  productUrl: string
  inStock: boolean
  specs?: {
    thicknessMm?: number
    materialType?: string
    heatRatingFahrenheit?: number
    warrantyMonths?: number
    dimensionsInches?: string
  }
}

export type ComparisonRow = {
  label: string
  valueA: string
  valueB: string
  sourceUrl?: string
}

export type Faq = { question: string; answer: string }
export type Source = { label: string; url: string }

export type ComparisonArticle = {
  id: number
  title: string
  slug: string
  status: 'draft' | 'published'
  publishedAt?: string
  readTimeMinutes?: number
  brandA: string
  brandB: string
  metaDescription: string
  tldrVerdict: string
  body: LexicalRichText
  comparisonRows?: ComparisonRow[]
  // `depth=2` resolves these from numeric IDs to full docs.
  pricedProducts?: PricingData[]
  faqs?: Faq[]
  relatedArticles?: ComparisonArticle[]
  sources?: Source[]
}

type PaginatedResponse<T> = {
  docs: T[]
  totalDocs: number
  page: number
  totalPages: number
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`)
  if (!res.ok) {
    throw new Error(`Payload fetch failed: ${res.status} ${res.statusText} — ${API_URL}${path}`)
  }
  return res.json() as Promise<T>
}

/** All published comparison articles, with pricing relationships resolved. */
export async function getPublishedComparisonArticles(): Promise<ComparisonArticle[]> {
  const query =
    '/comparison-articles' +
    '?where[status][equals]=published' +
    '&depth=2' +
    '&limit=200' +
    '&sort=-publishedAt'
  const data = await fetchJson<PaginatedResponse<ComparisonArticle>>(query)
  return data.docs
}

/** A single published comparison article by slug, or null if not found. */
export async function getComparisonArticleBySlug(
  slug: string,
): Promise<ComparisonArticle | null> {
  const query =
    '/comparison-articles' +
    `?where[slug][equals]=${encodeURIComponent(slug)}` +
    '&where[status][equals]=published' +
    '&depth=2' +
    '&limit=1'
  const data = await fetchJson<PaginatedResponse<ComparisonArticle>>(query)
  return data.docs[0] ?? null
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}
