import styled from 'styled-components'
import { rhythm } from '../../utils/typography'
import { responsiveTitleMargins } from '../../utils/theme'

export const Layout = styled.div`
  ${responsiveTitleMargins};
  text-align: center;
`

export const Title = styled.h1`
  margin: 0;
  font-weight: 300;
`