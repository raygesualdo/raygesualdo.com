import * as fs from 'fs'
import * as path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

const POSTS_CONTENT_DIRECTORY = path.join(process.cwd(), 'content/posts')

export type PostData = PostFrontmatter & { id: string; contentHtml: string }

export type PostFrontmatter = {
  title: string
}

export async function getPostData(id: string): Promise<PostData> {
  const fileContents = fs.readFileSync(
    path.join(POSTS_CONTENT_DIRECTORY, `${id}.md`),
    'utf-8'
  )
  const matterResult = matter(fileContents)
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  return {
    id,
    contentHtml,
    ...(matterResult.data as PostFrontmatter),
  }
}

export function getPathIds() {
  const files = fs.readdirSync(POSTS_CONTENT_DIRECTORY)

  return files.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    }
  })
}
