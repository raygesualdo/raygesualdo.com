import { css } from 'styled-components'
import { rhythm } from './typography'
import { MIN_TABLET_MEDIA_QUERY } from 'typography-breakpoint-constants'

export const theme = {
  white: '#fff',
  htmlBgGradient: 'linear-gradient(275deg, #813772, #b82601)',
  headerBgColor: '#062f4f',
  headerColor: '#fff',
}

export const responsiveTitleMargins = css`
  margin: ${rhythm(1)} 0;
  transition: all 0.1s ease-in;
  ${MIN_TABLET_MEDIA_QUERY} {
    margin: ${rhythm(2)} 0;
  }
`
