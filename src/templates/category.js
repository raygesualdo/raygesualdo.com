import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/PageTitle/PageTitle'
import PageLayout from '../components/PageLayout/PageLayout'
import ArticleBlock from '../components/ArticleBlock/ArticleBlock'

const CategoryTemplate = props => {
  return (
    <Layout>
      <Helmet title={`Category: ${props.data.category.name}`} />
      <PageTitle title={`Category: ${props.data.category.name}`} />
      <PageLayout>
        {props.data.posts.nodes.map(post => (
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
    category: categoriesYaml(slug: { eq: $slug }) {
      slug
      name
    }
    posts: allMarkdownRemark(
      filter: { frontmatter: { category: { eq: $slug } } }
      sort: { fields: frontmatter___date, order: DESC }
    ) {
      nodes {
        frontmatter {
          title
          date(formatString: "YYYY-MM-DD")
          category: categoryData {
            name
            slug
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
`
