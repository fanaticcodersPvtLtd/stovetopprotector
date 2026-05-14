import type { CollectionConfig } from 'payload'
import { triggerDeploy } from '../lib/triggerDeploy'
import { isCmsAdmin } from '../lib/access'

const REVIEW_TARGETS = [
  'comparison-articles',
  'review-articles',
  'buyer-guides',
  'educational-guides',
  'brand-pages',
] as const

/**
 * Visitor-submitted reviews. Logged-in visitors submit; everything lands
 * in `pending`; a cms-admin approves/rejects in the admin panel.
 *
 * Security: `author` and `status` are SERVER-enforced in beforeChange —
 * the client payload is never trusted for those.
 */
export const VisitorReviews: CollectionConfig = {
  slug: 'visitor-reviews',
  admin: {
    useAsTitle: 'body',
    defaultColumns: ['body', 'rating', 'author', 'status', 'submittedAt'],
    group: 'Community',
  },
  access: {
    // Logged-in visitors may submit.
    create: ({ req: { user } }) => user?.collection === 'users',
    // Public sees approved only; a visitor also sees their own; cms-admins see all.
    read: ({ req: { user } }) => {
      if (user?.collection === 'cms-admins') return true
      if (user?.collection === 'users') {
        return {
          or: [{ status: { equals: 'approved' } }, { author: { equals: user.id } }],
        }
      }
      return { status: { equals: 'approved' } }
    },
    // Moderation only — cms-admins.
    update: isCmsAdmin,
    delete: isCmsAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (operation === 'create') {
          // Server-enforce: a visitor cannot submit as someone else or self-approve.
          if (req.user?.collection === 'users') {
            data.author = req.user.id
            // Denormalize the display name onto the review. The `users`
            // collection is not publicly readable, so the SSG build can't
            // resolve the author relationship — store the name here instead.
            data.authorName = req.user.displayName ?? 'StoveGuard reader'
          }
          data.status = 'pending'
          data.submittedAt = new Date().toISOString()
        }
        return data
      },
    ],
    afterChange: [
      ({ doc, previousDoc, req }) => {
        // When a review is approved, rebuild so it appears on the page.
        if (doc?.status === 'approved' && previousDoc?.status !== 'approved') {
          triggerDeploy(req.payload, `visitor-reviews/${doc.id}`)
          // TODO(issue-15): send the "your review was approved" email to doc.author
          //   via the Resend adapter once #15 wires notification emails.
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'body',
      type: 'textarea',
      required: true,
      maxLength: 2000,
      admin: { description: 'The review text.' },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      admin: { description: 'Star rating, 1–5.' },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'Set automatically to the submitting visitor — not editable by visitors.',
        readOnly: true,
      },
    },
    {
      name: 'authorName',
      type: 'text',
      admin: {
        readOnly: true,
        description:
          "Denormalized copy of the author's display name (the users collection is not publicly readable).",
      },
    },
    {
      name: 'target',
      type: 'relationship',
      relationTo: [...REVIEW_TARGETS],
      required: true,
      admin: { description: 'The content page this review is about.' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: { position: 'sidebar', description: 'Moderation status. Visitors cannot change this.' },
    },
    {
      name: 'rejectionReason',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'Shown to the visitor when their submission is rejected.',
        condition: (data) => data?.status === 'rejected',
      },
    },
    {
      name: 'submittedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
  ],
}
