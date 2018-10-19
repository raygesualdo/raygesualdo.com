import React from 'react'
import slug from 'slug'
import {
  Article,
  TalkTitle,
  TalkTitleAnchor,
  TalkResourceList,
  TalkResourceListItem,
  TalkAbstract,
} from './styles'

const ResourceLink = props => {
  if (!props.link) return null
  if (!props.link.startsWith('http') && !props.link.startsWith('/')) {
    return `${props.type}: ${props.link}`
  }
  return (
    <a href={props.link} title={props.type}>
      {props.type}
    </a>
  )
}

const Talk = talk => (
  <Article>
    <TalkTitle id={slug(talk.title)}>
      <TalkTitleAnchor href={slug(talk.title)}>#</TalkTitleAnchor>
      {talk.title}
    </TalkTitle>
    <TalkResourceList>
      <TalkResourceListItem>
        <ResourceLink type="Video" link={talk.video} />
      </TalkResourceListItem>
      <TalkResourceListItem>
        <ResourceLink type="Slides" link={talk.slides} />
      </TalkResourceListItem>
      <TalkResourceListItem>
        <ResourceLink type="Code" link={talk.code} />
      </TalkResourceListItem>
    </TalkResourceList>
    <TalkAbstract>{talk.abstract}</TalkAbstract>
  </Article>
)

export default Talk
