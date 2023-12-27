// // Adapted from https://brunoscheufler.com/blog/2021-04-18-processing-markdown-with-remark-and-unified-plugins
import { toString } from 'mdast-util-to-string'
import stripMarkdown from 'strip-markdown'

function removeTags(node, tags) {
  if (!('children' in node) || !Array.isArray(node.children)) {
    return node
  }

  const result = []
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

export function remarkExcerpt() {
  return function (tree, { data }) {
    let value = structuredClone(tree)
    value = removeTags(value, ['image', 'imageReference'])
    value = stripMarkdown()(value)
    value = toString(value)
    const trimmedExcerpt = value.trim().substring(0, 137).trim()
    data.astro.frontmatter.excerpt = `${trimmedExcerpt}...`
  }
}
