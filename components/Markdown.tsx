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
  h1: ({ node, level, ...props }) => (
    <h1 {...props} className="relative group" />
  ),
  h2: ({ node, level, ...props }) => (
    <h2 {...props} className="relative group" />
  ),
  h3: ({ node, level, ...props }) => (
    <h3 {...props} className="relative group" />
  ),
  h4: ({ node, level, ...props }) => (
    <h4 {...props} className="relative group" />
  ),
  h5: ({ node, level, ...props }) => (
    <h5 {...props} className="relative group" />
  ),
  h6: ({ node, level, ...props }) => (
    <h6 {...props} className="relative group" />
  ),
  img: ({ node, title, src, alt, ...props }) => {
    const imageSrc = src as keyof typeof exportMap
    const staticImport = exportMap[imageSrc]
    return (
      <figure>
        <div
          {...props}
          className="max-w-full mx-auto shadow-xl dark:border dark:border-white/20 rounded overflow-hidden"
        >
          <Image
            src={staticImport}
            alt={alt}
            placeholder="blur"
            layout="responsive"
          />
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
    // @ts-expect-error 🤷‍♂️
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
    <div className="prose prose-lg prose-sky dark:prose-invert prose-pre:rounded-none prose-pre:md:rounded-md prose-pre:-mx-4 prose-pre:px-4 prose-pre:py-2 prose-pre:md:mx-0 prose-pre:md:p-0">
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
