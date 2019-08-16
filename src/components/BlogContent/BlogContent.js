import styled from 'styled-components'
import { get } from 'lodash/fp'
import { rhythm, scale, options } from '../../utils/typography'

const BlogContent = styled.div`
  .gatsby-highlight {
    margin: 0 0 ${rhythm(1)};
  }

  .gatsby-resp-image-figcaption {
    margin: 0.25rem;
    text-align: center;
    ${{ ...scale(-3 / 10) }};
    font-family: ${options.headerFontFamily.join(',')};
    font-style: italic;
  }

  *:not(pre) > code[class*='language-'] {
    padding: 0.2em 0.4em 0.15em;
    border: none;
    border-radius: 2px;
    box-shadow: none;
    background-color: ${get('theme.codeBgColor')};
    color: ${get('theme.codeColor')};
  }

  blockquote {
    background-color: ${get('theme.blockQuoteColor')};
  }
`

export default BlogContent
