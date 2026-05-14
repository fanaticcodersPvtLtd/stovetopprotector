import type { CollectionConfig } from 'payload'
import { randomUUID } from 'crypto'
import { isCmsAdmin } from '../lib/access'
import { sendNewsletterConfirmationEmail } from '../lib/notify'

/**
 * Newsletter subscribers with double opt-in.
 *  - public `create` → row lands `pending` with a confirmation token
 *  - confirm / unsubscribe happen through token-keyed custom endpoints
 *    (NOT open `update` access)
 *  - cms-admins read/manage the list
 */
export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'subscribedAt'],
    group: 'Community',
  },
  access: {
    create: () => true, // anyone may sign up
    read: isCmsAdmin,
    update: isCmsAdmin,
    delete: isCmsAdmin,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (!data) return data
        if (typeof data.email === 'string') {
          data.email = data.email.trim().toLowerCase()
        }
        if (operation === 'create') {
          data.status = 'pending'
          data.confirmationToken = randomUUID()
        }
        return data
      },
    ],
    afterChange: [
      ({ doc, operation, req }) => {
        if (operation === 'create' && doc?.confirmationToken) {
          void sendNewsletterConfirmationEmail(req.payload, {
            email: doc.email,
            confirmationToken: doc.confirmationToken,
          })
        }
        return doc
      },
    ],
  },
  endpoints: [
    {
      // POST /api/newsletter-subscribers/confirm  { token }
      path: '/confirm',
      method: 'post',
      handler: async (req) => {
        // Payload pre-parses the JSON body onto req.data for endpoint handlers.
        const data =
          (req.data as { token?: string } | undefined) ??
          ((await req.json?.()) as { token?: string } | undefined)
        const token = data?.token
        if (!token) {
          return Response.json({ error: 'Missing token.' }, { status: 400 })
        }
        const found = await req.payload.find({
          collection: 'newsletter-subscribers',
          where: { confirmationToken: { equals: token } },
          limit: 1,
          overrideAccess: true,
        })
        const sub = found.docs[0]
        if (!sub) {
          return Response.json({ error: 'Invalid or expired token.' }, { status: 404 })
        }
        await req.payload.update({
          collection: 'newsletter-subscribers',
          id: sub.id,
          data: {
            status: 'subscribed',
            subscribedAt: new Date().toISOString(),
            // Token is intentionally kept — it's the stable per-subscriber
            // secret that the unsubscribe link in every digest relies on.
          },
          overrideAccess: true,
        })
        return Response.json({ message: 'Subscription confirmed.' })
      },
    },
    {
      // POST /api/newsletter-subscribers/unsubscribe  { token }
      path: '/unsubscribe',
      method: 'post',
      handler: async (req) => {
        const data =
          (req.data as { token?: string } | undefined) ??
          ((await req.json?.()) as { token?: string } | undefined)
        const token = data?.token
        if (!token) {
          return Response.json({ error: 'Missing token.' }, { status: 400 })
        }
        // The confirmation token is kept on the row after confirm, so it's the
        // stable secret for the unsubscribe link too.
        const found = await req.payload.find({
          collection: 'newsletter-subscribers',
          where: { confirmationToken: { equals: token } },
          limit: 1,
          overrideAccess: true,
        })
        const sub = found.docs[0]
        if (!sub) {
          return Response.json({ error: 'Invalid or expired token.' }, { status: 404 })
        }
        await req.payload.update({
          collection: 'newsletter-subscribers',
          id: sub.id,
          data: {
            status: 'unsubscribed',
            unsubscribedAt: new Date().toISOString(),
          },
          overrideAccess: true,
        })
        return Response.json({ message: 'You have been unsubscribed.' })
      },
    },
  ],
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Subscribed', value: 'subscribed' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'confirmationToken',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Double opt-in token. Kept for confirm + unsubscribe links.',
      },
    },
    {
      name: 'subscribedAt',
      type: 'date',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'unsubscribedAt',
      type: 'date',
      admin: { readOnly: true, position: 'sidebar' },
    },
  ],
}
