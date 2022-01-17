import * as fs from 'fs'
import * as path from 'path'
import matter from 'gray-matter'
import yaml from 'js-yaml'
import readingTime from 'reading-time'
import { getExcerpt } from './getExcerpt'
import { Category, getCategoryBySlug } from './categories'
import { config } from './config'

const POSTS_CONTENT_DIRECTORY = path.join(process.cwd(), 'content/posts')

const betterMatter = (input: string) => {
  return matter(input, {
    engines: {
      yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object,
    },
  })
}

export type PostData = Omit<PostFrontmatter, 'category'> & {
  slug: string
  permalink: string
  markdown: string
  excerpt: string
  readingTime: ReturnType<typeof readingTime>
  category: Category | null
}

export type PostFrontmatter = {
  title: string
  date: string
  category?: string
}

const postDataCache = new Map<string, PostData>()

export async function getPostData(slug: string): Promise<PostData> {
  if (process.env.NODE_ENV === 'production' && postDataCache.has(slug)) {
    return postDataCache.get(slug)!
  }

  const current =
    fs
      .readdirSync(POSTS_CONTENT_DIRECTORY)
      .find((file) => file.includes(slug)) ?? ''
  const fileContents = fs.readFileSync(
    path.join(POSTS_CONTENT_DIRECTORY, current),
    'utf-8'
  )
  const matterResult = betterMatter(fileContents)

  const data = {
    slug,
    markdown: matterResult.content,
    ...(matterResult.data as PostFrontmatter),
    excerpt: await getExcerpt(matterResult.content),
    readingTime: readingTime(matterResult.content),
    category: getCategoryBySlug(matterResult.data.category) || null,
    permalink: `${config.siteUrl}/${slug}`,
  }

  if (process.env.NODE_ENV === 'production') {
    postDataCache.set(slug, data)!
  }

  return data
}

export function getPathIds() {
  return fs.readdirSync(POSTS_CONTENT_DIRECTORY).map((file) => {
    // Files are prepended with `###-` where `#` is an integer
    // Also remove `.md` from the end
    const slug = file.slice(4).replace('.md', '')

    return {
      params: {
        slug,
      },
    }
  })
}

export async function getAllPosts() {
  const paths = getPathIds()
  const allPosts = await Promise.all(
    paths.map(({ params: { slug } }) => getPostData(slug))
  )
  return allPosts
}
