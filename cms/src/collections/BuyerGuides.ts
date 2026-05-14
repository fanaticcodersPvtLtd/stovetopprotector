import type { CollectionConfig } from 'payload'
import { triggerDeploy } from '../lib/triggerDeploy'
import { toKebabCase } from '../lib/slug'
import { validateHttpUrl } from '../lib/validateUrl'
import { isCmsAdmin } from '../lib/access'

export const BuyerGuides: CollectionConfig = {
  slug: 'buyer-guides',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt'],
    group: 'Content',
    description:
      'Ranked product-list guides (e.g. "Best Stove Top Protectors of 2026"). Ranked entries pull live prices from pricing-data.',
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
        if (!data.slug && typeof data.title === 'string' && data.title.length > 0) {
          data.slug = toKebabCase(data.title)
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
          triggerDeploy(req.payload, `buyer-guides/${doc.slug}`)
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
        description: 'e.g. "Best Stove Top Protectors of 2026: Independently Tested".',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL path segment. Auto-derived from title if left empty.',
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
      name: 'metaDescription',
      type: 'textarea',
      required: true,
      admin: { description: 'SEO meta description — keep under ~160 characters.' },
    },
    {
      name: 'methodology',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'The methodology box: "We tested X products over Y weeks on Z stoves. Here\'s how we ranked them."',
      },
    },
    {
      name: 'rankedProducts',
      type: 'array',
      labels: { singular: 'Ranked Product', plural: 'Ranked Products' },
      admin: {
        description: 'The numbered ranking. Each entry links a pricing-data product.',
      },
      fields: [
        {
          name: 'rank',
          type: 'number',
          required: true,
          min: 1,
          admin: { description: '1-based rank position.' },
        },
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'pricing-data',
          required: true,
          admin: { description: 'The ranked product — price pulled live on next build.' },
        },
        {
          name: 'ourScore',
          type: 'number',
          required: true,
          min: 0,
          max: 5,
          admin: { description: 'Our score for this product, 0–5.' },
        },
        {
          name: 'badge',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: 'Best Overall', value: 'best-overall' },
            { label: 'Best for Gas', value: 'best-for-gas' },
            { label: 'Best for Glass-Top', value: 'best-for-glass' },
            { label: 'Best Budget', value: 'best-budget' },
            { label: 'Best for RV', value: 'best-for-rv' },
            { label: 'None', value: 'none' },
          ],
        },
        {
          name: 'positives',
          type: 'textarea',
          required: true,
          admin: { description: 'One paragraph — what this product does well.' },
        },
        {
          name: 'drawbacks',
          type: 'textarea',
          required: true,
          admin: { description: 'One paragraph — drawbacks.' },
        },
      ],
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      admin: {
        description: 'Main guide content — "what to look for", "common mistakes buyers make".',
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
      name: 'relatedGuides',
      type: 'relationship',
      relationTo: 'buyer-guides',
      hasMany: true,
      admin: { description: 'Other buyer guides to link at the bottom and in the sidebar.' },
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
