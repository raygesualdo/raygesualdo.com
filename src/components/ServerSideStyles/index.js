import React from 'react'
import Helmet from 'react-helmet'
import styleSheet from 'styled-components/lib/models/StyleSheet'

const ServerSideStyles = () => {
  const styles = styleSheet.rules().map(rule => rule.cssText).join('\n')
  const helmet = {
    style: [
      { type: 'text/css', cssText: styles, 'data-styled-components': true }
    ]
  }

  return (typeof window === 'undefined' ? <Helmet {...helmet} /> : null)
}

export default ServerSideStyles
