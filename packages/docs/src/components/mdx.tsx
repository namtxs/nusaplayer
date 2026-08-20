import Link from 'next/link'
import { Children, useState, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { Heading } from './heading'

export function Callout({ children }: { children?: ReactNode; type?: string }) {
  return <aside className="np-callout">{children}</aside>
}

export function Tabs({ items, children }: { items: string[]; children?: ReactNode }) {
  const [index, setIndex] = useState(0)
  const panes = Children.toArray(children)
  return (
    <div className="np-tabs">
      <div className="np-tabs-bar" role="tablist">
        {items.map((item, i) => (
          <button
            key={item}
            type="button"
            role="tab"
            className={i === index ? 'on' : undefined}
            onClick={() => setIndex(i)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="np-tabs-pane">{panes[index]}</div>
    </div>
  )
}

export function Tab({ children }: { children?: ReactNode }) {
  return <>{children}</>
}

export const mdxComponents = {
  Callout,
  Tabs,
  Tab,
  h2: (props: { children?: ReactNode }) => <Heading as="h2" {...props} />,
  h3: (props: { children?: ReactNode }) => <Heading as="h3" {...props} />,
  a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const href = props.href || ''
    if (href.startsWith('/') || href.startsWith('#')) {
      return <Link href={href}>{props.children}</Link>
    }
    return <a {...props} />
  }
}
