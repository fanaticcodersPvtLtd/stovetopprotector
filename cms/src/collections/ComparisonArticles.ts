import type { CollectionConfig } from 'payload'
import { triggerDeploy } from '../lib/triggerDeploy'
import { toKebabCase } from '../lib/slug'
import { validateHttpUrl, validateOptionalHttpUrl } from '../lib/validateUrl'

export const ComparisonArticles: CollectionConfig = {
  slug: 'comparison-articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'brandA', 'brandB', 'status', 'publishedAt'],
    group: 'Content',
    description:
      'Brand-vs-brand matchup articles. Prices in the comparison table are pulled live from linked pricing-data entries.',
  },
  access: {
    read: () => true,
    // TODO(issue-6): replace with cms-admins role gate once that collection exists.
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        if (
          !data.slug &&
          typeof data.brandA === 'string' &&
          data.brandA.length > 0 &&
          typeof data.brandB === 'string' &&
          data.brandB.length > 0
        ) {
          data.slug = `${toKebabCase(data.brandA)}-vs-${toKebabCase(data.brandB)}`
        }
        return data
      },
    ],
    beforeChange: [
      ({ data }) => {
        if (data && data.status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
    afterChange: [
      ({ doc, req }) => {
        if (doc?.status === 'published') {
          triggerDeploy(req.payload, `comparison-articles/${doc.slug}`)
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description:
          'e.g. "StoveGuard vs Stove Shield 2026: Tested Side-by-Side".',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL path segment. Auto-derived as {brandA}-vs-{brandB} if left empty.',
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Set automatically when status flips to Published.',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'readTimeMinutes',
      type: 'number',
      min: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'brandA',
      type: 'text',
      required: true,
      admin: { description: 'First brand in the matchup.' },
    },
    {
      name: 'brandB',
      type: 'text',
      required: true,
      admin: { description: 'Second brand in the matchup.' },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      required: true,
      admin: {
        description: 'SEO meta description — keep under ~160 characters.',
      },
    },
    {
      name: 'tldrVerdict',
      type: 'textarea',
      required: true,
      admin: { description: 'The TL;DR verdict box copy shown near the top of the article.' },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      admin: { description: 'Main article body — deep-dive sections.' },
    },
    {
      name: 'comparisonRows',
      type: 'array',
      labels: { singular: 'Comparison Row', plural: 'Comparison Rows' },
      admin: {
        description: 'The top spec table — one row per attribute (price, thickness, warranty, etc.).',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'valueA', type: 'text', required: true },
        { name: 'valueB', type: 'text', required: true },
        {
          name: 'sourceUrl',
          type: 'text',
          validate: validateOptionalHttpUrl,
          admin: { description: 'Citation URL for this row.' },
        },
      ],
    },
    {
      name: 'pricedProducts',
      type: 'relationship',
      relationTo: 'pricing-data',
      hasMany: true,
      admin: {
        description:
          'The pricing-data entries whose live prices appear in this article. One price update propagates here on next build.',
      },
    },
    {
      name: 'faqs',
      type: 'array',
      labels: { singular: 'FAQ', plural: 'FAQs' },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    {
      name: 'relatedArticles',
      type: 'relationship',
      relationTo: 'comparison-articles',
      hasMany: true,
      admin: { description: 'Other comparison articles to link at the bottom.' },
    },
    {
      name: 'sources',
      type: 'array',
      labels: { singular: 'Source', plural: 'Sources' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true, validate: validateHttpUrl },
      ],
    },
  ],
}
