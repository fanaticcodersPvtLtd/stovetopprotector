/**
 * Shared URL field validator for Payload collections.
 * Rejects non-http(s) schemes — blocks `javascript:`, `data:`, etc. that would
 * otherwise reach an `href` attribute on the SSG frontend and execute as XSS.
 */
export function validateHttpUrl(
  value: string | string[] | null | undefined,
): true | string {
  if (typeof value !== 'string' || value.length === 0) {
    return 'URL is required.'
  }
  if (!/^https?:\/\//i.test(value)) {
    return 'URL must start with http:// or https://'
  }
  try {
    new URL(value)
  } catch {
    return 'URL must be a valid, well-formed URL.'
  }
  return true
}

/**
 * Optional variant — same rules, but empty/absent passes (for non-required URL fields).
 */
export function validateOptionalHttpUrl(
  value: string | string[] | null | undefined,
): true | string {
  if (value === undefined || value === null || value === '') return true
  return validateHttpUrl(value)
}
