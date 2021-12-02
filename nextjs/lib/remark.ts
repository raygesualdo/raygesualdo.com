import unified from 'unified'
import parseMarkdown from 'remark-parse'
import githubFlavoredMarkdown from 'remark-gfm'
import htmlRemark from 'remark-html'
import { selectAll } from 'unist-util-select'

// Helper to get Tailwind autocomplete in VS Code
const tw = <T>(x: T) => x

const classMap = {
  blockquote: tw('bg-blueGray-50 border-l-4 border-blueGray-800 p-6 italic'),
  inlineCode: tw('bg-gray-100 rounded-sm px-1.5 py-0.5'),
  'blockquote inlineCode': tw('bg-gray-200'),
}

// Adapted from https://github.com/chrisg86/gatsby-remark-classes/blob/3f3fd8ce13d1f6a56b972e233bfbe216f9418af6/index.js
export const remarkAddClasses: unified.Plugin = () => (root) => {
  Object.keys(classMap).forEach((selector) => {
    const nodes = selectAll(selector, root)
    nodes.forEach((node) => {
      node.data = node.data || {}
      node.data.hProperties = node.data.hProperties || {}
      // @ts-expect-error
      node.data.hProperties.className = node.data.hProperties.className || []
      // @ts-expect-error
      node.data.hProperties.className.push(classMap[selector])
    })
  })

  return root
}

export const COMMON_PLUGINS = [parseMarkdown, githubFlavoredMarkdown]

export const ALL_PLUGINS = [...COMMON_PLUGINS, remarkAddClasses, htmlRemark]
