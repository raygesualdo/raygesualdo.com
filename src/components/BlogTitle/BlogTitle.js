import React, { Fragment } from 'react'
import { Link } from 'gatsby'
import { Layout, Title, Date } from './BlogTitle.styles'

const BlogTitle = (props) => (
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
