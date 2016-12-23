import { injectGlobal } from 'styled-components'
import { headerFontFamily, fontSize } from './style-utils'

injectGlobal`
  /* Reset */
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  /* Global Styles */
  html {
    box-sizing: border-box;
  }
  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
  html {
    min-height: 100%;
    font-size: 62.5%;
  }
  body {
    font-family: "Helvetica Neue", Helvetica, sans-serif;
    line-height: 26.64px;
    font-size: 18px;
    font-size: 1.8rem;
  }
  .phenomic-HeadingAnchor {
    position: absolute;
    text-align: center;
    text-decoration: none;
    opacity: 0;
    transform: translateX(-90%);
    transition: all 0.2s ease-in-out;

    h1:hover &,
    h2:hover &,
    h3:hover &,
    h4:hover &,
    h5:hover &,
    h6:hover & {
      opacity: 1;
      transform: translateX(-110%);
    }
  }
  /* Headings */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: ${headerFontFamily};
    position: relative;
  }
  h1 {
    ${fontSize(48)}
    font-weight: 700;
  }
  h2 {
    ${fontSize(38)}
  }
  h3 {
    ${fontSize(30)}
  }
  h4 {
    ${fontSize(22)}
  }
  h5 {
    ${fontSize(18)}
  }
  h6 {
    ${fontSize(16)}
    font-weight: 700;
  }
  hr {
    background-color: #ccc;
    border: 0;
    height: 1px;
    margin-bottom: 1.5em;
  }
  p {
    margin-bottom: 1.5em;
  }
  ul, ol {
    margin: 0 0 1.5em 3em;
  }
  ul {
    list-style: disc;
  }
  ol {
    list-style: decimal;
  }
  ul ul, ol ol, ul ol, ol ul {
    margin-bottom: 0;
    margin-left: 1.5em;
  }
  dt {
    font-weight: bold;
  }
  dd {
    margin: 0 1.5em 1.5em;
  }
  b, strong {
    font-weight: bold;
  }
  dfn, cite, em, i {
    font-style: italic;
  }
  blockquote {
    margin: 0 1.5em;
  }
  address {
    margin: 0 0 1.5em;
  }
  pre {
    background: #eee;
    font-family: "Courier 10 Pitch", Courier, monospace;
    font-size: 15px;
    font-size: 1.5rem;
    line-height: 1.6;
    margin-bottom: 1.6em;
    padding: .6em;
    overflow: auto;
    max-width: 100%;
  }
  a {
    color: #007998;
    transition: color .25s ease-in-out;
    text-decoration: none;

    &:hover,
    &:focus,
    &:active {
      color: rgba(0, 121, 152, 0.5);
    }
  }

`
