import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/PageTitle/PageTitle'
import PageLayout from '../components/PageLayout/PageLayout'
import ArticleBlock from '../components/ArticleBlock/ArticleBlock'

interface CategoryTemplateProps {
  data: {
    category: {
      slug: string
      name: string
      posts: {
        nodes: {
          frontmatter: {
            title: string
            date: string
            category: {
              name: string
              slug: string
            }
          }
          fields: {
            slug: string
          }
          excerpt: string
          timeToRead: string
          wordCount: {
            paragraphs: number
            sentences: number
            words: number
          }
        }[]
      }
    }
  }
}

const CategoryTemplate = ({ data: { category } }: CategoryTemplateProps) => {
  return (
    <Layout>
      <Helmet title={`Category: ${category.name}`} />
      <PageTitle title={category.name} subtitle="Category" />
      <PageLayout>
        {category.posts.nodes.map((post) => (
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
      posts(sort: { fields: frontmatter___date, order: DESC }) {
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
  }
`
