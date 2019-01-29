import styled from 'styled-components'
import { rhythm, scale } from '../../utils/typography'

export const Article = styled.article`
  margin-bottom: ${rhythm(3)};

  li li {
    margin-bottom: ${rhythm(0.25)};
  }
`

export const TilTitle = styled.h1`
  position: relative;
  ${{ ...scale(1 / 2) }};
  margin: 0 0 ${rhythm(2 / 3)};
`

export const TilPermalink = styled.sup`
  margin-left: ${rhythm(1 / 5)};
  font-size: ${rhythm(1 / 2)};
`
