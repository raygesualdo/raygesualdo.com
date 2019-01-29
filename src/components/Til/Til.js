import React from 'react'
import { Link } from 'gatsby'
import { Article, TilTitle, TilPermalink } from './styles'
import { IconPaperclip } from '../Icons/Icons'

const Til = til => (
  <Article>
    <TilTitle>
      {til.fields.date}
      <TilPermalink>
        <Link to={til.fields.slug}><IconPaperclip /></Link>
      </TilPermalink>
    </TilTitle>
    <div dangerouslySetInnerHTML={{ __html: til.html }} />
  </Article>
)

export default Til
