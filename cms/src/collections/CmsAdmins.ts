import type { CollectionConfig } from 'payload'
import { isCmsAdmin, isSuperAdmin, isSuperAdminField } from '../lib/access'

/**
 * Admin-panel users. This is Payload's `admin.user` collection.
 * Two roles: `super-admin` (full access incl. user management) and
 * `editor` (content + moderation only).
 */
export const CmsAdmins: CollectionConfig = {
  slug: 'cms-admins',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Administration',
  },
  access: {
    // Editors can see the admin list; only super-admins create/delete admins.
    read: isCmsAdmin,
    create: isSuperAdmin,
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        // Only super-admins may set/change a role.
        create: isSuperAdminField,
        update: isSuperAdminField,
      },
      admin: { description: 'Super Admin: full access. Editor: content + moderation only.' },
    },
  ],
}
