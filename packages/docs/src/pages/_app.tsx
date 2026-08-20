import type { AppProps } from 'next/app'
import Head from 'next/head'
import { MDXProvider } from '@mdx-js/react'
import { useRouter } from 'next/router'
import { Shell } from '../components/shell'
import { mdxComponents } from '../components/mdx'
import { DOCS_NAV, TOP_NAV } from '../nav'
import '../styles/docs.css'

function variant(path: string) {
  if (path === '/') return 'home' as const
  if (path.startsWith('/docs')) return 'docs' as const
  return 'wide' as const
}

function titleFor(path: string) {
  const current = path.length > 1 && path.endsWith('/') ? path : path === '/' ? '/' : `${path}/`
  if (current === '/') return 'NusaPlayer'
  const items = [...DOCS_NAV, ...TOP_NAV].filter(
    (item): item is { href: string; label: string } => Boolean(item.href)
  )
  const exact = items.find((item) => current === item.href)
  if (exact) return `${exact.label} · NusaPlayer`
  const prefix = [...items]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => current.startsWith(item.href))
  return prefix ? `${prefix.label} · NusaPlayer` : 'NusaPlayer'
}

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()
  return (
    <MDXProvider components={mdxComponents}>
      <Head>
        <title>{titleFor(pathname)}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0c0c0d" />
      </Head>
      <Shell variant={variant(pathname)}>
        <Component {...pageProps} />
      </Shell>
    </MDXProvider>
  )
}
