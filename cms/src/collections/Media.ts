import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
  },
  access: {
    // Public read — Astro SSG build fetches image URLs.
    read: () => true,
    // TODO(issue-6): replace with cms-admins role gate once that collection exists.
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'Descriptive alt text, e.g. "StoveGuard Premium installed on a GE 5-burner gas stove" — not "stove image 2".',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: { description: 'Optional caption shown beneath the image in article body.' },
    },
    {
      name: 'credit',
      type: 'text',
      admin: { description: 'Optional attribution for third-party or embedded images.' },
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../../media'),
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'card',
        width: 768,
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'feature',
        width: 1200,
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
    ],
  },
}
