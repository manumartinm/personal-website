# Manuel Martín Morante — Work & writing

A monochrome portfolio and MDX publication built with Next.js, React, and Tailwind. The homepage includes a lazy-loaded Three.js trefoil knot; article routes never load the scene.

## Development

```sh
pnpm install
pnpm dev
```

Validate with `pnpm exec tsc --noEmit` and `pnpm build`. Serve the production build with `pnpm start`.

## Writing

Posts live in `app/blog/posts/*.mdx`. Keep existing filenames to preserve their public URLs. Required frontmatter:

```yaml
---
title: "Post title"
publishedAt: "2026-10-09"
summary: "A short description."
category: "technical"
---
```

Use `technical` for technical writing or `essay` for personal essays. Both categories appear at `/blog`; links with `?category=technical` or `?category=essay` are shareable. Unknown filters show all writing. The homepage automatically displays the newest two posts per category. Keep each article in its original language.

LaTeX, GFM tables, code highlighting, and RSS are supported. All interface colors and code tokens are grayscale.

## Sculpture

Motion pauses when offscreen, when the tab is hidden, or via the Pause button. Reduced-motion preferences disable animation. A static SVG is shown while loading and if WebGL is unavailable. Regenerate the fallback after changing its geometry with `node scripts/generate-sculpture.mjs`.

## Publishing

Production is https://personal-web-ten-blue.vercel.app. Vercel deploys the GitHub repository’s `main` branch automatically. The production URL in `app/sitemap.ts` also controls RSS and social metadata.

Experience is maintained in `app/data/experience.ts` from career details supplied by Manuel. All eight roles have explicit start and end dates; the March 2026 MIT hackathon recognition is separate from the October–November 2025 research appointment.
