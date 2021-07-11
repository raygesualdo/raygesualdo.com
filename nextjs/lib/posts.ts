import * as fs from 'fs'
import * as path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import yaml from 'js-yaml'

const betterMatter = (input: string) => {
  return matter(input, {
    engines: {
      yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object,
    },
  })
}

const POSTS_CONTENT_DIRECTORY = path.join(process.cwd(), 'content/posts')

export type PostData = PostFrontmatter & { slug: string; contentHtml: string }

export type PostFrontmatter = {
  title: string
  date: string
  category?: string
}

export async function getPostData(slug: string): Promise<PostData> {
  const current =
    fs
      .readdirSync(POSTS_CONTENT_DIRECTORY)
      .find((directory) => directory.includes(slug)) ?? ''
  const fileContents = fs.readFileSync(
    path.join(POSTS_CONTENT_DIRECTORY, current, 'index.md'),
    'utf-8'
  )
  const matterResult = betterMatter(fileContents)
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  return {
    slug,
    contentHtml,
    ...(matterResult.data as PostFrontmatter),
  }
}

export function getPathIds() {
  return fs.readdirSync(POSTS_CONTENT_DIRECTORY).map((directory) => {
    const fileContents = fs.readFileSync(
      path.join(POSTS_CONTENT_DIRECTORY, directory, 'index.md'),
      'utf-8'
    )
    const matterResult = betterMatter(fileContents)

    // Directories are prepended with `###-` where `#` is an integer
    const slug = directory.slice(4)
    const match = (matterResult.data.date as string).match(
      /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/
    )

    const params = {
      year: match?.groups?.year ?? '',
      month: match?.groups?.month ?? '',
      day: match?.groups?.day ?? '',
      slug,
    }
    return {
      params,
    }
  })
}
