import type { CollectionConfig } from 'payload'
import { triggerDeploy } from '../lib/triggerDeploy'
import { toKebabCase } from '../lib/slug'
import { validateHttpUrl } from '../lib/validateUrl'
import { isCmsAdmin } from '../lib/access'
import { autoPostArticle } from '../lib/socialPost'

export const BrandPages: CollectionConfig = {
  slug: 'brand-pages',
  admin: {
    useAsTitle: 'brandName',
    defaultColumns: ['brandName', 'status', 'publishedAt'],
    group: 'Content',
    description:
      'Structured data for appliance brands (GE, Samsung, etc.). The frontend auto-generates the page from this data.',
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
        if (!data.slug && typeof data.brandName === 'string' && data.brandName.length > 0) {
          data.slug = toKebabCase(data.brandName)
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
          triggerDeploy(req.payload, `brand-pages/${doc.slug}`)
          if (previousDoc?.status !== 'published') {
            autoPostArticle(req.payload, {
              title: `Best Stove Top Protectors for ${doc.brandName} Stoves`,
              path: `/brands/${doc.slug}`,
            })
          }
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'brandName',
      type: 'text',
      required: true,
      admin: { description: 'Appliance brand, e.g. "GE", "Samsung", "Frigidaire".' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL path segment. Auto-derived from brand name if left empty.',
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
      name: 'metaDescription',
      type: 'textarea',
      required: true,
      admin: { description: 'SEO meta description — keep under ~160 characters.' },
    },
    {
      name: 'intro',
      type: 'textarea',
      required: true,
      admin: {
        description:
          "What makes this brand's stoves tricky for protectors (sealed vs open burners, glass vs coil, etc.).",
      },
    },
    {
      name: 'stoveModels',
      type: 'array',
      labels: { singular: 'Stove Model', plural: 'Stove Models' },
      admin: { description: 'Popular stove model series for this brand.' },
      fields: [
        { name: 'seriesName', type: 'text', required: true },
        {
          name: 'stoveType',
          type: 'select',
          required: true,
          options: [
            { label: 'Gas', value: 'gas' },
            { label: 'Electric', value: 'electric' },
            { label: 'Induction', value: 'induction' },
            { label: 'Glass-Top', value: 'glass-top' },
          ],
        },
        { name: 'burnerCount', type: 'number', min: 0 },
        {
          name: 'sizeInches',
          type: 'text',
          admin: { description: 'e.g. "30" or "36".' },
        },
      ],
    },
    {
      name: 'protectorOptions',
      type: 'array',
      labels: { singular: 'Protector Option', plural: 'Protector Options' },
      admin: {
        description:
          'Which protector products serve this appliance brand. Price pulled live from pricing-data.',
      },
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'pricing-data',
          required: true,
        },
        {
          name: 'compatibilityNote',
          type: 'textarea',
          admin: { description: 'Which models it fits, caveats, install notes.' },
        },
      ],
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      admin: { description: 'Install tips and deeper guidance specific to this brand.' },
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
      name: 'relatedBrands',
      type: 'relationship',
      relationTo: 'brand-pages',
      hasMany: true,
      admin: { description: 'Other appliance brand pages to link.' },
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
