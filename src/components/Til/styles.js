import styled from 'styled-components'
import { rhythm } from '../../utils/typography'

export const Article = styled.article`
  margin-bottom: ${rhythm(3)};

  li li {
    margin-bottom: ${rhythm(0.25)};
  }
`
