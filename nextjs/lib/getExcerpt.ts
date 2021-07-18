// Adapted from https://brunoscheufler.com/blog/2021-04-18-processing-markdown-with-remark-and-unified-plugins
import unified from 'unified'
import remark from 'remark'
import stripMarkdown from 'strip-markdown'
import { Node, Parent } from 'unist'
import { COMMON_PLUGINS } from './remark'

/**
 * Cleanup node to remove all matching tags down the tree
 */
function removeTags(node: Node | Parent, tags: string[]) {
  if (!('children' in node) || !Array.isArray(node.children)) {
    return node
  }

  const result: Node[] = []
  for (const child of node.children) {
    if (tags.includes(child.type)) {
      continue
    }
    const processed = removeTags(child, tags)
    result.push(processed)
  }

  node.children = result
  return node
}

const stripTags: unified.Plugin<[{ tags: string[] }]> = ({ tags }) => {
  return (node) => {
    if (node.type === 'root') {
      removeTags(node, tags)
    }
    return node
  }
}

export async function getExcerpt(content: string, trimLength = 140) {
  const { contents: excerpt } = await remark()
    .use(COMMON_PLUGINS)
    .use(stripTags, { tags: ['image', 'imageReference'] })
    .use(stripMarkdown)
    .process(content)

  const trimmedExcerpt = excerpt.toString().trim().substr(0, trimLength)

  return `${trimmedExcerpt}...`
}
