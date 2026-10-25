'use client'

import { useEffect, useRef } from 'react'

// Thin ink line at the top of the viewport that tracks scroll progress.
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      bar.current?.style.setProperty('--progress', String(max > 0 ? window.scrollY / max : 0))
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])
  return <div ref={bar} className="scroll-progress" aria-hidden="true" />
}

// Marks every `.reveal` element with `data-shown` once it enters the viewport,
// including elements rendered later (e.g. when the blog filter changes).
export function RevealObserver() {
  useEffect(() => {
    const pending = () => document.querySelectorAll<HTMLElement>('.reveal:not([data-shown])')
    if (!('IntersectionObserver' in window)) {
      pending().forEach((el) => el.setAttribute('data-shown', ''))
      return
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.setAttribute('data-shown', '')
        observer.unobserve(entry.target)
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    const observeAll = () => pending().forEach((el) => observer.observe(el))
    observeAll()
    const mutations = new MutationObserver(observeAll)
    mutations.observe(document.body, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      mutations.disconnect()
    }
  }, [])
  return null
}
