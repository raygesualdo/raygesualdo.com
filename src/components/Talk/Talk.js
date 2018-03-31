import React from 'react'
import {
  Article,
  TalkTitle,
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
    <TalkTitle>{talk.title}</TalkTitle>
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
