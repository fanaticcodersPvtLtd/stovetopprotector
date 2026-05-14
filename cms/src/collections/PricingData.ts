import type { CollectionConfig } from 'payload'

const TRACKING_PARAM_PATTERN = /^(ref|tag|utm_[a-z]+|aff_[a-z]+|affiliate|campaign|source)$/i

function toKebabCase(input: string): string {
  return input
    .normalize('NFKD')
    // strip combining diacritical marks (U+0300–U+036F) left behind by NFKD
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function stripTrackingParams(rawUrl: string): string {
  try {
    const url = new URL(rawUrl)
    for (const key of [...url.searchParams.keys()]) {
      if (TRACKING_PARAM_PATTERN.test(key)) {
        url.searchParams.delete(key)
      }
    }
    return url.toString()
  } catch {
    // Not a parseable URL — leave untouched, field validation will reject it
    return rawUrl
  }
}

export const PricingData: CollectionConfig = {
  slug: 'pricing-data',
  admin: {
    useAsTitle: 'productName',
    defaultColumns: ['brand', 'productName', 'priceUsd', 'inStock', 'lastVerifiedAt'],
    group: 'Catalog',
    description:
      'Single source of truth for product pricing. Referenced by all content types. One update propagates everywhere on next build.',
  },
  access: {
    // Public read enables Astro SSG fetches at build time.
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
        if (!data.brandSlug && typeof data.brand === 'string' && data.brand.length > 0) {
          data.brandSlug = toKebabCase(data.brand)
        }
        return data
      },
    ],
    beforeChange: [
      ({ data }) => {
        if (data && typeof data.productUrl === 'string' && data.productUrl.length > 0) {
          data.productUrl = stripTrackingParams(data.productUrl)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'brand',
      type: 'text',
      required: true,
      admin: { description: 'Display name, e.g. "StoveGuard", "Stove Shield".' },
    },
    {
      name: 'brandSlug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-safe identifier. Auto-derived from brand if left empty.',
      },
    },
    {
      name: 'productName',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "StoveGuard Premium".' },
    },
    {
      name: 'productLine',
      type: 'select',
      options: [
        { label: 'Lite', value: 'lite' },
        { label: 'Premium', value: 'premium' },
        { label: 'Pro', value: 'pro' },
        { label: 'Grip', value: 'grip' },
        { label: 'Standard', value: 'standard' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'priceUsd',
      type: 'number',
      required: true,
      min: 0,
      admin: { description: 'Price in US dollars. Decimals allowed (e.g. 29.99).' },
    },
    {
      name: 'currency',
      type: 'select',
      required: true,
      defaultValue: 'USD',
      options: [{ label: 'USD', value: 'USD' }],
      admin: { description: 'US market only for v1. Schema kept extensible.' },
    },
    {
      name: 'productUrl',
      type: 'text',
      required: true,
      validate: (value: string | null | undefined) => {
        if (typeof value !== 'string' || value.length === 0) {
          return 'Product URL is required.'
        }
        if (!value.startsWith('https://')) {
          return 'Product URL must start with https://'
        }
        try {
          new URL(value)
        } catch {
          return 'Product URL must be a valid URL.'
        }
        return true
      },
      admin: {
        description:
          "Brand's official site URL. Tracking/affiliate query params are stripped automatically on save.",
      },
    },
    {
      name: 'specs',
      type: 'group',
      fields: [
        {
          name: 'thicknessMm',
          type: 'number',
          min: 0,
          admin: { description: 'Material thickness in millimeters.' },
        },
        {
          name: 'materialType',
          type: 'select',
          options: [
            { label: 'Silicone', value: 'silicone' },
            { label: 'Fiberglass-coated silicone', value: 'fiberglass-coated-silicone' },
            { label: 'Aluminized steel', value: 'aluminized-steel' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'heatRatingFahrenheit',
          type: 'number',
          min: 0,
          admin: { description: 'Maximum rated temperature in °F.' },
        },
        {
          name: 'warrantyMonths',
          type: 'number',
          min: 0,
          max: 120,
        },
        {
          name: 'dimensionsInches',
          type: 'text',
          admin: { description: 'Free-form, e.g. "28 x 20".' },
        },
      ],
    },
    {
      name: 'inStock',
      type: 'checkbox',
      required: true,
      defaultValue: true,
    },
    {
      name: 'lastVerifiedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      admin: {
        description: 'Date this price was last manually verified against the official site.',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: { description: 'Internal editor note. Not displayed publicly.' },
    },
  ],
}
