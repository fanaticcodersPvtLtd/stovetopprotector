import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { resendAdapter } from '@payloadcms/email-resend'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { CmsAdmins } from './collections/CmsAdmins'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { PricingData } from './collections/PricingData'
import { ComparisonArticles } from './collections/ComparisonArticles'
import { EducationalGuides } from './collections/EducationalGuides'
import { ReviewArticles } from './collections/ReviewArticles'
import { BuyerGuides } from './collections/BuyerGuides'
import { BrandPages } from './collections/BrandPages'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Email: Resend when configured, otherwise Payload's default console
// transport (dev) — verification + notification emails route through this.
const email =
  process.env.RESEND_API_KEY
    ? resendAdapter({
        defaultFromAddress: process.env.RESEND_FROM_EMAIL || 'noreply@stoveguard.us.com',
        defaultFromName: 'StoveGuard Reviews',
        apiKey: process.env.RESEND_API_KEY,
      })
    : undefined

// Origins allowed to make credentialed (cookie) auth requests — the Astro
// frontend. Comma-separated `FRONTEND_URLS` overrides for prod.
const frontendOrigins = (process.env.FRONTEND_URLS || 'http://localhost:4321')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

export default buildConfig({
  admin: {
    // Admin panel is for cms-admins only; visitor `users` can't log in here.
    user: CmsAdmins.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  cors: frontendOrigins,
  csrf: frontendOrigins,
  collections: [
    CmsAdmins,
    Users,
    Media,
    PricingData,
    ComparisonArticles,
    EducationalGuides,
    ReviewArticles,
    BuyerGuides,
    BrandPages,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  ...(email ? { email } : {}),
  sharp,
  plugins: [],
})
