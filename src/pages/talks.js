import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/Layout/Layout'
import Talk from '../components/Talk/Talk'
import PageLayout from '../components/PageLayout/PageLayout'
import PageTitle from '../components/PageTitle/PageTitle'

const Talks = (props) => (
  <Layout>
    <Helmet>
      <title>Talks</title>
    </Helmet>
    <PageLayout>
      <PageTitle title="Talks" />
      {props.data.talks.edges.map(({ node: talk }) => (
        <Talk key={talk.title} {...talk} />
      ))}
    </PageLayout>
  </Layout>
)

export default Talks

export const pageQuery = graphql`
  {
    talks: allTalksYaml {
      edges {
        node {
          abstract
          events {
            code
            slides
            title
            video
          }
          id
          title
        }
      }
    }
  }
`
