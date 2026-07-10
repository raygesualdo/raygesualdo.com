import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import { satteri, satteriHeadingIdsPlugin } from '@astrojs/markdown-satteri'
import expressiveCode from 'astro-expressive-code'
import tailwindcss from '@tailwindcss/vite'
import { remarkExcerpt, remarkReadingTime } from './src/remark.mjs'
import { generateSocialImages } from './src/plugins.ts'
import {
  hastAutolinkHeadings,
  hastTitleFigure,
  mdastAttrs,
  mdastExcerpt,
  mdastReadingTime,
} from './src/saterriPlugins.ts'

// https://astro.build/config
export default defineConfig({
  site: getCurrentDomain(),
  integrations: [
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
    processor: wrappedSatteriProcessor(),
  },
  vite: {
    plugins: [tailwindcss()],
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

/** Temporary workaround until Satteri supports visitors to the Root node */
function wrappedSatteriProcessor() {
  const original = satteri({
    features: {
      directive: true,
    },
    mdastPlugins: [mdastReadingTime, mdastExcerpt, mdastAttrs],
    hastPlugins: [satteriHeadingIdsPlugin(), hastAutolinkHeadings, hastTitleFigure],
  })
  async function overriddenCreateRenderer(shared) {
    const ret = await original.createRenderer(shared)
    return {
      render(content, opts) {
        const newContent = content + '\n\n:rootFinder'
        return ret.render(newContent, opts)
      },
    }
  }
  return {
    ...original,
    createRenderer: overriddenCreateRenderer,
  }
}
