import React, { PropTypes } from 'react'
import twitterSvg from '../icons/iconmonstr-twitter-1.svg'
import gitHubSvg from '../icons/iconmonstr-github-1.svg'
import {
  HeaderContainer,
  HeaderLeft,
  HeaderRight,
  SiteTitle,
  SiteTitleLink,
  Menu,
  MenuItem,
  MenuLink,
  IconLink,
  IconSvg
} from './styles'

const Header = (props, { metadata: { pkg, menu } }) => (
  <HeaderContainer>
    <HeaderLeft>
      <SiteTitle>
        <SiteTitleLink to='/' title={pkg.title} rel='home'>
          {pkg.title}
        </SiteTitleLink>
      </SiteTitle>
      <Menu role='navigation'>
        {[...menu].map(([id, item]) => (
          <MenuItem key={id}>
            <MenuLink to={item.url} title={item.title} {...item.props}>{item.title}</MenuLink>
          </MenuItem>
        ))}
      </Menu>
    </HeaderLeft>
    <HeaderRight>
      { pkg.twitter &&
        <IconLink href={`https://twitter.com/${pkg.twitter}`}>
          <IconSvg svg={twitterSvg} cleanup title='Twitter' />
        </IconLink>
      }
      { pkg.github &&
        <IconLink href={`https://github.com/${pkg.github}`}>
          <IconSvg svg={gitHubSvg} cleanup title='GitHub' />
        </IconLink>
      }
    </HeaderRight>
  </HeaderContainer>
)

Header.contextTypes = {
  metadata: PropTypes.object.isRequired
}

export default Header
