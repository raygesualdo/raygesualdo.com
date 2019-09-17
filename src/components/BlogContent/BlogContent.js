import styled from 'styled-components'
import { get } from 'lodash/fp'
import { rhythm, scale, options } from '../../utils/typography'

const BlogContent = styled.div`
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
      color: ${get('theme.codeTagColor')};
      background: ${get('theme.codeTagBgColor')};
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
    text-shadow: none;
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
    background-color: ${get('theme.blockquoteBgColor')};
    border-left: ${rhythm(3 / 16)} solid ${get('theme.blockquoteBorderColor')};
    font-style: italic;
  }
`

export default BlogContent
