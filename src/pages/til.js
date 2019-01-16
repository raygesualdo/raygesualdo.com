import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/Layout/Layout'
import PageLayout from '../components/PageLayout/PageLayout'
import Til from '../components/Til/Til'

const TilPage = props => (
  <Layout>
    <Helmet>
      <title>Today I Learned</title>
    </Helmet>
    <PageLayout>
      {props.data.til.edges.map(({ node }) => (
        <Til key={node.fields.rawDate} {...node} />
      ))}
    </PageLayout>
  </Layout>
)

export default TilPage

export const pageQuery = graphql`
  {
    til: allMarkdownRemark(
      filter: { fields: { contentGroup: { eq: "til" } } }
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
