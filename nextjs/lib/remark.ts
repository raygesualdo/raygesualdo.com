import React from 'react'
import { PluggableList } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeReact from 'rehype-react'
import highlightElixir from 'highlight.js/lib/languages/elixir'

export const REMARK_PLUGINS: PluggableList = [remarkParse, remarkGfm]

export const REHYPE_PLUGINS: PluggableList = [
  [rehypeHighlight, { languages: { elixir: highlightElixir } }],
  // @ts-expect-error 🤷‍♂️
  [rehypeReact, { createElement: React.createElement }],
]
