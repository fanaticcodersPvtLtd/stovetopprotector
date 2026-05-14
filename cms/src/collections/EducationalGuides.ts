import type { CollectionConfig } from 'payload'
import { triggerDeploy } from '../lib/triggerDeploy'
import { toKebabCase } from '../lib/slug'
import { validateHttpUrl } from '../lib/validateUrl'

export const EducationalGuides: CollectionConfig = {
  slug: 'educational-guides',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt'],
    group: 'Content',
    description:
      'Informational, non-commercial guides (thickness, safety, how-to). No pricing or brand comparison — purely educational.',
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
          triggerDeploy(req.payload, `educational-guides/${doc.slug}`)
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
        description: 'e.g. "Stove Protector Thickness Guide: How Thick Is Enough?".',
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
      name: 'keyTakeaway',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'The 40–60 word direct answer / key takeaway, shown in a callout box near the top of the guide.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      admin: { description: 'Main guide content.' },
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
      relationTo: 'educational-guides',
      hasMany: true,
      admin: { description: 'Other educational guides to link at the bottom and in the sidebar.' },
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
