import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/Layout/Layout'
import PageLayout from '../components/PageLayout/PageLayout'
import BlogContent from '../components/BlogContent/BlogContent'
import Til from '../components/Til/Til'

const TilPage = props => (
  <Layout>
    <Helmet>
      <title>Today I Learned</title>
    </Helmet>
    <PageLayout>
      <BlogContent>
        {props.data.til.edges.map(({ node }) => (
          <Til key={node.fields.rawDate} {...node} />
        ))}
      </BlogContent>
    </PageLayout>
  </Layout>
)

export default TilPage

export const pageQuery = graphql`
  {
    til: allMarkdownRemark(
      filter: { fields: { contentGroup: { eq: "til" } } }
      sort: { order: DESC, fields: [fields___date] }
    ) {
      edges {
        node {
          html
          fields {
            date(formatString: "MMMM DD, YYYY")
            rawDate: date
          }
        }
      }
    }
  }
`
