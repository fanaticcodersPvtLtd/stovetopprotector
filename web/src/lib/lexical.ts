/**
 * Minimal Lexical-JSON → HTML converter for SSG rendering.
 * Handles the node types Payload's default Lexical editor emits for
 * article bodies: root, paragraph, heading, list/listitem, link, text
 * (with bold/italic/underline format bitflags), linebreak, quote.
 *
 * This intentionally covers only what the comparison-article body uses.
 * Extend node coverage as richer content types land in later issues.
 */

type LexicalNode = {
  type: string
  tag?: string
  text?: string
  format?: number | string
  url?: string
  fields?: { url?: string; newTab?: boolean }
  listType?: 'bullet' | 'number'
  children?: LexicalNode[]
}

const FORMAT_BOLD = 1
const FORMAT_ITALIC = 1 << 1
const FORMAT_UNDERLINE = 1 << 3

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function renderText(node: LexicalNode): string {
  let html = escapeHtml(node.text ?? '')
  const format = typeof node.format === 'number' ? node.format : 0
  if (format & FORMAT_BOLD) html = `<strong>${html}</strong>`
  if (format & FORMAT_ITALIC) html = `<em>${html}</em>`
  if (format & FORMAT_UNDERLINE) html = `<u>${html}</u>`
  return html
}

function renderChildren(children: LexicalNode[] | undefined): string {
  if (!children) return ''
  return children.map(renderNode).join('')
}

function renderNode(node: LexicalNode): string {
  switch (node.type) {
    case 'text':
      return renderText(node)
    case 'linebreak':
      return '<br />'
    case 'paragraph':
      return `<p>${renderChildren(node.children)}</p>`
    case 'heading': {
      const tag = node.tag && /^h[1-6]$/.test(node.tag) ? node.tag : 'h2'
      return `<${tag}>${renderChildren(node.children)}</${tag}>`
    }
    case 'quote':
      return `<blockquote>${renderChildren(node.children)}</blockquote>`
    case 'list': {
      const tag = node.listType === 'number' ? 'ol' : 'ul'
      return `<${tag}>${renderChildren(node.children)}</${tag}>`
    }
    case 'listitem':
      return `<li>${renderChildren(node.children)}</li>`
    case 'link': {
      const href = node.fields?.url ?? node.url ?? '#'
      const target = node.fields?.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${escapeHtml(href)}"${target}>${renderChildren(node.children)}</a>`
    }
    case 'root':
      return renderChildren(node.children)
    default:
      // Unknown node — render its children so content is never silently dropped.
      return renderChildren(node.children)
  }
}

export type LexicalRichText = { root: LexicalNode } | null | undefined

export function lexicalToHtml(richText: LexicalRichText): string {
  if (!richText || !richText.root) return ''
  return renderNode(richText.root)
}
