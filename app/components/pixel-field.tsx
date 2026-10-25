'use client'

import { useEffect, useRef } from 'react'

// Dot-matrix background: vector motifs (formulas, a peptide chain, a Greek
// theatre, attractors…) are drawn onto a low-res offscreen canvas, then
// re-rendered as square "pixels" that shimmer and react to the cursor.

const CELL = 3
const DOT = 2

type Ctx = CanvasRenderingContext2D

const FORMULAS = [
  'e^iπ + 1 = 0', 'E = mc²', '∫e^−x² dx = √π', 'iℏ ∂ψ/∂t = Ĥψ', '∇·E = ρ/ε₀', '∇×B = μ₀J', 'F = ma',
  'a² + b² = c²', 'φ = (1+√5)/2', 'ζ(2) = π²/6', 'Σ 1/n² = π²/6', 'ΔxΔp ≥ ℏ/2', 'S = k ln W', 'PV = nRT',
  'e = Σ 1/n!', 'f(x) = Σ aₙxⁿ', 'df/dx', '∂u/∂t = α∇²u', 'G = H − TS', 'λ = h/p', 'E = hν', 'F = Gm₁m₂/r²',
  'det(A − λI) = 0', 'Ax = λx', '∮ F·dr', 'p(x) ∝ e^−E/kT', 'σ(x) = 1/(1+e^−x)', 'softmax(z)ᵢ', 'QKᵀ/√d',
  'P(A|B) = P(B|A)P(A)/P(B)', 'H = −Σ p log p', 'V − E + F = 2', 'lim ε→0', 'ℝⁿ', '∀ε ∃δ', 'Γ(n) = (n−1)!',
  'sin²θ + cos²θ = 1', '∇f = 0', 'ds² = −c²dt² + dx²', 'Rμν − ½Rgμν = 8πGTμν', 'L = T − V', 'δS = 0',
  'x(t) = A cos(ωt + φ)', '∂L/∂q − d/dt ∂L/∂q̇ = 0', 'ΔG = ΔH − TΔS', 'k = A e^−Eₐ/RT', 'Ψ = Σ cₙφₙ',
  '⟨ψ|Ĥ|ψ⟩', '[x̂, p̂] = iℏ', 'N(μ, σ²)', 'E[X] = Σ x p(x)', 'π ≈ 3.14159', '∞', 'ℵ₀', 'n! ≈ √2πn (n/e)ⁿ',
]

function paint(c: Ctx, w: number, h: number) {
  c.clearRect(0, 0, w, h)
  c.fillStyle = c.strokeStyle = '#000'
  c.textAlign = 'center'; c.textBaseline = 'middle'
  // seeded RNG so the layout is stable across resizes
  let seed = 11
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  const small = w < 700
  const boxes: number[][] = []
  const hits = (x: number, y: number, bw: number, bh: number) =>
    boxes.some(([bx, by, bbw, bbh]) => Math.abs(bx - x) < (bw + bbw) / 2 + 14 && Math.abs(by - y) < (bh + bbh) / 2 + 10)
  const attempts = Math.round((w * h) / 250)
  for (let n = 0; n < attempts; n++) {
    const size = (small ? 11 : 13) + Math.pow(rnd(), 2.5) * (small ? 9 : 13)
    const text = FORMULAS[Math.floor(rnd() * FORMULAS.length)]
    c.font = `${size > 18 ? 600 : 500} ${size}px Georgia, serif`
    const bw = c.measureText(text).width, bh = size * 1.1
    const x = rnd() * w, y = rnd() * h
    if (x - bw / 2 < -20 || x + bw / 2 > w + 20 || hits(x, y, bw, bh)) continue
    boxes.push([x, y, bw, bh])
    c.save()
    c.translate(x, y)
    c.rotate((rnd() - 0.5) * 0.35)
    c.globalAlpha = 0.45 + rnd() * 0.55
    c.fillText(text, 0, 0)
    c.restore()
  }
}

export function PixelField({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const off = document.createElement('canvas')
    const octx = off.getContext('2d', { willReadFrequently: true })!

    let cells: { x: number; y: number; a: number; seed: number }[] = []
    let width = 0, height = 0, dpr = 1, frame = 0, start = performance.now()
    const mouse = { x: -9999, y: -9999 }

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.floor(rect.width); height = Math.floor(rect.height)
      // not laid out yet (or hidden): the ResizeObserver rebuilds once it has a size
      if (width < 1 || height < 1) { cells = []; return }
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr; canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cols = Math.ceil(width / CELL), rows = Math.ceil(height / CELL)
      // draw at full size, sample at cell centres
      off.width = width; off.height = height
      paint(octx, width, height)
      const data = octx.getImageData(0, 0, width, height).data
      cells = []
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        let sum = 0
        for (let dy = 0; dy < CELL; dy++) for (let dx = 0; dx < CELL; dx++) {
          const px = i * CELL + dx, py = j * CELL + dy
          if (px < width && py < height) sum += data[(Math.floor(py) * Math.floor(width) + Math.floor(px)) * 4 + 3]
        }
        const a = sum / (CELL * CELL * 255)
        if (a > 0.12) cells.push({ x: i * CELL, y: j * CELL, a: Math.min(1, a * 1.8), seed: Math.random() })
        else if (Math.random() < 0.002) cells.push({ x: i * CELL, y: j * CELL, a: 0.18, seed: Math.random() })
      }
      start = performance.now()
    }

    const draw = (now: number) => {
      const t = (now - start) / 1000
      ctx.clearRect(0, 0, width, height)
      const ink = getComputedStyle(canvas).color
      ctx.fillStyle = ink
      for (const c of cells) {
        // diagonal sweep-in, then gentle shimmer
        const appear = Math.min(1, Math.max(0, (t * 1100 - (c.x * 0.6 + c.y) - c.seed * 200) / 300))
        if (appear <= 0) continue
        const shimmer = reduce ? 1 : 0.75 + 0.25 * Math.sin(t * 1.4 + c.seed * 12)
        const dx = c.x - mouse.x, dy = c.y - mouse.y
        const near = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 120)
        ctx.globalAlpha = Math.min(1, c.a * appear * shimmer + near * 0.6 * c.a)
        const s = DOT + near * 1.2
        ctx.fillRect(c.x + (CELL - s) / 2, c.y + (CELL - s) / 2, s, s)
      }
      ctx.globalAlpha = 1
      if (!reduce || t < 3) frame = requestAnimationFrame(draw)
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top
    }
    const onLeave = () => { mouse.x = mouse.y = -9999 }

    build()
    frame = requestAnimationFrame(draw)
    const ro = new ResizeObserver(() => {
      build()
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(draw)
    })
    ro.observe(canvas)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    // pause when off-screen
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame)
      if (entry.isIntersecting) frame = requestAnimationFrame(draw)
    })
    io.observe(canvas)

    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect(); io.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={ref} className={`pixel-field ${className}`} aria-hidden="true" />
}
