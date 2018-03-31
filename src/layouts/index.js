import React, { Fragment } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { get } from 'lodash/fp'
import { rhythm } from '../utils/typography'
import Header from '../components/Header/Header'
import { theme, globalStyles } from '../utils/theme'

globalStyles()

const Content = styled.div`
  max-width: ${rhythm(25)};
  padding: ${rhythm(1.25)} ${rhythm(1.25)};
  margin: 0 auto;
  background-color: ${get('theme.white')};
  border-radius: 2px;
`

class Template extends React.Component {
  render() {
    const { meta } = this.props.data.site
    const { social, menus: { header } } = this.props.data.settings
    return (
      <ThemeProvider theme={theme}>
        <Fragment>
          <Header meta={meta} menu={header} social={social} />
          <Content>{this.props.children()}</Content>
        </Fragment>
      </ThemeProvider>
    )
  }
}

export default Template

export const query = graphql`
query TemplateQuery {
  site {
    meta: siteMetadata {
      title
    }
  }
  settings: siteSettings{
    social {
      twitter
      github
    }
    menus {
      header {
        url
        title
        props {
          target
        }
      }
    }
  }
}
`
