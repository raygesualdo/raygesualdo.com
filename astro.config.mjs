import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import { remarkReadingTime } from './src/remark-reading-time.mjs'

// https://astro.build/config
export default defineConfig({
  site: getCurrentDomain(),
  integrations: [tailwind()],
  markdown: {
    remarkPlugins: [remarkReadingTime],
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
