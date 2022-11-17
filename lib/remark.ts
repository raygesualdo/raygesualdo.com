import { PluggableList, unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeAttrs from 'rehype-attr'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeStringify from 'rehype-stringify'
import highlightElixir from 'highlight.js/lib/languages/elixir'

const headerLinkContent = {
  type: 'text',
  value: '#',
}

export const REMARK_PLUGINS: PluggableList = [remarkParse, remarkGfm]

export const REHYPE_PLUGINS: PluggableList = [
  rehypeRaw,
  [rehypeAttrs, { properties: 'attr' }],
  [rehypeHighlight, { languages: { elixir: highlightElixir } }],
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      content: headerLinkContent,
      properties: {
        ariaHidden: true,
        class:
          'invisible group-hover:visible absolute right-full p-1 -mt-1 text-current no-underline',
      },
    },
  ],
]

export const toHtml = async (markdown: string) => {
  try {
    const result = await unified()
      .use(REMARK_PLUGINS)
      .use(remarkRehype)
      .use(REHYPE_PLUGINS)
      .use(rehypeStringify)
      .process(markdown)
    return result.toString()
  } catch (error) {
    console.error(error)
    return ''
  }
}
