import React from 'react'
import { Link } from 'gatsby'
import { Article, TilTitle, TilPermalink } from './Til.styles'
import { IconPaperclip } from '../Icons/Icons'

export interface TilProps {
  html: string
  fields: {
    date: string
    slug: string
  }
}

const Til = (til: TilProps) => (
  <Article>
    <TilTitle>
      {til.fields.date}
      <TilPermalink>
        <Link to={'/' + til.fields.slug}>
          <IconPaperclip />
        </Link>
      </TilPermalink>
    </TilTitle>
    <div dangerouslySetInnerHTML={{ __html: til.html }} />
  </Article>
)

export default Til
