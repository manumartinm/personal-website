import { BlogPosts } from 'app/components/posts'
import { BlogFilters } from 'app/components/blog-filters'
import { PostPreview } from 'app/components/post-preview'
import { getBlogPosts, isPostCategory } from './utils'

export const metadata = {
  title: 'Writing',
  description: 'Technical deep dives on software, mathematics, and scientific computing, alongside personal essays by Manuel Martín Morante.',
}

export default async function Page({ searchParams }: { searchParams: Promise<{ category?: string | string[] }> }) {
  const params = await searchParams
  const category = isPostCategory(params.category) ? params.category : undefined
  const posts = getBlogPosts()
  const filters = [
    { label: 'All writing', value: undefined as string | undefined, count: posts.length },
    { label: 'Technical', value: 'technical', count: posts.filter((post) => post.metadata.category === 'technical').length },
    { label: 'Essays', value: 'essay', count: posts.filter((post) => post.metadata.category === 'essay').length },
  ]
  return (
    <section className="writing-page">
      <div className="page-heading"><p style={{ "--i": 0 } as React.CSSProperties} className="rise section-eyebrow">Notes from an ongoing exploration</p><h1 style={{ "--i": 1 } as React.CSSProperties} className="rise">Writing<span className="muted">.</span></h1><p style={{ "--i": 2 } as React.CSSProperties} className="rise">Sometimes code. Sometimes life.<br />Always an attempt to understand a little more.</p></div>
      <div className="writing-filters-wrap rise" style={{ "--i": 3 } as React.CSSProperties}><BlogFilters filters={filters} active={category} /></div>
      <BlogPosts category={category} preview />
      <PostPreview />
    </section>
  )
}
