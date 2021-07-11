import React, { Fragment } from 'react'
import styled from 'styled-components'
import Helmet from 'react-helmet'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { rhythm } from '../../utils/typography'
import { GlobalStyles } from '../GlobalStyles/GlobalStyles'
import { ThemeModeProvider } from '../useThemeMode'
import { ThemeProvider } from '../ThemeProvider/ThemeProvider'

const Content = styled.div`
  max-width: ${rhythm(25)};
  margin: 0 auto;
  padding: ${rhythm(0.5)};
`

const Layout: React.FunctionComponent = ({ children }) => (
  <ThemeModeProvider>
    <ThemeProvider>
      <Fragment>
        <Helmet
          titleTemplate="%s · RayGesualdo.com"
          defaultTitle="RayGesualdo.com"
        />
        <GlobalStyles />
        <Header />
        <Content>{children}</Content>
        <Footer />
      </Fragment>
    </ThemeProvider>
  </ThemeModeProvider>
)

export default Layout
