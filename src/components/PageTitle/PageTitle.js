import React from 'react'
import { Layout, Title, Subtitle } from './styles'

const PageTitle = (props) => (
  <Layout>
    {props.subtitle && <Subtitle>— {props.subtitle} —</Subtitle>}
    <Title>{props.title}</Title>
  </Layout>
)

export default PageTitle
