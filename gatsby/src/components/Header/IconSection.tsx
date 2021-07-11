import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import {
  IconLinks,
  IconLink,
  HeaderIconGitHub,
  HeaderIconTwitter,
} from './Header.styles'

const query = graphql`
  {
    settings: siteSettings {
      social {
        twitter
        github
      }
    }
  }
`

export const IconSection = () => {
  const {
    settings: { social },
  } = useStaticQuery(query)
  return (
    <IconLinks>
      {social.twitter && (
        <IconLink href={`https://twitter.com/${social.twitter}`}>
          <HeaderIconTwitter title="Twitter" />
        </IconLink>
      )}
      {social.github && (
        <IconLink href={`https://github.com/${social.github}`}>
          <HeaderIconGitHub title="GitHub" />
        </IconLink>
      )}
    </IconLinks>
  )
}
