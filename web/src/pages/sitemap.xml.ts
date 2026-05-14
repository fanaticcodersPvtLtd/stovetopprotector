import type { APIRoute } from 'astro'
import {
  getPublishedComparisonArticles,
  getPublishedReviewArticles,
  getPublishedBuyerGuides,
  getPublishedEducationalGuides,
  getPublishedBrandPages,
} from '../lib/payload'

const SITE = import.meta.env.SITE_URL ?? 'http://localhost:4321'

function url(path: string, lastmod?: string): string {
  const loc = new URL(path, SITE).href
  return lastmod
    ? `  <url><loc>${loc}</loc><lastmod>${lastmod.slice(0, 10)}</lastmod></url>`
    : `  <url><loc>${loc}</loc></url>`
}

export const GET: APIRoute = async () => {
  const [comparisons, reviews, buyerGuides, eduGuides, brandPages] = await Promise.all([
    getPublishedComparisonArticles(),
    getPublishedReviewArticles(),
    getPublishedBuyerGuides(),
    getPublishedEducationalGuides(),
    getPublishedBrandPages(),
  ])

  const staticPaths = ['/', '/compare', '/reviews', '/best', '/guides', '/brands']

  const entries: string[] = [
    ...staticPaths.map((p) => url(p)),
    ...comparisons.map((d) => url(`/compare/${d.slug}`, d.publishedAt)),
    ...reviews.map((d) => url(`/reviews/${d.slug}`, d.publishedAt)),
    ...buyerGuides.map((d) => url(`/best/${d.slug}`, d.publishedAt)),
    ...eduGuides.map((d) => url(`/guides/${d.slug}`, d.publishedAt)),
    ...brandPages.map((d) => url(`/brands/${d.slug}`, d.publishedAt)),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
