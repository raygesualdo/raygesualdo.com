import ReactMarkdown from 'react-markdown'
import { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown'
import { REHYPE_PLUGINS, REMARK_PLUGINS } from '../lib/remark'

const components: ReactMarkdownOptions['components'] = {
  blockquote: ({ node, ...props }) => {
    return (
      <blockquote
        {...props}
        className="bg-blueGray-100 border-l-4 border-blueGray-800 p-6 italic"
      />
    )
  },
  code: ({ node, inline, ...props }) => {
    if (inline) {
      return (
        <code {...props} className="bg-gray-100 rounded-sm px-1.5 py-0.5" />
      )
    }
    return <code {...props} />
  },
  img: ({ node, title, ...props }) => {
    return (
      <figure>
        <img {...props} className="mx-auto" />
        {title && (
          <figcaption className="text-center font-display italic">
            {title}
          </figcaption>
        )}
      </figure>
    )
  },
}

interface MarkdownProps {
  markdown: string
}

export const Markdown = ({ markdown }: MarkdownProps) => {
  return (
    <div className="prose prose-lg prose-blue">
      <ReactMarkdown
        remarkPlugins={REMARK_PLUGINS}
        rehypePlugins={REHYPE_PLUGINS}
        components={components}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
