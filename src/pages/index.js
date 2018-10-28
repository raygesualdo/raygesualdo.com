import React from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../components/Layout/Layout'
import PageLayout from '../components/PageLayout/PageLayout'
import ArticleBlock from '../components/ArticleBlock/ArticleBlock'

const BlogIndex = props => {
  const siteTitle = get(props, 'data.site.siteMetadata.title')
  const posts = get(props, 'data.allMarkdownRemark.edges')
  return (
    <Layout>
      <Helmet title={siteTitle} />
      <PageLayout>
        {posts.map(({ node: post }) => (
          <ArticleBlock key={post.fields.slug} post={post} />
        ))}
      </PageLayout>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  {
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
