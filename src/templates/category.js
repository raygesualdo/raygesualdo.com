import React from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/PageTitle/PageTitle'
import PageLayout from '../components/PageLayout/PageLayout'
import ArticleBlock from '../components/ArticleBlock/ArticleBlock'

const CategoryTemplate = props => {
  const posts = get(props, 'data.posts.edges', []).filter(
    ({ node }) =>
      get(node, 'frontmatter.category.slug') === props.data.category.slug
  )
  return (
    <Layout>
      <Helmet title={`Category: ${props.data.category.name}`} />
      <PageTitle title={`Category: ${props.data.category.name}`} />
      <PageLayout>
        {posts.map(({ node: post }) => (
          <ArticleBlock
            key={post.fields.slug}
            post={post}
            showCategory={false}
          />
        ))}
      </PageLayout>
    </Layout>
  )
}

export default CategoryTemplate

export const pageQuery = graphql`
  query($slug: String!) {
    category: categoriesYaml(fields: { slug: { eq: $slug } }) {
      slug
      name
    }
    posts: allMarkdownRemark(
      filter: { fields: { contentGroup: { eq: "posts" } } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD")
            category {
              slug
              name
            }
          }
          fields {
            slug
          }
          excerpt
          timeToRead
          wordCount {
            paragraphs
            sentences
            words
          }
        }
      }
    }
  }
`
