'use client'

import { useEffect, useRef } from 'react'

// Floating card that follows the cursor over post rows with `data-preview`.
export function PostPreview() {
  const card = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const el = card.current!
    let x = 0, y = 0, tx = 0, ty = 0, frame = 0
    const loop = () => {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18
      el.style.transform = `translate(${x + 18}px, ${y + 18}px)`
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(loop) : 0
    }
    const onMove = (e: PointerEvent) => {
      const row = (e.target as Element).closest<HTMLElement>('[data-preview]')
      if (!row) { el.removeAttribute('data-visible'); return }
      if (!el.hasAttribute('data-visible')) { x = tx = e.clientX; y = ty = e.clientY }
      el.textContent = row.dataset.preview ?? ''
      el.setAttribute('data-visible', '')
      tx = e.clientX; ty = e.clientY
      if (!frame) frame = requestAnimationFrame(loop)
    }
    const hide = () => el.removeAttribute('data-visible')
    document.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', hide, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', hide)
    }
  }, [])

  return <div ref={card} className="post-preview" aria-hidden="true" />
}
