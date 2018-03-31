import React, { Fragment } from 'react'
import Link from 'gatsby-link'
import get from 'lodash/get'
import Helmet from 'react-helmet'

import ArticleBlock from '../components/ArticleBlock/ArticleBlock'

class BlogIndex extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const posts = get(this, 'props.data.allMarkdownRemark.edges')
    return (
      <Fragment>
        <Helmet title={siteTitle} />
        {posts.map(({ node: post }) => (
          <ArticleBlock key={post.fields.slug} post={post} />
        ))}
      </Fragment>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fileAbsolutePath: { glob: "**/posts/**" } }
    ) {
      edges {
        node {
          excerpt
          frontmatter {
            date(formatString: "MMMM D, YYYY")
            title
          }
          fields {
            slug
          }
          timeToRead
        }
      }
    }
  }
`
