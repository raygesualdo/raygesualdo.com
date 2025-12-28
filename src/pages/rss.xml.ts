import type { APIContext } from 'astro'
import rss, { type RSSFeedItem } from '@astrojs/rss'
import { render, getCollection } from 'astro:content'
import { filterPostCollection, getPostTitle } from '../utils'

export async function GET(context: APIContext) {
  const posts = await getCollection('posts', filterPostCollection)
  const items = await Promise.all(
    posts.map(async (post) => {
      const { remarkPluginFrontmatter } = await render(post)
      return {
        title: await getPostTitle(post),
        link: `/posts/${post.id}`,
        pubDate: post.data.date ?? new Date(),
        description: remarkPluginFrontmatter.excerpt,
      } satisfies RSSFeedItem
    })
  )
  return rss({
    title: 'RayGesualdo.com',
    description: 'Some thoughts on code, learning, and life',
    site: String(context.site),
    items: items.toSorted((a, b) => a.pubDate.toISOString().localeCompare(b.pubDate.toISOString())),
    customData: `<language>en</language>
<copyright>Copyright © Ray Gesualdo ${new Date().getFullYear()}</copyright>`,
  })
}
