import { injectGlobal } from 'styled-components'
import { rhythm, scale } from './typography'

export const theme = {
  white: '#fff',
  htmlBgGradient: 'linear-gradient(275deg, #813772, #b82601)',
  headerBgColor: '#062f4f',
  headerColor: '#fff',
}

export const globalStyles = () => injectGlobal`
  .gatsby-highlight {
    margin: 0 ${rhythm(1)} ${rhythm(1.5)};
  }
`
