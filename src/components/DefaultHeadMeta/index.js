import React, { PropTypes } from 'react'
import Helmet from 'react-helmet'

const DefaultHeadMeta = (props, {metadata: {pkg}}) => {
  const helmet = {
    titleTemplate: `%s | ${pkg.title}`,
    defaultTitle: pkg.title,
    titleAttributes: {itemprop: 'name', lang: 'en'},
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { property: 'og:site_name', content: pkg.title },
      { name: 'twitter:site', content: `@${pkg.twitter}` }
    ],
    link: [
      // { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css", integrity: "sha256-gvEnj2axkqIj4wbYhPjbWV7zttgpzBVEgHub9AAZQD4=", crossorigin: "anonymous" },
      // { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css", integrity: "sha256-t2/7smZfgrST4FS1DT0bs/KotCM74XlcqZN5Vu7xlrw=", crossorigin: "anonymous" },
      { rel: 'stylesheet', href: 'http://fonts.googleapis.com/css?family=Arvo:400,700' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/styles/atom-one-dark.min.css' }
    ],
    script: [
      { src: 'https://cdn.polyfill.io/v2/polyfill.min.js' }
    ],
    style: [
      { type: 'text/css', cssText: '@-ms-viewport { width: device-width; }' }
    ]
  }

  return <Helmet {...helmet} />
}

DefaultHeadMeta.contextTypes = {
  metadata: PropTypes.object.isRequired
}

export default DefaultHeadMeta
