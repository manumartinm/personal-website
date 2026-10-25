import Link from 'next/link'
import { Arrow } from './components/arrow'

export default function NotFound() {
  return <section className="not-found"><p className="eyebrow">404 / A loose end</p><h1>Nothing here. Yet.</h1><p>The page you’re looking for doesn’t exist.</p><Link className="text-link" href="/"><Arrow direction="left" /> Back home</Link></section>
}
