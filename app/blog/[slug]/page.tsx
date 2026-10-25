import Link from "next/link";
import { Arrow } from "app/components/arrow";
import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
import { categoryLabels, formatDate, getBlogPosts, readingTime } from "app/blog/utils";
import { ArticleToc, type TocItem } from "app/components/toc";
import { baseUrl } from "app/sitemap";

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function getTableOfContents(mdxSource: string): TocItem[] {
  let inCodeFence = false;
  let items: TocItem[] = [];

  for (let rawLine of mdxSource.split("\n")) {
    let line = rawLine.trimEnd();

    // Skip fenced code blocks
    if (line.trimStart().startsWith("```")) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    let match = /^(#{2,4})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    let level = match[1].length as 2 | 3 | 4;
    let text = match[2]
      .replace(/\s+#+\s*$/, "") // strip trailing ### in headings like "Title ###"
      .trim();
    if (!text) continue;

    items.push({ level, text, slug: slugify(text) });
  }

  return items;
}

export async function generateStaticParams() {
  let posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post = getBlogPosts().find((post) => post.slug === slug);
  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Blog({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = getBlogPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  const post = posts[index];

  if (!post) {
    notFound();
  }
  // posts are sorted newest first
  const newer = posts[index - 1];
  const older = posts[index + 1];

  const toc = getTableOfContents(post.content);

  return (
    <section className={toc.length > 0 ? "article-page has-toc" : "article-page"}>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `${baseUrl}/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: "Manuel Martín Morante",
            },
          }),
        }}
      />
      <Link href="/blog" className="article-back text-link"><Arrow direction="left" /> All writing</Link>
      <header className="article-header">
        <Link className="eyebrow article-category" href={`/blog?category=${post.metadata.category}`}>{categoryLabels[post.metadata.category]}</Link>
        <h1>{post.metadata.title}</h1>
        <p className="article-summary">{post.metadata.summary}</p>
        <div className="article-meta"><span>Manuel Martín Morante</span><span aria-hidden="true">/</span><time dateTime={post.metadata.publishedAt}>{formatDate(post.metadata.publishedAt)}</time><span aria-hidden="true">/</span><span>{readingTime(post.content)} min read</span></div>
      </header>
      {toc.length > 0 && (
        <details className="article-toc">
          <summary>On this page</summary>
          <nav aria-label="Table of contents"><ul>
            {toc.map((item) => <li key={`${item.level}-${item.slug}`} className={`toc-level-${item.level}`}><a href={`#${item.slug}`}>{item.text}</a></li>)}
          </ul></nav>
        </details>
      )}
      {toc.length > 0 && <aside className="article-aside"><ArticleToc items={toc} /></aside>}
      <article className="prose">
        <CustomMDX source={post.content} />
      </article>
      <nav className="article-pager" aria-label="More writing">
        {older ? <Link className="pager-card" href={`/blog/${older.slug}`}><span>Previous</span><strong>{older.metadata.title}</strong></Link> : <span />}
        {newer ? <Link className="pager-card pager-next" href={`/blog/${newer.slug}`}><span>Next</span><strong>{newer.metadata.title}</strong></Link> : <span />}
      </nav>
    </section>
  );
}
