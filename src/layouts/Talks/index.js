import React, { PropTypes } from 'react'
import Helmet from 'react-helmet'
import { joinUri } from 'phenomic'
import PostTitle from '../../components/shared/PostTitle'
import { Article, Body, TalkTitle, TalkResourceList, TalkAbstract } from '../../components/shared/common'

const ResourceLink = props => {
  if (!props.link) return null
  if (!props.link.startsWith('http') && !props.link.startsWith('/')) {
    return <span>{props.type}: {props.link}</span>
  }
  return <a href={props.link} title={props.type}>{props.type}</a>
}

const Homepage = (
  {
    isLoading,
    __url,
    head
  },
  {
    metadata: { pkg, talks }
  }
) => {
  const metaTitle = head.metaTitle || head.title || pkg.title
  const helmet = {
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: metaTitle },
      { property: 'og:url', content: joinUri(process.env.PHENOMIC_USER_URL, __url) },
      { property: 'og:description', content: head.description },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: metaTitle },
      { name: 'twitter:creator', content: `@${pkg.twitter}` },
      { name: 'twitter:description', content: head.description },
      { name: 'description', content: head.description }
    ]
  }

  return (
    <div>
      <Helmet {...helmet} />
      <PostTitle nolink>Talks</PostTitle>
      <Body>
        {talks.sort(titleSort).map(talk => (
          <Article>
            <TalkTitle>{talk.title}</TalkTitle>
            <TalkResourceList>
              <li><ResourceLink type='Video' link={talk.video} /></li>
              <li><ResourceLink type='Slides' link={talk.slides} /></li>
              <li><ResourceLink type='Code' link={talk.code} /></li>
            </TalkResourceList>
            <TalkAbstract>{talk.abstract}</TalkAbstract>
          </Article>
        ))}
      </Body>
    </div>
  )
}

Homepage.propTypes = {
  isLoading: PropTypes.bool,
  __url: PropTypes.string,
  head: PropTypes.object.isRequired
}

Homepage.contextTypes = {
  metadata: PropTypes.object.isRequired,
  collection: PropTypes.array.isRequired
}

export default Homepage

function titleSort (a, b) {
  const titleA = a.title.toUpperCase()
  const titleB = b.title.toUpperCase()
  if (titleA < titleB) {
    return -1
  }
  if (titleA > titleB) {
    return 1
  }
  return 0
}
