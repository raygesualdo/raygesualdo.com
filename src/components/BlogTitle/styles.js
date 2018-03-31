import styled from 'styled-components'
import { rhythm, scale, options } from '../../utils/typography'

export const Layout = styled.div`
  margin: ${rhythm(2)} 0;
  text-align: center;
`

export const Title = styled.h1`
  margin: 0;
  font-weight: 300;
`

export const Date = styled.div`
  ${{ ...scale(-1 / 5) }};
  font-family: ${options.headerFontFamily.join(',')};
`
