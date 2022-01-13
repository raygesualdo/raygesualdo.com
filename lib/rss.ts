import * as fs from 'fs'
import * as path from 'path'
import { Feed } from 'feed'
import { config } from './config'
import { PostData } from './posts'

export function generateRssFeed(posts: PostData[]) {
  const baseUrl = config.siteUrl
  const author = {
    name: 'Ray Gesualdo',
    link: 'https://twitter.com/RayGesualdo',
  }

  const feed = new Feed({
    title: 'RayGesualdo.com',
    description: 'The personal site of Ray Gesualdo.',
    copyright: `Copyright  Ray Gesualdo ${new Date().getFullYear()}`,
    id: baseUrl,
    link: baseUrl,
    language: 'en',
    favicon: `${baseUrl}/favicon.ico`,
    generator: 'Next.js via Feed',
    author,
  })

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: post.permalink,
      date: new Date(post.date),
      link: post.permalink,
      author: [author],
      content: post.contentHtml,
      description: post.excerpt,
    })
  })

  fs.writeFileSync(path.resolve(process.cwd(), 'public/rss.xml'), feed.rss2())
}
