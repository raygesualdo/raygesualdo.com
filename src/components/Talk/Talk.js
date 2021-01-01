import React, { Fragment } from 'react'
import slug from 'slug'
import capitalize from 'lodash/capitalize'
import {
  Article,
  TalkTitle,
  TalkTitleAnchor,
  TalkEventsList,
  TalkEventsListItem,
  TalkAbstract,
} from './styles'

const intersperse = (array, separator) =>
  array.flatMap((e) => [separator, e]).slice(1)

const ResourceLink = (props) => {
  if (!props.link.startsWith('http') && !props.link.startsWith('/')) {
    return `${props.type}: ${props.link}`
  }
  return (
    <a href={props.link} title={props.type}>
      {props.type}
    </a>
  )
}

const ResourceArray = (props) => {
  const keys = ['video', 'slides', 'code']
  const populatedKeys = keys.filter((key) => !!props[key])

  if (!populatedKeys.length) {
    return null
  }

  return (
    <Fragment>
      (
      {intersperse(
        populatedKeys.map((key) => (
          <ResourceLink type={capitalize(key)} link={props[key]} />
        )),
        ' | '
      )}
      )
    </Fragment>
  )
}

const Talk = (talk) => (
  <Article>
    <TalkTitle id={slug(talk.title)}>
      <TalkTitleAnchor href={'#' + slug(talk.title)}>#</TalkTitleAnchor>
      {talk.title}
    </TalkTitle>
    <TalkEventsList>
      {talk.events.map((event) => (
        <TalkEventsListItem>
          {event.title} <ResourceArray {...event} />
        </TalkEventsListItem>
      ))}
    </TalkEventsList>
    <TalkAbstract>{talk.abstract}</TalkAbstract>
  </Article>
)

export default Talk
