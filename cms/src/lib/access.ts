import type { Access, FieldAccess } from 'payload'

/**
 * Access-control helpers. The auth model has two auth collections:
 *  - `cms-admins` — admin-panel users (super-admin / editor)
 *  - `users`      — public-site visitor accounts
 *
 * Content collections: public `read`, `cms-admins`-only write.
 */

/** True when the request is made by any cms-admin (super-admin or editor). */
export const isCmsAdmin: Access = ({ req: { user } }) => user?.collection === 'cms-admins'

/** True only for super-admins. */
export const isSuperAdmin: Access = ({ req: { user } }) =>
  user?.collection === 'cms-admins' && user?.role === 'super-admin'

/** Field-level: super-admin only (e.g. the `role` field on cms-admins). */
export const isSuperAdminField: FieldAccess = ({ req: { user } }) =>
  user?.collection === 'cms-admins' && user?.role === 'super-admin'

/**
 * A visitor may read/update only their own `users` record; cms-admins may
 * access any. Returns a query constraint for non-admins.
 */
export const isSelfOrCmsAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.collection === 'cms-admins') return true
  // visitor — constrain to their own document
  return { id: { equals: user.id } }
}
