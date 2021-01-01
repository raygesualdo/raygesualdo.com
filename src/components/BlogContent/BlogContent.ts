import styled from 'styled-components'
import { get } from '../../utils/theme'
import { rhythm, scale, options } from '../../utils/typography'

const BlogContent = styled.div`
  .gatsby-highlight-code-line {
    background-color: ${get('preHighlightBgColor')};
    display: block;
    margin-right: -1em;
    margin-left: -1em;
    padding-right: 1em;
    padding-left: 0.75em;
    border-left: 0.25em solid ${get('preHighlightBorderColor')};
  }

  .gatsby-highlight {
    position: relative;
    margin: 0 0 ${rhythm(1)};

    &:after {
      content: attr(data-language);
      position: absolute;
      top: 1px;
      right: ${rhythm(3 / 5)};
      display: block;
      padding: ${rhythm(3 / 20)};
      color: ${get('codeTagColor')};
      background: ${get('codeTagBgColor')};
      font-size: ${rhythm(1 / 3)};
      line-height: 1;
      font-family: ${options.monospaceFontFamily.join(',')};
      text-transform: uppercase;
      border-radius: 0 0px 2px 2px;
    }
  }

  .gatsby-resp-image-figcaption {
    margin: 0.25rem;
    text-align: center;
    ${{ ...scale(-3 / 10) }};
    font-family: ${options.headerFontFamily?.join(',')};
    font-style: italic;
  }

  *:not(pre) > code[class*='language-'] {
    padding: 0.2em 0.4em 0.15em;
    border: none;
    border-radius: 2px;
    box-shadow: none;
    background-color: ${get('codeBgColor')};
    color: ${get('codeColor')};
    text-shadow: none;
    font-style: normal;
  }

  blockquote {
    margin-top: 0;
    margin-left: 0;
    margin-right: 0;
    margin-bottom: ${rhythm(1)};
    padding-left: ${rhythm(14 / 16)};
    padding-right: ${rhythm(1 / 2)};
    padding-top: ${rhythm(2 / 3)};
    padding-bottom: ${rhythm(2 / 3)};
    line-height: ${rhythm(1)};
    background-color: ${get('blockquoteBgColor')};
    border-left: ${rhythm(3 / 16)} solid ${get('blockquoteBorderColor')};
    font-style: italic;
  }
`

export default BlogContent
