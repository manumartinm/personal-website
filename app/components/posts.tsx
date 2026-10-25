import Link from 'next/link'
import { categoryLabels, formatDate, getBlogPosts, readingTime, type PostCategory } from 'app/blog/utils'
import { Arrow } from './arrow'

export function BlogPosts({ category, limit, compact = false, preview = false }: { category?: PostCategory; limit?: number; compact?: boolean; preview?: boolean }) {
  const posts = getBlogPosts().filter((post) => !category || post.metadata.category === category).slice(0, limit)
  return (
    <div className={compact ? 'post-list post-list-compact' : 'post-list'}>
      {posts.map((post) => (
        <Link key={post.slug} className="post-link reveal" href={`/blog/${post.slug}`} data-preview={preview ? `Read · ${readingTime(post.content)} min` : undefined}>
          <div className="post-meta"><span>{categoryLabels[post.metadata.category]}</span><time dateTime={post.metadata.publishedAt}>{formatDate(post.metadata.publishedAt)}</time>{!compact && <span className="post-reading">{readingTime(post.content)} min read</span>}</div>
          <div className="post-copy"><h3>{post.metadata.title}</h3><p>{post.metadata.summary}</p></div><Arrow />
        </Link>
      ))}
    </div>
  )
}
