import styled from 'styled-components'
import { Link } from 'phenomic'
import Svg from 'react-svg-inline'

export const HeaderContainer = styled.div`
  display: flex;
  padding: 20px 0;
  margin: 20px auto;
`

export const HeaderLeft = styled.div`
  flex: 1;
`

export const HeaderRight = styled.div`
  display: flex;
`

export const SiteTitle = styled.div`
  font-weight: 900;
  color: #565656;
  line-height: 23.68px;
  font-size: 16px;
  font-size: 1.6rem;
  margin: 0;
  padding: 0;
  text-transform: uppercase;
`

export const SiteTitleLink = styled(Link)`
  color: #565656;
`

export const Menu = styled.nav`
  display: flex;
  margin: 0;
  padding: 0;
`

export const MenuItem = styled.div`
  margin: 4px 10px 0 0;
`

export const MenuLink = styled(Link)`
  color: #888888;
  font-size: 14px;
`

export const IconLink = styled.a`
  color: inherit;
  text-decoration: none !important;
  opacity: 0.3;
  transition: 0.4s all;

  &:hover,
  &:focus {
    color: inherit;
    opacity: .5;
  }
`

export const IconSvg = styled(Svg)`
  fill: currentColor;
  margin-right: 0.5rem;
  display: block;
  width: 24px;
  height: 24px;
`
