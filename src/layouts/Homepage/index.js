import React, { PropTypes } from 'react'
import Helmet from 'react-helmet'
import { BodyContainer, joinUri } from 'phenomic'
import enhanceCollection from 'phenomic/lib/enhance-collection'
import Loading from '../../components/Loading'
import PostTitle from '../../components/shared/PostTitle'
import PostDate from '../../components/shared/PostDate'
import { Article, MoreLink, PostDescription } from '../../components/shared/common'

const Homepage = (
  {
    isLoading,
    __filename,
    __url,
    head,
    body,
    children
  },
  {
    metadata: { pkg },
    collection
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

  const homepagePosts = enhanceCollection(collection, {
    filter: { layout: 'Post' },
    sort: 'date',
    reverse: true
  })

  return (
    <div>
      <Helmet {...helmet} />
      <div>
        {homepagePosts.map(post => (
          <Article key={post.__url}>
            <PostTitle to={post.__url}>{post.title}</PostTitle>
            <PostDate date={post.date} />
            <PostDescription>{post.description}</PostDescription>
            <MoreLink to={post.__url}>More</MoreLink>
          </Article>
        ))}
      </div>
      { isLoading ? <Loading /> : <BodyContainer>{ null }</BodyContainer> }
    </div>
  )
}

Homepage.propTypes = {
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  __filename: PropTypes.string,
  __url: PropTypes.string,
  head: PropTypes.object.isRequired,
  body: PropTypes.string
}

Homepage.contextTypes = {
  metadata: PropTypes.object.isRequired,
  collection: PropTypes.array.isRequired
}

export default Homepage
