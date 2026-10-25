'use client'

import Link from 'next/link'
import { useLayoutEffect, useRef, useState } from 'react'

type Filter = { label: string; value?: string; count: number }

// Pill tabs with an indicator that slides to the active filter.
export function BlogFilters({ filters, active }: { filters: Filter[]; active?: string }) {
  const nav = useRef<HTMLElement>(null)
  const [box, setBox] = useState<{ x: number; w: number } | null>(null)

  useLayoutEffect(() => {
    const measure = () => {
      const el = nav.current?.querySelector<HTMLElement>('a[aria-current]')
      if (el) setBox({ x: el.offsetLeft, w: el.offsetWidth })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [active])

  return (
    <nav ref={nav} className="writing-filters pill-glass" aria-label="Filter writing">
      {box && <span className="filter-indicator" style={{ transform: `translateX(${box.x}px)`, width: box.w }} aria-hidden="true" />}
      {filters.map((f) => (
        <Link key={f.label} href={f.value ? `/blog?category=${f.value}` : '/blog'} scroll={false} aria-current={active === f.value ? 'page' : undefined}>
          {f.label}<span>{String(f.count).padStart(2, '0')}</span>
        </Link>
      ))}
    </nav>
  )
}
