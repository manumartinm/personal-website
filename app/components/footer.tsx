import { Arrow } from './arrow'
import { PixelField } from './pixel-field'

const links = [
  ['GitHub', 'https://github.com/manumartinm'],
  ['LinkedIn', 'https://www.linkedin.com/in/manumartinmorante/'],
  ['X / Twitter', 'https://x.com/manu__martinm'],
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <section className="closing" aria-labelledby="closing-title">
        <PixelField className="pixel-field-closing" />
        <p className="closing-eyebrow reveal">Keep the conversation going</p>
        <h2 id="closing-title" className="reveal">Have a good question?</h2>
        <p className="closing-text reveal">Peptides, databases, mathematics, or a life decision. I’m always happy to think out loud with someone.</p>
        <div className="closing-links reveal">
          <a className="closing-primary" href="mailto:manuelmartinmtech@gmail.com">Get in touch</a>
          <a className="closing-secondary" href="https://www.linkedin.com/in/manumartinmorante/" target="_blank" rel="noopener noreferrer">LinkedIn <Arrow /></a>
        </div>
      </section>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Manuel Martín Morante</p>
        <div className="social-links">{links.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noopener noreferrer">{label} <Arrow /></a>)}<a href="/rss">RSS <Arrow /></a></div>
        <a className="back-to-top" href="#top">Back to top ↑</a>
      </div>
    </footer>
  )
}
