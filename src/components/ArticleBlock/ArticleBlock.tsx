import React, { Fragment } from 'react'
import { Link } from 'gatsby'
import { Article, Title, TitleLink, Metadata } from './ArticleBlock.styles'

type Post = {
  excerpt: string
  fields: {
    slug: string
  }
  frontmatter: {
    category: {
      name: string
      slug: string
    }
    date: string
    title: string
  }
  timeToRead: string
}

interface ArticleBlockProps {
  post: Post
  showCategory: boolean
}

const ArticleBlock = ({ post, showCategory }: ArticleBlockProps) => (
  <Article>
    <Title>
      <TitleLink to={post.fields.slug}>{post.frontmatter.title}</TitleLink>
    </Title>
    <Metadata>
      {post.frontmatter.date} | {post.timeToRead} Minute Read
      {post.frontmatter.category && showCategory && (
        <Fragment>
          {' '}
          | Category:{' '}
          <Link to={`/category/${post.frontmatter.category.slug}`}>
            {post.frontmatter.category.name}
          </Link>
        </Fragment>
      )}
    </Metadata>
    <p dangerouslySetInnerHTML={{ __html: post.excerpt }} />
  </Article>
)

ArticleBlock.defaultProps = {
  showCategory: true,
}

export default ArticleBlock
