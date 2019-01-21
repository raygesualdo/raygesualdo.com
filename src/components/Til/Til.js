import React from 'react'
import slug from 'slug'
import { Article } from './styles'
import { TalkTitle, TalkTitleAnchor } from '../Talk/styles'

const Til = til => (
  <Article>
    <TalkTitle id={slug(til.fields.rawDate)}>
      <TalkTitleAnchor href={'#' + slug(til.fields.rawDate)}>#</TalkTitleAnchor>
      {til.fields.date}
    </TalkTitle>
    <div dangerouslySetInnerHTML={{ __html: til.html }} />
  </Article>
)

export default Til
