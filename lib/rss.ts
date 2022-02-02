import * as fs from 'fs'
import * as path from 'path'
import { Feed } from 'feed'
import { config } from './config'
import { PostData } from './posts'
import { toHtml } from './remark'

export async function generateRssFeed(posts: PostData[]) {
  const baseUrl = config.siteUrl
  const author = {
    name: 'Ray Gesualdo',
    link: 'https://twitter.com/RayGesualdo',
  }

  const feed = new Feed({
    title: 'RayGesualdo.com',
    description: 'The personal site of Ray Gesualdo.',
    copyright: `Copyright © Ray Gesualdo ${new Date().getFullYear()}`,
    id: baseUrl,
    link: baseUrl,
    language: 'en',
    favicon: `${baseUrl}/favicon.ico`,
    generator: 'Next.js via Feed',
    author,
  })

  await Promise.all(
    posts.map(async (post) => {
      const contentHtml = await toHtml(post.markdown)
      feed.addItem({
        title: post.title,
        id: post.permalink,
        // @ts-expect-error Date can actually take `null`
        date: new Date(post.date ?? null),
        link: post.permalink,
        author: [author],
        content: contentHtml,
        description: post.excerpt,
      })
    })
  )

  fs.writeFileSync(path.resolve(process.cwd(), 'public/rss.xml'), feed.rss2())
}
