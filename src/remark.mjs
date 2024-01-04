import getReadingTime from 'reading-time'
import stripMarkdown from 'strip-markdown'
import { toString } from 'mdast-util-to-string'

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree)
    const readingTime = getReadingTime(textOnPage)
    data.astro.frontmatter.readingTime = readingTime.minutes
  }
}

export function remarkExcerpt() {
  return function (tree, { data }) {
    let value = structuredClone(tree)
    value = stripMarkdown({ keep: ['blockquote'], remove: ['image', 'imageReference'] })(value)
    value = toString(value).trim()
    const trimmedExcerpt =
      value.at(159) === ' '
        ? value.substring(0, 159).trim()
        : value.substring(0, 159).trim().split(' ').slice(0, -1).join(' ')
    data.astro.frontmatter.excerpt = `${trimmedExcerpt}…`
  }
}
