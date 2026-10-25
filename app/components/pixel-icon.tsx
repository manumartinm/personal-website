'use client'

import { useEffect, useRef } from 'react'

// Small dot-matrix illustration, drawn with the same language as the hero field.
export type PixelIconKind = 'math' | 'philosophy' | 'computing' | 'arts' | 'sports' | 'cooking'

const SIZE = 72
const CELL = 4

type Ctx = CanvasRenderingContext2D

const drawers: Record<PixelIconKind, (c: Ctx) => void> = {
  math: (c) => { c.font = '700 60px Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('∑', 36, 38) },
  philosophy: (c) => { // owl of Athena-ish: two eyes over a laurel arc
    c.lineWidth = 5
    for (const x of [24, 48]) { c.beginPath(); c.arc(x, 30, 10, 0, Math.PI * 2); c.stroke(); c.beginPath(); c.arc(x, 30, 3, 0, Math.PI * 2); c.fill() }
    c.beginPath(); c.moveTo(32, 44); c.lineTo(36, 52); c.lineTo(40, 44); c.stroke()
    c.beginPath(); c.arc(36, 30, 30, Math.PI * 0.2, Math.PI * 0.8); c.stroke()
  },
  computing: (c) => { // chip
    c.lineWidth = 5; c.strokeRect(20, 20, 32, 32); c.fillRect(30, 30, 12, 12)
    for (let k = 0; k < 3; k++) {
      const o = 26 + k * 10
      c.fillRect(o - 2, 6, 4, 12); c.fillRect(o - 2, 54, 4, 12); c.fillRect(6, o - 2, 12, 4); c.fillRect(54, o - 2, 12, 4)
    }
  },
  arts: (c) => { // ionic column
    c.lineWidth = 5
    c.fillRect(14, 10, 44, 6); c.fillRect(14, 58, 44, 6)
    c.beginPath(); c.arc(18, 21, 5, 0, Math.PI * 2); c.stroke(); c.beginPath(); c.arc(54, 21, 5, 0, Math.PI * 2); c.stroke()
    for (const x of [26, 36, 46]) c.fillRect(x - 2, 26, 4, 30)
  },
  sports: (c) => { // wave
    c.lineWidth = 6; c.lineCap = 'round'
    c.beginPath(); c.moveTo(6, 52)
    c.bezierCurveTo(20, 52, 22, 18, 42, 16); c.bezierCurveTo(56, 15, 62, 28, 54, 34); c.bezierCurveTo(48, 38, 40, 30, 46, 26)
    c.stroke(); c.beginPath(); c.moveTo(6, 62); c.lineTo(66, 62); c.stroke()
  },
  cooking: (c) => { // pot with steam
    c.lineWidth = 5
    c.fillRect(12, 34, 48, 6); c.strokeRect(16, 40, 40, 22); c.fillRect(6, 44, 10, 4); c.fillRect(56, 44, 10, 4)
    c.lineCap = 'round'
    for (const x of [26, 36, 46]) { c.beginPath(); c.moveTo(x, 28); c.bezierCurveTo(x - 6, 22, x + 6, 16, x, 8); c.stroke() }
  },
}

export function PixelIcon({ kind }: { kind: PixelIconKind }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const off = document.createElement('canvas')
    off.width = off.height = SIZE
    const o = off.getContext('2d', { willReadFrequently: true })!
    o.fillStyle = o.strokeStyle = '#000'
    drawers[kind](o)
    const data = o.getImageData(0, 0, SIZE, SIZE).data
    const dots: number[][] = []
    for (let y = 0; y < SIZE; y += CELL) for (let x = 0; x < SIZE; x += CELL) {
      let sum = 0
      for (let dy = 0; dy < CELL; dy++) for (let dx = 0; dx < CELL; dx++) sum += data[((y + dy) * SIZE + x + dx) * 4 + 3]
      if (sum / (CELL * CELL * 255) > 0.25) dots.push([x, y])
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = canvas.height = SIZE * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const card = canvas.closest('.interest')
    let frame = 0, hover = false, start = performance.now()
    const draw = (now: number) => {
      const t = (now - start) / 1000
      ctx.clearRect(0, 0, SIZE, SIZE)
      ctx.fillStyle = getComputedStyle(canvas).color
      for (const [x, y] of dots) {
        const wave = hover && !reduce ? Math.max(0, Math.sin(t * 6 - (x + y) / 14)) : 0
        const s = 2.6 + wave * 1.2
        ctx.globalAlpha = 0.85 + wave * 0.15
        ctx.fillRect(x + (CELL - s) / 2, y + (CELL - s) / 2, s, s)
      }
      if (hover) frame = requestAnimationFrame(draw)
    }
    const enter = () => { hover = true; start = performance.now(); cancelAnimationFrame(frame); frame = requestAnimationFrame(draw) }
    const leave = () => { hover = false; cancelAnimationFrame(frame); frame = requestAnimationFrame(draw) }
    draw(performance.now())
    card?.addEventListener('pointerenter', enter)
    card?.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      card?.removeEventListener('pointerenter', enter)
      card?.removeEventListener('pointerleave', leave)
    }
  }, [kind])

  return <canvas ref={ref} className="pixel-icon" width={SIZE} height={SIZE} aria-hidden="true" />
}
