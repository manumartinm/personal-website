'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Arrow } from './arrow'

const links = [
  { href: '/', label: 'Home', active: (p: string) => p === '/' },
  { href: '/#work', label: 'Work' },
  { href: '/#interests', label: 'Interests' },
  { href: '/blog', label: 'Writing', active: (p: string) => p.startsWith('/blog') },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const menu = useRef<HTMLDivElement>(null)

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onClick = (e: MouseEvent) => !menu.current?.contains(e.target as Node) && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [open])

  return (
    <header className="site-header">
      <Link className="wordmark pill-glass" href="/" aria-label="Manuel Martín Morante — home">mm<span>.</span></Link>
      <nav className="pill-glass nav-desktop" aria-label="Main navigation">
        {links.map((l) => <Link key={l.href} href={l.href} aria-current={l.active?.(pathname) ? 'page' : undefined}>{l.label}</Link>)}
      </nav>
      <a className="header-contact pill-dark" href="mailto:manuelmartinmtech@gmail.com">Let’s talk <Arrow /></a>
      <div className="nav-mobile" ref={menu}>
        <button className="pill-dark" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>{open ? 'Close' : 'Menu'}</button>
        <div id="mobile-menu" className="mobile-menu" data-open={open || undefined}>
          {links.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)} aria-current={l.active?.(pathname) ? 'page' : undefined}>{l.label}</Link>)}
          <a className="mobile-menu-cta" href="mailto:manuelmartinmtech@gmail.com">Let’s talk</a>
        </div>
      </div>
    </header>
  )
}
