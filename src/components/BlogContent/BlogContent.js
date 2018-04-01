import styled from 'styled-components'
import {MIN_MOBILE_MEDIA_QUERY} from 'typography-breakpoint-constants'
import { rhythm } from '../../utils/typography'

const BlogContent = styled.div`
  .gatsby-highlight {
    margin: 0 0 ${rhythm(1.5)};
    transition: margin .2s ease-in-out;
  }
  ${MIN_MOBILE_MEDIA_QUERY} {
    .gatsby-highlight {
      margin: 0 ${rhythm(1)} ${rhythm(1.5)};
    }
  }
`

export default BlogContent
