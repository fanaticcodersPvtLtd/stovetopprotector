/**
 * JSON-LD structured-data builders. Pure functions — no fetching.
 * Each returns a plain object; BaseLayout serializes it into a
 * <script type="application/ld+json"> block with safe escaping.
 */
import type {
  ComparisonArticle,
  ReviewArticle,
  EducationalGuide,
  BuyerGuide,
  BrandPage,
  Faq,
} from './payload'

const ORG_NAME = 'StoveGuard Reviews'

type JsonLd = Record<string, unknown>

/** Serialize JSON-LD for safe embedding in an HTML <script> tag. */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  // Escape `<` so a `</script>` inside CMS-authored content can't break out.
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function articleLd(opts: {
  headline: string
  description: string
  url: string
  datePublished?: string
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    author: { '@type': 'Organization', name: ORG_NAME },
    publisher: { '@type': 'Organization', name: ORG_NAME },
  }
}

export function reviewLd(opts: {
  itemName: string
  description: string
  url: string
  ratingValue: number
  datePublished?: string
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: { '@type': 'Product', name: opts.itemName },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: opts.ratingValue,
      bestRating: 5,
      worstRating: 0,
    },
    name: opts.itemName,
    description: opts.description,
    url: opts.url,
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    author: { '@type': 'Organization', name: ORG_NAME },
  }
}

export function itemListLd(opts: {
  name: string
  url: string
  items: { name: string; url?: string }[]
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: opts.name,
    url: opts.url,
    itemListElement: opts.items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.url ? { url: item.url } : {}),
    })),
  }
}

export function faqPageLd(faqs: Faq[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

// ---- Per-page-type assemblers — return the full JSON-LD array for a page ----

export function comparisonArticleLd(article: ComparisonArticle, url: string): JsonLd[] {
  const ld: JsonLd[] = [
    articleLd({
      headline: article.title,
      description: article.metaDescription,
      url,
      datePublished: article.publishedAt,
    }),
  ]
  if (article.faqs && article.faqs.length > 0) ld.push(faqPageLd(article.faqs))
  return ld
}

export function reviewArticleLd(review: ReviewArticle, url: string): JsonLd[] {
  const ld: JsonLd[] = [
    reviewLd({
      itemName: `${review.brand} stove top protectors`,
      description: review.metaDescription,
      url,
      ratingValue: review.ratingOutOf5,
      datePublished: review.publishedAt,
    }),
  ]
  if (review.faqs && review.faqs.length > 0) ld.push(faqPageLd(review.faqs))
  return ld
}

export function educationalGuideLd(guide: EducationalGuide, url: string): JsonLd[] {
  const ld: JsonLd[] = [
    articleLd({
      headline: guide.title,
      description: guide.metaDescription,
      url,
      datePublished: guide.publishedAt,
    }),
  ]
  if (guide.faqs && guide.faqs.length > 0) ld.push(faqPageLd(guide.faqs))
  return ld
}

export function buyerGuideLd(guide: BuyerGuide, url: string): JsonLd[] {
  const ranked = [...(guide.rankedProducts ?? [])].sort((a, b) => a.rank - b.rank)
  const ld: JsonLd[] = [
    itemListLd({
      name: guide.title,
      url,
      items: ranked.map((entry) => ({
        name: `${entry.product.brand} ${entry.product.productName}`,
        url: entry.product.productUrl,
      })),
    }),
  ]
  if (guide.faqs && guide.faqs.length > 0) ld.push(faqPageLd(guide.faqs))
  return ld
}

export function brandPageLd(brand: BrandPage, url: string): JsonLd[] {
  const ld: JsonLd[] = [
    articleLd({
      headline: `Best Stove Top Protectors for ${brand.brandName} Stoves`,
      description: brand.metaDescription,
      url,
      datePublished: brand.publishedAt,
    }),
  ]
  if (brand.faqs && brand.faqs.length > 0) ld.push(faqPageLd(brand.faqs))
  return ld
}
