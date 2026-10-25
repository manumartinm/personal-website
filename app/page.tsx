import Link from 'next/link'
import { BlogPosts } from './components/posts'
import { PixelField } from './components/pixel-field'
import { Arrow } from './components/arrow'
import { PixelIcon, type PixelIconKind } from './components/pixel-icon'

import { experience } from './data/experience'

const interests: { number: string; icon: PixelIconKind; title: string; text: string }[] = [
  { number: '01', icon: 'math', title: 'Mathematics', text: 'The language underneath it all. I’m interested in the ideas behind the algorithms, from linear algebra and probability to the geometry of learning.' },
  { number: '02', icon: 'philosophy', title: 'Philosophy', text: 'A place to slow down and question my assumptions. I write about ambition, agency, and what it means to choose a direction in life.' },
  { number: '03', icon: 'computing', title: 'Computing & science', text: 'Understanding things by building them. Database engines, GPU kernels, molecular simulations: I like following an idea all the way down to the implementation.' },
  { number: '04', icon: 'arts', title: 'Arts', text: 'Another way of understanding the world. I’m interested in how art expresses ideas, challenges familiar perspectives, and gives us something new to think about.' },
  { number: '05', icon: 'sports', title: 'Extreme sports', text: 'Surfing and snowboarding, alongside Muay Thai, BJJ, and powerlifting. A way to get out of my head, stay present, and test my limits.' },
  { number: '06', icon: 'cooking', title: 'Cooking', text: 'Experimenting away from the keyboard. I enjoy the process of turning simple ingredients into something worth sharing.' },
]

function SectionHeading({ eyebrow, id, title, text }: { eyebrow: string; id: string; title: string; text: string }) {
  return (
    <div className="section-heading reveal">
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 id={id} className="text-fill">{title}</h2>
      <p>{text}</p>
    </div>
  )
}

export default function Page() {
  const now = experience.find((item) => item.current)
  const past = experience.filter((item) => !item.current)

  return (
    <>
      <section className="hero" aria-labelledby="intro-title">
        <PixelField />
        <p style={{ "--i": 0 } as React.CSSProperties} className="rise hero-chip pill-glass"><span className="status-dot" />Manuel Martín Morante · Engineer & researcher</p>
        <h1 style={{ "--i": 1 } as React.CSSProperties} className="rise" id="intro-title">Building things.<br /><span>Questioning everything.</span></h1>
        <p style={{ "--i": 2 } as React.CSSProperties} className="rise hero-description">I build software and explore the mathematics behind it, from database infrastructure and scientific computing to generative models for drug design.</p>
        <div style={{ "--i": 3 } as React.CSSProperties} className="rise hero-links">
          <Link className="button-link" href="#work">See my work</Link>
          <Link className="button-ghost" href="/blog">Read my writing</Link>
        </div>
        <a className="scroll-cue rise" style={{ "--i": 5 } as React.CSSProperties} href="#work"><span>Scroll</span><svg width="2" height="40" aria-hidden="true"><line className="flow-down" x1="1" y1="0" x2="1" y2="40" /></svg></a>
      </section>
      <section className="section" id="work" aria-labelledby="work-title">
        <SectionHeading eyebrow="The work" id="work-title" title="Ideas into practice." text="Engineering, research, and entrepreneurship. Several roles overlapped." />
        {now && (
          <article className="now-card reveal">
            <p className="now-label"><span className="live-dot" aria-hidden="true" />Now</p>
            <div className="now-body">
              <h3>{now.name}</h3>
              <p className="now-role">{now.role}{now.location && <span> · {now.location}</span>}</p>
              <p className="now-summary">{now.summary}</p>
            </div>
            <p className="now-dates">Since {now.startLabel}</p>
          </article>
        )}
        <ol className="timeline">
          {past.map((item) => (
            <li className="timeline-item reveal" key={item.name}>
              <p className="timeline-dates"><time dateTime={item.start}>{item.startLabel}</time><span aria-hidden="true"> — </span><span className="sr-only"> to </span><time dateTime={item.end}>{item.endLabel}</time></p>
              <span className="timeline-node" aria-hidden="true" />
              <div className="timeline-body">
                <h3>{item.name}</h3>
                <p className="timeline-role">{item.role}{item.organization && <span> · {item.organization}</span>}</p>
                <p className="timeline-summary">{item.summary}</p>
                {item.outcome && <p className="timeline-outcome">{item.outcome}</p>}
                {item.details && (
                  <details className="experience-notes">
                    <summary>{item.detailsLabel}</summary>
                    <ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
                  </details>
                )}
                {item.location && <p className="timeline-location">{item.location}</p>}
              </div>
            </li>
          ))}
        </ol>
        <p className="education-note reveal"><span>Foundations</span> Data Science at UPV Valencia and Mathematics at VIU. Theory and practice, side by side.</p>
      </section>
      <section className="section" id="interests" aria-labelledby="interests-title">
        <SectionHeading eyebrow="The questions" id="interests-title" title="What keeps me curious." text="Different ways of looking at the same world." />
        <div className="interests-grid">
          {interests.map((interest) => (
            <article className="interest reveal" style={{ "--i": Number(interest.number) % 3 } as React.CSSProperties} key={interest.number}>
              <div className="interest-top"><PixelIcon kind={interest.icon} /><span className="interest-number">{interest.number}</span></div>
              <h3>{interest.title}</h3><p>{interest.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section" aria-labelledby="writing-title">
        <SectionHeading eyebrow="Field notes" id="writing-title" title="Things I’ve been thinking about." text="Technical deep dives and more personal lines of thought." />
        <div className="writing-columns reveal">
          <div><div className="writing-column-heading"><h3>Technical</h3><Link href="/blog?category=technical" className="text-link">View all <Arrow /><span className="sr-only"> technical posts</span></Link></div><BlogPosts category="technical" limit={2} compact /></div>
          <div><div className="writing-column-heading"><h3>Essays</h3><Link href="/blog?category=essay" className="text-link">View all <Arrow /><span className="sr-only"> essays</span></Link></div><BlogPosts category="essay" limit={2} compact /></div>
        </div>
      </section>
    </>
  )
}
