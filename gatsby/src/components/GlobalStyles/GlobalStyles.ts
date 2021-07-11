import { createGlobalStyle } from 'styled-components'
import { get, Theme } from '../../utils/theme'

export const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
  body {
    background-color: ${get('bodyBgColor')};
    color: ${get('textColor')};
    scroll-behavior: smooth;
  }
  
  a {
    color: ${get('linkColor')};

    &.anchor svg path {
      stroke: currentColor;
    }
  }
`
