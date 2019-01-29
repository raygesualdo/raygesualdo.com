import React, { Fragment } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import Helmet from 'react-helmet'
import Header from '../Header/Header'
import { rhythm } from '../../utils/typography'
import { theme } from '../../utils/theme'

const Content = styled.div`
  max-width: ${rhythm(25)};
  margin: 0 auto;
  padding: ${rhythm(0.5)}};
`

const Layout = ({ children }) => (
  <ThemeProvider theme={theme}>
    <Fragment>
      <Helmet
        titleTemplate="%s · RayGesualdo.com"
        defaultTitle="RayGesualdo.com"
      />
      <Header />
      <Content>{children}</Content>
    </Fragment>
  </ThemeProvider>
)

export default Layout
