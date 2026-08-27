import { defineHastPlugin, defineMdastPlugin, type HastNode } from 'satteri'
import stripMarkdown from 'strip-markdown'
import { toString } from 'mdast-util-to-string'
import getReadingTime from 'reading-time'

declare module 'satteri' {
  interface DataMap {
    astro: {
      frontmatter: Record<string, unknown>
    }
  }
}

export const mdastReadingTime = defineMdastPlugin({
  name: 'reading-time',
  before(root, ctx) {
    if (!ctx.data.astro) return
    const contents = toString(root)
    const readingTime = getReadingTime(contents)
    ctx.data.astro.frontmatter.readingTime = readingTime.minutes
  },
})

export const mdastExcerpt = defineMdastPlugin({
  name: 'excerpt',
  before(root, ctx) {
    if (!ctx.data.astro) return
    const clonedRoot = structuredClone(root)
    const cleanedRoot = stripMarkdown({
      keep: ['blockquote'],
      remove: ['image', 'imageReference'],
    })(clonedRoot)
    const contents = toString(cleanedRoot).trim()
    const trimmedExcerpt =
      contents.at(159) === ' '
        ? contents.substring(0, 159).trim()
        : contents.substring(0, 159).trim().split(' ').slice(0, -1).join(' ')
    ctx.data.astro.frontmatter.excerpt = `${trimmedExcerpt}…`
  },
})

export const mdastAttrs = defineMdastPlugin({
  name: 'attrs',
  textDirective(node, ctx) {
    if (node.name !== 'inlineStyles') return
    if (!node.attributes?.style) {
      return ctx.report({
        message: 'No "style" attribute provided for the "inlineStyles" directive.',
        node,
        severity: 'error',
      })
    }

    const parent = ctx.parent(node)
    const firstChild = parent.children?.at(0)
    if (!firstChild || firstChild === node) return

    const newData = deepMerge(firstChild.data, { hProperties: { style: node.attributes.style } })
    // @ts-expect-error
    ctx.setProperty(firstChild, 'data', newData)
  },
})

export const hastTitleFigure = defineHastPlugin({
  name: 'title-figure',
  element: {
    filter: ['img'],
    visit(node, ctx) {
      ctx.setProperty(node, 'title', null)

      const figure: HastNode = { type: 'element', tagName: 'figure', properties: {}, children: [] }
      if (node.properties.title) {
        const figcaption: HastNode = {
          type: 'element',
          tagName: 'figcaption',
          properties: {},
          children: [{ type: 'text', value: String(node.properties.title) }],
        }
        figure.children.push(figcaption)
      }

      ctx.wrapNode(node, figure)
    },
  },
})

export const hastAutolinkHeadings = defineHastPlugin({
  name: 'autolink-headings',
  element: {
    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    visit(node, ctx) {
      ctx.setProperty(node, 'class', 'relative group')

      const link: HastNode = {
        type: 'element',
        tagName: 'a',
        properties: {
          href: `#${node.properties.id}`,
          ariaHidden: 'true',
          ariaLabel: 'Header anchor',
          class:
            'invisible group-hover:visible absolute right-full p-1 -mt-1 text-current no-underline',
        },
        children: [{ type: 'text', value: '#' }],
      }

      ctx.prependChild(node, link)
    },
  },
})

function isObject(item: unknown): item is Record<string, unknown> {
  return !!item && typeof item === 'object' && !Array.isArray(item)
}

function deepMerge<T, S>(target: T, ...sources: S[]): T {
  const output = { ...target }
  if (!sources.length) return output
  const source = sources.shift()

  if (isObject(output) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!output[key]) Object.assign(output, { [key]: {} })
        deepMerge(output[key], source[key])
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    }
  }

  return deepMerge(output, ...sources)
}
