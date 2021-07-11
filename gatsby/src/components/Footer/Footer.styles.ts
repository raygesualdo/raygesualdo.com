import styled from 'styled-components'
import { get } from '../../utils/theme'
import { rhythm, scale } from '../../utils/typography'

export const FooterLayout = styled.footer`
  ${{ ...scale(-1 / 3) }};
  padding: ${rhythm(1)};
  text-align: center;
  color: ${get('footerColor')};
`

export const LinkButton = styled.button`
  display: inline;
  margin: 0;
  padding: 0;
  border: none;
  font-size: inherit;
  color: inherit;
  height: fit-content;
  background: transparent;

  text-decoration: underline;
  cursor: pointer;
  color: ${get('linkColor')};
  &:hover {
    color: ${get('codeColor')};
  }
`
