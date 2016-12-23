import React, { PropTypes } from 'react'
import Helmet from 'react-helmet'
import { BodyContainer, joinUri } from 'phenomic'
import PostTitle from '../../components/shared/PostTitle'
import { Body, Article } from '../../components/shared/common'
import Loading from '../../components/Loading'

const Page = (
  {
    isLoading,
    __filename,
    __url,
    head,
    header,
    body,
    children
  },
  {
    metadata: { pkg }
  }
) => {
  const metaTitle = head.metaTitle || head.title || pkg.title
  const helmet = {
    title: metaTitle,
    meta: [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: metaTitle },
      { property: 'og:url', content: joinUri(process.env.PHENOMIC_USER_URL, __url) },
      { property: 'og:description', content: head.description },
      { name: 'twitter:card', content: head.hero ? 'summary_large_image' : 'summary' },
      { name: 'twitter:title', content: metaTitle },
      { name: 'twitter:creator', content: `@${pkg.twitter}` },
      { name: 'twitter:description', content: head.description },
      { name: 'description', content: head.description }
    ]
  }

  return (
    <div>
      <Helmet {...helmet} />
      <PostTitle nolink>{metaTitle}</PostTitle>
      {header}
      <Body>
        <Article>
          {
            isLoading
            ? <Loading />
            : <BodyContainer>{ body }</BodyContainer>
          }
        </Article>
      </Body>
    </div>
  )
}

Page.propTypes = {
  header: PropTypes.node,
  isLoading: PropTypes.bool,
  __filename: PropTypes.string,
  __url: PropTypes.string,
  head: PropTypes.object.isRequired,
  body: PropTypes.string
}

Page.contextTypes = {
  metadata: PropTypes.object.isRequired
}

export default Page
