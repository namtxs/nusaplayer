import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

type Item = { id: string; text: string; level: 2 | 3 }

export function Toc() {
  const { asPath } = useRouter()
  const [items, setItems] = useState<Item[]>([])
  const [active, setActive] = useState('')

  useEffect(() => {
    const article = document.querySelector('.np-article')
    if (!article) {
      setItems([])
      return
    }

    const heads = Array.from(article.querySelectorAll<HTMLElement>('h2, h3'))
    const next = heads.map((el) => {
      if (!el.id) {
        el.id = el.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9\s-]/gi, '')
          .trim()
          .replace(/[\s-]+/g, '-') || ''
      }
      return {
        id: el.id,
        text: el.textContent?.trim() || el.id,
        level: (el.tagName === 'H3' ? 3 : 2) as 2 | 3
      }
    }).filter((item) => item.id)
    setItems(next)
    setActive(next[0]?.id || '')

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        const id = visible[0]?.target.id
        if (id) setActive(id)
      },
      { root: article, rootMargin: '0px 0px -72% 0px', threshold: 0 }
    )

    heads.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [asPath])

  return (
    <nav className="np-toc" aria-label="On this page">
      <p className="np-toc-label">On this page</p>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`${item.level === 3 ? 'h3' : 'h2'}${active === item.id ? ' on' : ''}`}
          onClick={(event) => {
            event.preventDefault()
            document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            setActive(item.id)
            history.replaceState(null, '', `#${item.id}`)
          }}
        >
          {item.text}
        </a>
      ))}
    </nav>
  )
}
