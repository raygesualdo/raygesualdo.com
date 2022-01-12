import ReactMarkdown from 'react-markdown'
import { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown'
import Image from 'next/image'
import { REHYPE_PLUGINS, REMARK_PLUGINS } from '../lib/remark'
import { exportMap } from '../lib/staticImages'

const components: ReactMarkdownOptions['components'] = {
  blockquote: ({ node, ...props }) => {
    return (
      <blockquote
        {...props}
        className="bg-slate-100 border-l-4 border-slate-800 p-6 italic dark:bg-slate-800 dark:border-slate-400"
      />
    )
  },
  code: ({ node, inline, ...props }) => {
    if (inline) {
      return (
        <code
          {...props}
          className="bg-gray-100 rounded-sm px-1.5 py-0.5 dark:bg-gray-700"
        />
      )
    }
    return <code {...props} />
  },
  img: ({ node, title, src, ...props }) => {
    const imageSrc = src as keyof typeof exportMap
    const staticImport = exportMap[imageSrc]
    return (
      <figure>
        <div className="w-max max-w-full mx-auto">
          <Image src={staticImport} alt={props.alt} placeholder="blur" />
        </div>
        {title && (
          <figcaption className="text-center font-display italic">
            {title}
          </figcaption>
        )}
      </figure>
    )
  },
  p: ({ node, ...props }) => {
    if (node.children?.[0]?.tagName === 'img') {
      return <>{props.children}</>
    }

    return <p {...props} />
  },
}

interface MarkdownProps {
  markdown: string
}

export const Markdown = ({ markdown }: MarkdownProps) => {
  return (
    <div className="prose prose-lg prose-sky dark:prose-invert">
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
