import React, { PropTypes } from 'react'

// import "./index.global.css"
import './styles.global'

import Container from './components/Container'
import DefaultHeadMeta from './components/DefaultHeadMeta'
import Header from './components/Header'
import Content from './components/Content'
import Footer from './components/Footer'
import ServerSideStyles from './components/ServerSideStyles'

const AppContainer = (props) => (
  <Container>
    <DefaultHeadMeta />
    <Header />
    <Content>
      { props.children }
    </Content>
    <Footer />
    <ServerSideStyles />
  </Container>
)

AppContainer.propTypes = {
  children: PropTypes.node
}

export default AppContainer
