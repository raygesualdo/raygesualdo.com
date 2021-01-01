import styled from 'styled-components'
import { responsiveTitleMargins } from '../../utils/styles'
import { options } from '../../utils/typography'

export const Layout = styled.div`
  ${responsiveTitleMargins};
  text-align: center;
`

export const Title = styled.h1`
  margin: 0;
  font-weight: 300;
`

export const Subtitle = styled.div`
  font-family: ${options.headerFontFamily.join(',')};
  color: ${options.headerColor};
`
