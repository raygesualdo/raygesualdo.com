import React, { Fragment } from 'react'
import Helmet from 'react-helmet'
import Talk from '../components/Talk/Talk'
import PageLayout from '../components/PageLayout/PageLayout'

const Talks = props => (
  <Fragment>
    <Helmet>
      <title>Talks</title>
    </Helmet>
    <PageLayout>
      {props.data.talks.edges.map(({ node: talk }) => (
        <Talk key={talk.title} {...talk} />
      ))}
    </PageLayout>
  </Fragment>
)

export default Talks

export const pageQuery = graphql`
  query TalksQuery {
    talks: allTalksYaml {
      edges {
        node {
          id
          title
          slides
          abstract
          video
          code
        }
      }
    }
  }
`
