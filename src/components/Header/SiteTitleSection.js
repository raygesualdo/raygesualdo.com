import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { SiteTitle, SiteTitleLink } from './styles'

const query = graphql`
  {
    site {
      meta: siteMetadata {
        title
      }
    }
  }
`
export const SiteTitleSection = () => {
  const {
    site: {
      meta: { title },
    },
  } = useStaticQuery(query)
  return (
    <SiteTitle>
      <SiteTitleLink to="/" title={title} rel="home">
        {title}
      </SiteTitleLink>
    </SiteTitle>
  )
}
