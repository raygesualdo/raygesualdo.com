import { css } from 'styled-components'
import { rhythm } from './typography'
import { get } from 'lodash/fp'
import { MIN_TABLET_MEDIA_QUERY } from 'typography-breakpoint-constants'

export const responsiveTitleMargins = css`
  margin: ${rhythm(1)} 0;
  transition: all 0.1s ease-in;
  ${MIN_TABLET_MEDIA_QUERY} {
    margin: ${rhythm(2)} 0;
  }
`

const codeSelector = 'code[class*="language-"], pre[class*="language-"]'
const codeSelectorBlock = 'pre[class*="language-"]'
const codeSelectorInline = ':not(pre) > code[class*="language-"]'

export const prismTheme = css`
  ${codeSelector} {
    tab-size: 2;
    hyphens: none;
    white-space: pre;
    white-space: pre-wrap;
    word-wrap: normal;
    font-family: Menlo, Monaco, 'Courier New', monospace;
    font-size: 14px;
    color: #76d9e6;
    color: ${get('theme.colors.lightblue')};
    color: ${get('theme.colors.gray')};
    text-shadow: none;
  }
  ${codeSelectorBlock}, ${codeSelectorInline} {
    background: #2a2a2a;
  }
  ${codeSelectorBlock} {
    padding: 15px;
    border-radius: 4px;
    border: 1px solid #e1e1e8;
    overflow: auto;
    position: relative;
    code {
      white-space: pre;
      display: block;
    }
  }

  ${codeSelectorInline} {
    padding: 0.15em 0.2em 0.05em;
    border-radius: 0.3em;
    border: 0.13em solid #7a6652;
    box-shadow: 1px 1px 0.3em -0.1em #000 inset;
  }
  .token {
    &.namespace {
      opacity: 0.7;
    }
    &.function {
      color: ${get('theme.colors.lightyellow')};
    }
    &.comment,
    &.prolog,
    &.doctype,
    &.cdata {
      color: #6f705e;
    }
    &.operator,
    &.boolean,
    &.number {
      color: #a77afe;
      color: ${get('theme.colors.purple')};
    }
    &.attr-name,
    &.string {
      color: #e6d06c;
      color: ${get('theme.colors.lightgreen')};
    }
    &.entity,
    &.url,
    .language-css &.string,
    .style &.string {
      color: #e6d06c;
      color: ${get('theme.colors.lightgreen')};
    }
    &.selector,
    &.inserted {
      color: #a6e22d;
    }
    &.atrule,
    &.attr-value,
    &.keyword,
    &.important,
    &.deleted {
      color: #ef3b7d;
      color: ${get('theme.colors.red')};
    }
    &.regex,
    &.statement {
      color: #76d9e6;
    }
    &.placeholder,
    &.variable {
      color: #fff;
    }
    &.important,
    &.statement,
    &.bold {
      font-weight: bold;
    }
    &.punctuation {
      color: #bebec5;
    }
    &.entity {
      cursor: help;
    }
    &.italic {
      font-style: italic;
    }
  }

  code.language-markup {
    color: #f9f9f9;
    .token {
      &.tag {
        color: #ef3b7d;
      }
      &.attr-name {
        color: #a6e22d;
      }
      &.attr-value {
        color: #e6d06c;
      }
      &.style,
      &.script {
        color: #76d9e6;
      }
      &.script .token.keyword {
        color: #76d9e6;
      }
    }
  }

  /* Line highlight plugin */
  ${codeSelectorBlock} [data-line] {
    position: relative;
    padding: 1em 0 1em 3em;
  }
  pre[data-line] .line-highlight {
    position: absolute;
    left: 0;
    right: 0;
    padding: 0;
    margin-top: 1em;
    background: rgba(255, 255, 255, 0.08);
    pointer-events: none;
    line-height: inherit;
    white-space: pre;
    &:before,
    &[data-end]:after {
      content: attr(data-start);
      position: absolute;
      top: 0.4em;
      left: 0.6em;
      min-width: 1em;
      padding: 0.2em 0.5em;
      background-color: rgba(255, 255, 255, 0.4);
      color: black;
      font: bold 65%/1 sans-serif;
      height: 1em;
      line-height: 1em;
      text-align: center;
      border-radius: 999px;
      text-shadow: none;
      box-shadow: 0 1px 1px rgba(255, 255, 255, 0.7);
    }
    &[data-end]:after {
      content: attr(data-end);
      top: auto;
      bottom: 0.4em;
    }
  }
`
