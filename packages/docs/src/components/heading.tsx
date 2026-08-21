import { isValidElement, type HTMLAttributes, type ReactNode } from 'react'

export function headingText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(headingText).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return headingText(node.props.children)
  return ''
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')
}

export function Heading({
  as: Tag,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { as: 'h2' | 'h3'; children?: ReactNode }) {
  const id = props.id || slugify(headingText(children))
  return (
    <Tag {...props} id={id}>
      {children}
    </Tag>
  )
}
