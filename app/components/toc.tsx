'use client'

import { useEffect, useState } from 'react'

export type TocItem = { level: 2 | 3 | 4; text: string; slug: string }

// Sticky side table of contents that highlights the section being read.
export function ArticleToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.slug)

  useEffect(() => {
    const headings = items.map((item) => document.getElementById(item.slug)).filter((el): el is HTMLElement => !!el)
    if (!headings.length) return
    const onScroll = () => {
      let current = headings[0].id
      for (const h of headings) if (h.getBoundingClientRect().top < window.innerHeight * 0.3) current = h.id
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [items])

  return (
    <nav className="side-toc" aria-label="Table of contents">
      <p>On this page</p>
      <ul>
        {items.map((item) => (
          <li key={`${item.level}-${item.slug}`} className={`toc-level-${item.level}`}>
            <a href={`#${item.slug}`} aria-current={active === item.slug ? 'location' : undefined}>{item.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
