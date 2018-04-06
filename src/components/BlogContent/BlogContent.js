import styled from 'styled-components'
import { MIN_MOBILE_MEDIA_QUERY } from 'typography-breakpoint-constants'
import { rhythm, scale, options } from '../../utils/typography'

const BlogContent = styled.div`
  .gatsby-highlight {
    margin: 0 0 ${rhythm(1)};
    transition: margin 0.2s ease-in-out;
  }
  ${MIN_MOBILE_MEDIA_QUERY} {
    .gatsby-highlight {
      margin: 0 ${rhythm(1)} ${rhythm(1)};
    }
  }
  .gatsby-resp-image-figcaption {
    margin: .25rem;
    text-align: center;
    ${{ ...scale(-3 / 10) }};
    font-family: ${options.headerFontFamily.join(',')};
    font-style: italic;
  }
`

export default BlogContent
