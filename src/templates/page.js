import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/Layout/Layout'
import PageTitle from '../components/PageTitle/PageTitle'

const PageTemplate = props => {
  const {
    page,
    settings,
    site: {
      meta: { siteTitle, siteUrl },
    },
  } = props.data
  return (
    <Layout>
      <Helmet>
        <title>{`${page.frontmatter.title} | ${siteTitle}`}</title>
        <meta property="og:type" content="website" />
        <meta property="og:title" content={page.frontmatter.title} />
        <meta
          property="og:url"
          content={`${siteUrl}/pages/${page.frontmatter.slug}`}
        />
        <meta property="og:description" content={page.excerpt} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={page.frontmatter.title} />
        <meta name="twitter:creator" content={`@${settings.social.twitter}`} />
        <meta name="twitter:description" content={page.excerpt} />
        <meta name="description" content={page.excerpt} />
      </Helmet>
      <PageTitle title={page.frontmatter.title} />
      <div dangerouslySetInnerHTML={{ __html: page.html }} />
    </Layout>
  )
}

export default PageTemplate

export const pageQuery = graphql`
  query($slug: String!) {
    site {
      meta: siteMetadata {
        siteTitle: title
        siteUrl
      }
    }
    settings: siteSettings {
      social {
        twitter
      }
    }
    page: markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        title
      }
      excerpt
    }
  }
`
