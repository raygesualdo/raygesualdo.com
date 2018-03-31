import styled from 'styled-components'
import { rhythm, scale, options } from '../../utils/typography'

export const Article = styled.article`
  margin-bottom: ${rhythm(4)};
`
export const TalkTitle = styled.h1`
  ${{ ...scale(1 / 2) }};
  margin: 0 0 ${rhythm(2 / 3)};
`
export const TalkResourceList = styled.ul`
  list-style: circle;
  margin: 0 ${rhythm(1)} ${rhythm(2 / 3)};
  font-family: ${options.headerFontFamily.join(',')};
`
export const TalkResourceListItem = styled.li`
  margin-bottom: 0;
  &:empty {
    display: none;
  }
`
export const TalkAbstract = styled.p`
  margin-bottom: 0;
`
