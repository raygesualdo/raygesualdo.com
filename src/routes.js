import React from 'react'
import { Route } from 'react-router'
import { PageContainer as PhenomicPageContainer } from 'phenomic'

import AppContainer from './AppContainer'
import Page from './layouts/Page'
import PageError from './layouts/PageError'
import Homepage from './layouts/Homepage'
import Post from './layouts/Post'

const handlePageview = () => {
  if (typeof window !== 'undefined' && typeof ga === 'function') {
    ga('set', 'page', window.location.pathname)
    ga('send', 'pageview')
  }
}

const PageContainer = (props) => (
  <PhenomicPageContainer
    {...props}
    layouts={{
      Page,
      PageError,
      Homepage,
      Post
    }}
  />
)

export default (
  <Route component={AppContainer} onUpdate={handlePageview}>
    <Route path='*' component={PageContainer} />
  </Route>
)
