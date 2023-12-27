import type { APIContext } from 'astro'
import rss, { type RSSFeedItem } from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { filterPostCollection } from '../utils'

export async function GET(context: APIContext) {
  const posts = await getCollection('posts', filterPostCollection)
  return rss({
    title: 'RayGesualdo.com',
    description: 'The personal site of Ray Gesualdo.',
    site: String(context.site),
    items: await Promise.all(
      posts.map(async (post) => {
        const { remarkPluginFrontmatter } = await post.render()
        return {
          title: post.data.title,
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
