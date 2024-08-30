import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import rehypeTitleFigure from 'rehype-title-figure'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import rehypeAttrs from 'rehype-attr'
import expressiveCode from 'astro-expressive-code'
import { remarkExcerpt, remarkReadingTime } from './src/remark.mjs'
import { generateSocialImages } from './src/plugins.ts'

// https://astro.build/config
export default defineConfig({
  site: getCurrentDomain(),
  integrations: [
    tailwind({ nesting: true }),
    sitemap(),
    generateSocialImages(),
    expressiveCode({
      themes: ['dark-plus'],
      useDarkModeMediaQuery: false,
    }),
  ],
  prefetch: {
    prefetchAll: true,
  },
  markdown: {
    remarkPlugins: [remarkReadingTime, remarkExcerpt],
    rehypePlugins: [
      [rehypeAttrs, { properties: 'attr' }],
      rehypeTitleFigure,
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          content: {
            type: 'text',
            value: '#',
          },
          headingProperties: { class: 'relative group' },
          properties: {
            ariaHidden: true,
            ariaLabel: 'Header anchor',
            class:
              'invisible group-hover:visible absolute right-full p-1 -mt-1 text-current no-underline',
          },
        },
      ],
    ],
  },
})

function getCurrentDomain() {
  if (process.env.NETLIFY) {
    if (process.env.BRANCH !== 'main') {
      return process.env.DEPLOY_PRIME_URL
    }
    return process.env.URL
  }
  return 'http://localhost:4321'
}
