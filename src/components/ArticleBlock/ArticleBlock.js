import React from 'react'
import { Article, Title, TitleLink, Date } from './styles'

const ArticleBlock = ({ post }) => (
  <Article>
    <Title>
      <TitleLink to={post.fields.slug}>
        {post.frontmatter.title}
      </TitleLink>
    </Title>
    <Date>{post.frontmatter.date} | {post.timeToRead} Minute Read</Date>
    <p dangerouslySetInnerHTML={{ __html: post.excerpt }} />
  </Article>
)

export default ArticleBlock
