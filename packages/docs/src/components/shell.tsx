import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import { DOCS_NAV, TOP_NAV } from '../nav'
import { Toc } from './toc'

function normalize(path: string) {
  if (path.length > 1 && path.endsWith('/')) return path
  return path === '/' ? '/' : `${path}/`
}

export function Shell({
  children,
  variant
}: {
  children: ReactNode
  variant: 'home' | 'docs' | 'wide'
}) {
  const { asPath } = useRouter()
  const current = normalize(asPath.split('#')[0]!.split('?')[0]!)

  return (
    <div className={`np-shell np-shell-${variant}`}>
      {variant !== 'home' && (
        <header className="np-bar">
          <Link href="/" className="np-brand">
            NusaPlayer
          </Link>
          <nav>
            {TOP_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={current.startsWith(item.href) ? 'on' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
      )}
      {variant === 'docs' ? (
        <div className="np-docs">
          <aside className="np-side">
            {DOCS_NAV.map((item) =>
              item.href ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className={current === normalize(item.href) ? 'on' : undefined}
                >
                  {item.label}
                </Link>
              ) : (
                <p key={item.label} className="np-side-label">
                  {item.label}
                </p>
              )
            )}
          </aside>
          <article className="np-article">{children}</article>
          <Toc />
        </div>
      ) : (
        <div className={variant === 'wide' ? 'np-wide' : undefined}>{children}</div>
      )}
    </div>
  )
}
