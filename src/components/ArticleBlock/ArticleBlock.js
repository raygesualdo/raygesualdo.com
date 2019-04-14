import React, { Fragment } from 'react'
import { Link } from 'gatsby'
import { Article, Title, TitleLink, Date } from './styles'

const ArticleBlock = ({ post, showCategory }) => (
  <Article>
    <Title>
      <TitleLink to={post.fields.slug}>{post.frontmatter.title}</TitleLink>
    </Title>
    <Date>
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
    </Date>
    <p dangerouslySetInnerHTML={{ __html: post.excerpt }} />
  </Article>
)

ArticleBlock.defaultProps = {
  showCategory: true,
}

export default ArticleBlock
