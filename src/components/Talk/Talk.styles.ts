import styled from 'styled-components'
import { rhythm, scale, options } from '../../utils/typography'

export const Article = styled.article`
  margin-bottom: ${rhythm(4)};
`
export const TalkTitleAnchor = styled.a`
  position: absolute;
  left: 0;
  top: -${rhythm(3 / 10)};
  padding: ${rhythm(3 / 10)};
  opacity: 0;
  color: inherit;
  text-decoration: inherit;
  transition: all 0.3s ease-in;
`
export const TalkTitle = styled.h1`
  position: relative;
  ${{ ...scale(1 / 2) }};
  margin: 0 0 ${rhythm(2 / 3)};
  &:hover ${TalkTitleAnchor} {
    transform: translateX(calc(-100% - ${rhythm(1 / 10)}));
    opacity: 1;
    text-decoration: underline;
  }
`
export const TalkEventsList = styled.ul`
  list-style: circle;
  margin: 0 ${rhythm(1)} ${rhythm(2 / 3)};
  font-family: ${options.headerFontFamily?.join(',')};
`
export const TalkEventsListItem = styled.li`
  margin-bottom: 0;
  &:empty {
    display: none;
  }
`
export const TalkAbstract = styled.p`
  margin-bottom: 0;
`
