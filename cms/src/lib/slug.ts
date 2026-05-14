/**
 * Convert a display string to a URL-safe kebab-case slug.
 * Strips combining diacritical marks (U+0300–U+036F) left behind by NFKD
 * normalization, lowercases, and collapses non-alphanumerics to hyphens.
 */
export function toKebabCase(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
