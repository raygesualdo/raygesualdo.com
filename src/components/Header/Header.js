import React from 'react'
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

const Header = props => (
  <HeaderBackground>
    <HeaderLayout>
        <SiteTitle>
          <SiteTitleLink to="/" title={props.meta.title} rel="home">
            {props.meta.title}
          </SiteTitleLink>
        </SiteTitle>
        <Menu role="navigation">
          {props.menu.map(item => (
            <MenuItem key={item.url}>
              <MenuLink to={item.url} title={item.title} {...item.props}>
                {item.title}
              </MenuLink>
            </MenuItem>
          ))}
        </Menu>
      <IconLinks>
        {props.social.twitter && (
          <IconLink href={`https://twitter.com/${props.social.twitter}`}>
            <HeaderIconTwitter title="Twitter" />
          </IconLink>
        )}
        {props.social.github && (
          <IconLink href={`https://github.com/${props.social.github}`}>
            <HeaderIconGitHub title="GitHub" />
          </IconLink>
        )}
      </IconLinks>
    </HeaderLayout>
  </HeaderBackground>
)

export default Header