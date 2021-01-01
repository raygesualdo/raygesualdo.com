import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/PageTitle/PageTitle'
import PageLayout from '../components/PageLayout/PageLayout'
import BlogContent from '../components/BlogContent/BlogContent'

interface TilTemplateProps {
  data: {
    til: {
      html: string
      fields: {
        date: string
        rawDate: string
        slug: string
      }
    }
  }
}

const TilTemplate = (props: TilTemplateProps) => (
  <Layout>
    <Helmet>
      <title>{`Today I Learned: ${props.data.til.fields.date}`}</title>
    </Helmet>
    <PageTitle title={props.data.til.fields.date} />
    <PageLayout>
      <BlogContent>
        <div dangerouslySetInnerHTML={{ __html: props.data.til.html }} />
      </BlogContent>
    </PageLayout>
  </Layout>
)

export default TilTemplate

export const pageQuery = graphql`
  query($slug: String!) {
    til: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      fields {
        date(formatString: "MMMM DD, YYYY")
        rawDate: date
        slug
      }
    }
  }
`
