import type { APIContext } from 'astro'
import rss, { type RSSFeedItem } from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { filterPostCollection, getPostTitle } from '../utils'

export async function GET(context: APIContext) {
  const posts = await getCollection('posts', filterPostCollection)
  return rss({
    title: 'RayGesualdo.com',
    description: 'Some thoughts on code, learning, and life',
    site: String(context.site),
    items: await Promise.all(
      posts.map(async (post) => {
        const { remarkPluginFrontmatter } = await post.render()
        return {
          title: await getPostTitle(post),
          link: `/posts/${post.slug}`,
          pubDate: post.data.date ?? new Date(),
          description: remarkPluginFrontmatter.excerpt,
        } satisfies RSSFeedItem
      })
    ),
    customData: `<language>en</language>
<copyright>Copyright © Ray Gesualdo ${new Date().getFullYear()}</copyright>`,
  })
}
