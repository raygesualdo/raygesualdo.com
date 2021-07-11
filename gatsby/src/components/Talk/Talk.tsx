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
} from './Talk.styles'

const intersperse = (array: any[], separator: any) =>
  array.flatMap((e) => [separator, e]).slice(1)

interface ResourceLinkProps {
  link: string
  type: string
}

const ResourceLink = (props: ResourceLinkProps) => {
  if (!props.link.startsWith('http') && !props.link.startsWith('/')) {
    return (
      <span>
        {props.type}: {props.link}
      </span>
    )
  }
  return (
    <a href={props.link} title={props.type}>
      {props.type}
    </a>
  )
}

interface ResourceArrayProps {
  code?: string
  slides?: string
  video?: string
}

const ResourceArray = (props: ResourceArrayProps) => {
  const keys = ['video', 'slides', 'code']
  const populatedKeys = keys.filter(
    (key) => !!props[key as keyof ResourceArrayProps]
  )

  if (!populatedKeys.length) {
    return null
  }

  return (
    <Fragment>
      (
      {intersperse(
        populatedKeys.map((key) => (
          <ResourceLink
            type={capitalize(key)}
            link={props[key as keyof ResourceArrayProps]!}
          />
        )),
        ' | '
      )}
      )
    </Fragment>
  )
}

interface TalkProps {
  abstract: string
  title: string
  events: {
    title: string
    code?: string
    slides?: string
    video?: string
  }[]
}

const Talk = (talk: TalkProps) => (
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
