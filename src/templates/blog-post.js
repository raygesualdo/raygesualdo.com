import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/Layout/Layout'
import BlogTitle from '../components/BlogTitle/BlogTitle'
import BlogContent from '../components/BlogContent/BlogContent'
import './prism-xonokai.css'

const BlogPostTemplate = props => {
  const {
    post,
    settings,
    site: {
      meta: { siteUrl },
    },
  } = props.data
  return (
    <Layout>
      <Helmet>
        <title>{post.frontmatter.title}</title>
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.frontmatter.title} />
        <meta
          property="og:url"
          content={`${siteUrl}/posts/${post.frontmatter.slug}`}
        />
        <meta property="og:description" content={post.excerpt} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={post.frontmatter.title} />
        <meta name="twitter:creator" content={`@${settings.social.twitter}`} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="description" content={post.excerpt} />
      </Helmet>
      <BlogTitle
        title={post.frontmatter.title}
        date={post.frontmatter.date}
        timeToRead={post.timeToRead}
        category={post.frontmatter.category}
      />
      <BlogContent dangerouslySetInnerHTML={{ __html: post.html }} />
    </Layout>
  )
}

export default BlogPostTemplate

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
    post: markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        title
        date(formatString: "MMMM D, YYYY")
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
    }
  }
`
