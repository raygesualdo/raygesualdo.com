import * as fs from 'fs'
import * as path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import { ALL_PLUGINS } from '../lib/remark'

export type PageData = {
  title: string
  content: string
}

export async function getPageData(filename: string): Promise<PageData> {
  const MARKDOWN_PATH = path.join(process.cwd(), 'content/pages', filename)
  const fileContents = fs.readFileSync(MARKDOWN_PATH, 'utf-8')
  const matterResult = matter(fileContents)
  const processedContent = await remark()
    .use(ALL_PLUGINS)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  return {
    title: matterResult.data.title,
    content: contentHtml,
  }
}
