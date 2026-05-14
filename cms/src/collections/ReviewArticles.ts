import type { CollectionConfig } from 'payload'
import { triggerDeploy } from '../lib/triggerDeploy'
import { toKebabCase } from '../lib/slug'
import { validateHttpUrl } from '../lib/validateUrl'
import { isCmsAdmin } from '../lib/access'
import { autoPostArticle } from '../lib/socialPost'

export const ReviewArticles: CollectionConfig = {
  slug: 'review-articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'brand', 'ratingOutOf5', 'status', 'publishedAt'],
    group: 'Content',
    description:
      'Single-brand deep-dive reviews. The product-lineup table pulls live prices from linked pricing-data entries.',
  },
  access: {
    read: () => true,
    create: isCmsAdmin,
    update: isCmsAdmin,
    delete: isCmsAdmin,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        if (!data.slug && typeof data.brand === 'string' && data.brand.length > 0) {
          data.slug = toKebabCase(data.brand)
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
      ({ doc, previousDoc, req }) => {
        if (doc?.status === 'published') {
          triggerDeploy(req.payload, `review-articles/${doc.slug}`)
          if (previousDoc?.status !== 'published') {
            autoPostArticle(req.payload, { title: doc.title, path: `/reviews/${doc.slug}` })
          }
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
        description: 'e.g. "StoveGuard Review 2026: Honest Independent Breakdown".',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL path segment. Auto-derived from brand if left empty.',
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
      name: 'ratingOutOf5',
      type: 'number',
      required: true,
      min: 0,
      max: 5,
      admin: {
        position: 'sidebar',
        description: 'Overall review score, 0–5.',
      },
    },
    {
      name: 'brand',
      type: 'text',
      required: true,
      admin: { description: 'The single brand under review.' },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      required: true,
      admin: { description: 'SEO meta description — keep under ~160 characters.' },
    },
    {
      name: 'verdict',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'TL;DR verdict box copy — conclusion first (this is what AI Overviews pull).',
      },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      admin: {
        description:
          'Main review body — company background, material breakdown, customer sentiment, first-hand review.',
      },
    },
    {
      name: 'pros',
      type: 'array',
      labels: { singular: 'Pro', plural: 'Pros' },
      admin: { description: 'Honest positives — "What users love".' },
      fields: [{ name: 'point', type: 'text', required: true }],
    },
    {
      name: 'cons',
      type: 'array',
      labels: { singular: 'Con', plural: 'Cons' },
      admin: { description: 'Honest negatives — "Common complaints".' },
      fields: [{ name: 'point', type: 'text', required: true }],
    },
    {
      name: 'productLineup',
      type: 'relationship',
      relationTo: 'pricing-data',
      hasMany: true,
      admin: {
        description:
          "The brand's product tiers shown in the lineup table. Prices pulled live from pricing-data on next build.",
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
      name: 'relatedReviews',
      type: 'relationship',
      relationTo: 'review-articles',
      hasMany: true,
      admin: { description: 'Other brand reviews to link at the bottom and in the sidebar.' },
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
