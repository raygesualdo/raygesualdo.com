import styled, { css } from 'styled-components'
import Link from 'gatsby-link'
import { get } from 'lodash/fp'
import { rhythm, scale, options } from '../../utils/typography'
import rest from '../../utils/typography'
import { IconGitHub, IconTwitter } from '../Icons/Icons'

const undecoratedStyles = css`
  text-decoration: none;
`

export const HeaderBackground = styled.div`
  background-color: ${get('theme.headerBgColor')};
  color: ${get('theme.headerColor')};
  font-family: ${options.headerFontFamily.join(',')};
`

export const HeaderLayout = styled.div`
  max-width: ${rhythm(25)};
  margin: 0 auto;
  padding: ${rhythm(1.25)};
  display: flex;
`

export const HeaderLeft = styled.div`
  flex: 1;
  display: flex;
`

export const HeaderRight = styled.div`
  display: flex;
`

export const SiteTitle = styled.div`
  flex: 1;
  margin: 0;
  padding: 0;
  ${{ ...scale(0.25) }};
  font-weight: 400;
  text-transform: uppercase;
`

export const SiteTitleLink = styled(Link)`
  ${undecoratedStyles};
  color: inherit;
`

export const Menu = styled.nav`
  display: flex;
  margin: 0;
  padding: 0;
`

export const MenuItem = styled.div`
  margin-right: ${rhythm(1)};
`

export const MenuLink = styled(Link)`
  ${undecoratedStyles};
  color: inherit;
`

export const IconLink = styled.a`
  ${undecoratedStyles};
  color: inherit;
  text-decoration: none !important;
  & + & {
    margin-left: ${rhythm(3 / 5)};
  }
`

const iconStyles = css`
  fill: currentColor;
  display: block;
  width: ${rhythm(1)};
  height: ${rhythm(1)};
`

export const HeaderIconGitHub = styled(IconGitHub)`
  ${iconStyles};
`

export const HeaderIconTwitter = styled(IconTwitter)`
  ${iconStyles};
`
