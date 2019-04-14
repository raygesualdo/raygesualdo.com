import { css } from 'styled-components'
import { rhythm } from './typography'
import { MIN_TABLET_MEDIA_QUERY } from 'typography-breakpoint-constants'

export const responsiveTitleMargins = css`
  margin: ${rhythm(1)} 0;
  transition: margin 0.1s ease-in;
  ${MIN_TABLET_MEDIA_QUERY} {
    margin: ${rhythm(2)} 0;
  }
`
