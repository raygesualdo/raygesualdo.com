import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import {
  HeaderBackground,
  HeaderLayout,
  IconLinks,
  SiteTitle,
  SiteTitleLink,
  Menu,
  MenuItem,
  MenuLink,
  IconLink,
  HeaderIconGitHub,
  HeaderIconTwitter,
} from './styles'

const query = graphql`
  {
    site {
      meta: siteMetadata {
        title
      }
    }
    settings: siteSettings {
      social {
        twitter
        github
      }
      menus {
        header {
          url
          title
          props {
            target
          }
        }
      }
    }
  }
`

const Header = () => (
  <StaticQuery
    query={query}
    render={data => (
      <HeaderBackground>
        <HeaderLayout>
          <SiteTitle>
            <SiteTitleLink to="/" title={data.site.meta.title} rel="home">
              {data.site.meta.title}
            </SiteTitleLink>
          </SiteTitle>
          <Menu role="navigation">
            {data.settings.menus.header.map(item => (
              <MenuItem key={item.url}>
                <MenuLink to={item.url} title={item.title} {...item.props}>
                  {item.title}
                </MenuLink>
              </MenuItem>
            ))}
          </Menu>
          <IconLinks>
            {data.settings.social.twitter && (
              <IconLink
                href={`https://twitter.com/${data.settings.social.twitter}`}
              >
                <HeaderIconTwitter title="Twitter" />
              </IconLink>
            )}
            {data.settings.social.github && (
              <IconLink
                href={`https://github.com/${data.settings.social.github}`}
              >
                <HeaderIconGitHub title="GitHub" />
              </IconLink>
            )}
          </IconLinks>
        </HeaderLayout>
      </HeaderBackground>
    )}
  />
)

export default Header
