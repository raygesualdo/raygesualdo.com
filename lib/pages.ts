import * as fs from 'fs'
import * as path from 'path'
import matter from 'gray-matter'

export type PageData = {
  title: string
  markdown: string
}

export async function getPageData(filename: string): Promise<PageData> {
  const MARKDOWN_PATH = path.join(process.cwd(), 'content/pages', filename)
  const fileContents = fs.readFileSync(MARKDOWN_PATH, 'utf-8')
  const matterResult = matter(fileContents)

  return {
    title: matterResult.data.title,
    markdown: matterResult.content,
  }
}
