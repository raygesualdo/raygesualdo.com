import React from 'react'
import Link from 'next/link'
import { PostData } from '../lib/posts'
import { ArticleMeta } from './ArticleMeta'

interface ArticleBlockProps {
  post: PostData
  showCategory?: boolean
}

export const ArticleBlock = ({
  post,
  showCategory = true,
}: ArticleBlockProps) => {
  const { slug } = post

  return (
    <article className="mb-12">
      <h1 className="text-3xl mb-1.5 text-sky-600 font-display">
        <Link href={`/posts/${slug}`}>
          <a>
            {post.isDraft ? '(Draft) ' : ''}
            {post.title}
          </a>
        </Link>
      </h1>
      <ArticleMeta post={post} showCategory={showCategory} className="mb-3" />
      <p dangerouslySetInnerHTML={{ __html: post.excerpt }} />
    </article>
  )
}
