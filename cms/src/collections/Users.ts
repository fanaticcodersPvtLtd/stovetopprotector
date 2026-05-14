import type { CollectionConfig } from 'payload'
import { isCmsAdmin, isSelfOrCmsAdmin } from '../lib/access'

/**
 * Public-site visitor accounts. Email + password auth with email
 * verification. NOT admin-panel users — that's `cms-admins`.
 *
 * Per project owner direction (2026-05-14): email-only signup/login.
 * No OAuth (Google/Facebook dropped from the original PRD).
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    verify: true, // require email verification before the account is usable
  },
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'email', '_verified'],
    group: 'Community',
    // Visitors never touch the admin panel; cms-admins manage them here.
    hidden: ({ user }) => user?.collection !== 'cms-admins',
  },
  access: {
    // Anyone can register; a visitor reads/updates only their own record;
    // cms-admins can read/manage all.
    create: () => true,
    read: isSelfOrCmsAdmin,
    update: isSelfOrCmsAdmin,
    delete: isCmsAdmin,
    admin: () => false, // visitors can never log into the admin panel
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      required: true,
      admin: { description: 'Public display name shown on submitted reviews. No real name required.' },
    },
  ],
}
