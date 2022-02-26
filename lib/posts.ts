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
  isDraft?: boolean
}

export type PostFrontmatter = {
  title: string
  date?: string
  category?: string
}

const postDataCache = new Map<string, PostData>()

export async function getPostData(slug: string): Promise<PostData> {
  if (process.env.NODE_ENV === 'production' && postDataCache.has(slug)) {
    return postDataCache.get(slug)!
  }

  const fileContents = fs.readFileSync(
    path.join(POSTS_CONTENT_DIRECTORY, `${slug}.md`),
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

function getAllPaths() {
  return fs.readdirSync(POSTS_CONTENT_DIRECTORY).map((file) => {
    const slug = file.replace('.md', '')
    return slug
  })
}

export async function getPathIds({ includeDrafts = false } = {}) {
  const posts = await getAllPosts({ includeDrafts })
  return posts.map(({ slug }) => {
    return {
      params: {
        slug,
      },
    }
  })
}

const includeDraftsFilter = () => true
const isPublishedPost = (post: PostData) => {
  const today = new Date().toISOString().slice(0, 10)
  return !!post.date && post.date <= today
}

/** Get all posts, sorted by newest to oldest publish date */
export async function getAllPosts({ includeDrafts = false } = {}) {
  const paths = getAllPaths()
  const allPosts = await Promise.all(paths.map((slug) => getPostData(slug)))
  return allPosts
    .filter(includeDrafts ? () => true : isPublishedPost)
    .map((post) => {
      post.isDraft = !isPublishedPost(post)
      return post
    })
    .sort(sortByPublishDate)
}

function sortByPublishDate(a: PostData, b: PostData) {
  if (!a.date) return -1
  if (!b.date) return 1
  if (a.date < b.date) return 1
  if (a.date > b.date) return -1
  return 0
}
