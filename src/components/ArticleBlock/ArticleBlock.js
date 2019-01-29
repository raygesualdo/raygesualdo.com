import React, { Fragment } from 'react'
import { Link } from 'gatsby'
import { Article, Title, TitleLink, Date } from './styles'

const ArticleBlock = ({ post }) => (
  <Article>
    <Title>
      <TitleLink to={post.fields.slug}>{post.frontmatter.title}</TitleLink>
    </Title>
    <Date>
      {post.frontmatter.date} | {post.timeToRead} Minute Read
      {post.frontmatter.category && (
        <Fragment>
          {' '}
          | Category:{' '}
          <Link to={`category/${post.frontmatter.category.slug}`}>
            {post.frontmatter.category.name}
          </Link>
        </Fragment>
      )}
    </Date>
    <p dangerouslySetInnerHTML={{ __html: post.excerpt }} />
  </Article>
)

export default ArticleBlock
