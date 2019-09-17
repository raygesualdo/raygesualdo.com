import { createGlobalStyle } from 'styled-components'
import { get } from 'lodash/fp'

export const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${get('theme.bodyBgColor')};
    color: ${get('theme.textColor')};
    scroll-behavior: smooth;
  }
  
  a {
    color: ${get('theme.linkColor')};

    &.anchor svg path {
      stroke: currentColor;
    }
  }
`
