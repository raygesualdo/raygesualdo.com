import React, { Fragment } from 'react'
import { Link } from 'gatsby'
import { Layout, Title, Date } from './BlogTitle.styles'

interface BlogTitleProps {
  title: string
  date: string
  timeToRead: string
  category: {
    name: string
    slug: string
  }
}

const BlogTitle = (props: BlogTitleProps) => (
  <Layout>
    <Title>{props.title}</Title>
    <Date>
      {props.date} | {props.timeToRead} Minute Read
      {props.category && (
        <Fragment>
          {' '}
          | Category:{' '}
          <Link to={`/category/${props.category.slug}`}>
            {props.category.name}
          </Link>
        </Fragment>
      )}
    </Date>
  </Layout>
)

export default BlogTitle
