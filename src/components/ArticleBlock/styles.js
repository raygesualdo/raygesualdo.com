import styled from 'styled-components'
import Link from 'gatsby-link'
import { rhythm, scale, options } from '../../utils/typography'

export const Article = styled.article`
  margin-bottom: ${rhythm(2)};
`

export const Title = styled.h1`
  margin: 0;
  ${{ ...scale(4 / 5) }};
`

export const TitleLink = styled(Link)`
  text-decoration: none;
`

export const Date = styled.div`
  margin-bottom: ${rhythm(1 / 4)};
  ${{ ...scale(-1 / 5) }};
  font-family: ${options.headerFontFamily.join(',')};
`
