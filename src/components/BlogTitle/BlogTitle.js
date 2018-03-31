import React from 'react'
import { Layout, Title, Date } from './styles'

const BlogTitle = props => (
  <Layout>
    <Title>{props.title}</Title>
    <Date>{props.date} | {props.timeToRead} Minute Read</Date>
  </Layout>
)

export default BlogTitle
