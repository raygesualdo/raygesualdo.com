import { createGlobalStyle } from 'styled-components'
import { get } from 'lodash/fp'

export const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${get('theme.bodyBgColor')};
    color: ${get('theme.textColor')};
  }
  
  a {
    color: ${get('theme.linkColor')};
  }
`
