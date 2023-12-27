import getReadingTime from 'reading-time'
import stripMarkdown from 'strip-markdown'
import { toString } from 'mdast-util-to-string'

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree)
    const readingTime = getReadingTime(textOnPage)
    // readingTime.text will give us minutes read as a friendly string,
    // i.e. "3 min read"
    data.astro.frontmatter.readingTime = readingTime.minutes
  }
}

// // Adapted from https://brunoscheufler.com/blog/2021-04-18-processing-markdown-with-remark-and-unified-plugins
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
