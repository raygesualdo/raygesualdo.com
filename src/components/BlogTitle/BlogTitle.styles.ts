import styled from 'styled-components'
import { scale, options } from '../../utils/typography'
import { responsiveTitleMargins } from '../../utils/styles'

export const Layout = styled.div`
  ${responsiveTitleMargins};
  text-align: center;
`

export const Title = styled.h1`
  margin: 0;
  font-weight: 300;
`

export const Date = styled.div`
  ${{ ...scale(-1 / 5) }};
  font-family: ${options.headerFontFamily?.join(',')};
`
