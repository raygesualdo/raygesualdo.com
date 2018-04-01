import styled, { css } from 'styled-components'
import Link from 'gatsby-link'
import { get } from 'lodash/fp'
import {
  MIN_TABLET_MEDIA_QUERY,
  TABLET_MEDIA_QUERY,
} from 'typography-breakpoint-constants'
import { rhythm, scale, options } from '../../utils/typography'
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
  padding: ${rhythm(.75)};
  display: grid;
  grid-gap: ${rhythm(0.25)} ${rhythm(1)};
  grid-template-columns: 100%;
  ${MIN_TABLET_MEDIA_QUERY} {
    grid-template-columns: 1fr min-content min-content;
    padding: ${rhythm(1.25)};
  }
`

export const SiteTitle = styled.div`
  ${{ ...scale(0.25) }};
  font-weight: 400;
  text-transform: uppercase;
  white-space: nowrap;
  ${TABLET_MEDIA_QUERY} {
    text-align: center;
  }
`

export const SiteTitleLink = styled(Link)`
  ${undecoratedStyles};
  color: inherit;
`

export const Menu = styled.nav`
  display: flex;
  ${TABLET_MEDIA_QUERY} {
    justify-content: center;
  }
`

export const MenuItem = styled.div`
  & + & {
    margin-left: ${rhythm(1)};
  }
`

export const MenuLink = styled(Link)`
  ${undecoratedStyles};
  color: inherit;
`

export const IconLinks = styled.div`
  display: flex;
  ${TABLET_MEDIA_QUERY} {
    justify-content: center;
  }
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
