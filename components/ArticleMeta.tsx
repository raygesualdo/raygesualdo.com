import React, { Fragment } from 'react'
import Link from 'next/link'
import { formatDate } from '../lib/date'
import { PostData } from '../lib/posts'
import { A } from './Link'

interface ArticleMetaProps {
  post: PostData
  showCategory?: boolean
  className?: string
}

export function ArticleMeta({
  post,
  showCategory = true,
  className = '',
}: ArticleMetaProps) {
  const { category, date, readingTime } = post
  return (
    <div className={`text-md font-display ${className}`}>
      {formatDate(date)} | {Math.round(readingTime?.minutes ?? 0)} Minute Read
      {category && showCategory && (
        <Fragment>
          {' '}
          | Category:{' '}
          <Link href={`/category/${category!.slug}`} passHref>
            <A>{category!.name}</A>
          </Link>
        </Fragment>
      )}
    </div>
  )
}
