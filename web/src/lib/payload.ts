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

export type EducationalGuide = {
  id: number
  title: string
  slug: string
  status: 'draft' | 'published'
  publishedAt?: string
  readTimeMinutes?: number
  metaDescription: string
  keyTakeaway: string
  body: LexicalRichText
  faqs?: Faq[]
  relatedGuides?: EducationalGuide[]
  sources?: Source[]
}

export type ProsCon = { point: string }

export type RankedProduct = {
  rank: number
  product: PricingData
  ourScore: number
  badge?:
    | 'best-overall'
    | 'best-for-gas'
    | 'best-for-glass'
    | 'best-budget'
    | 'best-for-rv'
    | 'none'
  positives: string
  drawbacks: string
}

export type BuyerGuide = {
  id: number
  title: string
  slug: string
  status: 'draft' | 'published'
  publishedAt?: string
  readTimeMinutes?: number
  metaDescription: string
  methodology: string
  // `depth=2` resolves rankedProducts[].product to a full pricing-data doc.
  rankedProducts?: RankedProduct[]
  body: LexicalRichText
  faqs?: Faq[]
  relatedGuides?: BuyerGuide[]
  sources?: Source[]
}

export type StoveModel = {
  seriesName: string
  stoveType: 'gas' | 'electric' | 'induction' | 'glass-top'
  burnerCount?: number
  sizeInches?: string
}

export type ProtectorOption = {
  product: PricingData
  compatibilityNote?: string
}

export type BrandPage = {
  id: number
  brandName: string
  slug: string
  status: 'draft' | 'published'
  publishedAt?: string
  metaDescription: string
  intro: string
  stoveModels?: StoveModel[]
  // `depth=2` resolves protectorOptions[].product to a full pricing-data doc.
  protectorOptions?: ProtectorOption[]
  body: LexicalRichText
  faqs?: Faq[]
  relatedBrands?: BrandPage[]
  sources?: Source[]
}

export type ReviewArticle = {
  id: number
  title: string
  slug: string
  status: 'draft' | 'published'
  publishedAt?: string
  readTimeMinutes?: number
  ratingOutOf5: number
  brand: string
  metaDescription: string
  verdict: string
  body: LexicalRichText
  pros?: ProsCon[]
  cons?: ProsCon[]
  // `depth=2` resolves these from numeric IDs to full docs.
  productLineup?: PricingData[]
  faqs?: Faq[]
  relatedReviews?: ReviewArticle[]
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

/** All published educational guides. */
export async function getPublishedEducationalGuides(): Promise<EducationalGuide[]> {
  const query =
    '/educational-guides' +
    '?where[status][equals]=published' +
    '&depth=1' +
    '&limit=200' +
    '&sort=-publishedAt'
  const data = await fetchJson<PaginatedResponse<EducationalGuide>>(query)
  return data.docs
}

/** A single published educational guide by slug, or null if not found. */
export async function getEducationalGuideBySlug(
  slug: string,
): Promise<EducationalGuide | null> {
  const query =
    '/educational-guides' +
    `?where[slug][equals]=${encodeURIComponent(slug)}` +
    '&where[status][equals]=published' +
    '&depth=1' +
    '&limit=1'
  const data = await fetchJson<PaginatedResponse<EducationalGuide>>(query)
  return data.docs[0] ?? null
}

/** All published review articles, with product-lineup relationships resolved. */
export async function getPublishedReviewArticles(): Promise<ReviewArticle[]> {
  const query =
    '/review-articles' +
    '?where[status][equals]=published' +
    '&depth=2' +
    '&limit=200' +
    '&sort=-publishedAt'
  const data = await fetchJson<PaginatedResponse<ReviewArticle>>(query)
  return data.docs
}

/** A single published review article by slug, or null if not found. */
export async function getReviewArticleBySlug(
  slug: string,
): Promise<ReviewArticle | null> {
  const query =
    '/review-articles' +
    `?where[slug][equals]=${encodeURIComponent(slug)}` +
    '&where[status][equals]=published' +
    '&depth=2' +
    '&limit=1'
  const data = await fetchJson<PaginatedResponse<ReviewArticle>>(query)
  return data.docs[0] ?? null
}

/** All published buyer guides, with ranked-product relationships resolved. */
export async function getPublishedBuyerGuides(): Promise<BuyerGuide[]> {
  const query =
    '/buyer-guides' +
    '?where[status][equals]=published' +
    '&depth=2' +
    '&limit=200' +
    '&sort=-publishedAt'
  const data = await fetchJson<PaginatedResponse<BuyerGuide>>(query)
  return data.docs
}

/** A single published buyer guide by slug, or null if not found. */
export async function getBuyerGuideBySlug(slug: string): Promise<BuyerGuide | null> {
  const query =
    '/buyer-guides' +
    `?where[slug][equals]=${encodeURIComponent(slug)}` +
    '&where[status][equals]=published' +
    '&depth=2' +
    '&limit=1'
  const data = await fetchJson<PaginatedResponse<BuyerGuide>>(query)
  return data.docs[0] ?? null
}

/** All published brand pages, with protector-option relationships resolved. */
export async function getPublishedBrandPages(): Promise<BrandPage[]> {
  const query =
    '/brand-pages' +
    '?where[status][equals]=published' +
    '&depth=2' +
    '&limit=200' +
    '&sort=brandName'
  const data = await fetchJson<PaginatedResponse<BrandPage>>(query)
  return data.docs
}

/** A single published brand page by slug, or null if not found. */
export async function getBrandPageBySlug(slug: string): Promise<BrandPage | null> {
  const query =
    '/brand-pages' +
    `?where[slug][equals]=${encodeURIComponent(slug)}` +
    '&where[status][equals]=published' +
    '&depth=2' +
    '&limit=1'
  const data = await fetchJson<PaginatedResponse<BrandPage>>(query)
  return data.docs[0] ?? null
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}
