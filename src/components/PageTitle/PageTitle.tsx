import React from 'react'
import { Layout, Title, Subtitle } from './PageTitle.styles'

export interface PageTitleProps {
  title: string
  subtitle?: string
}

const PageTitle = (props: PageTitleProps) => (
  <Layout>
    {props.subtitle && <Subtitle>— {props.subtitle} —</Subtitle>}
    <Title>{props.title}</Title>
  </Layout>
)

export default PageTitle
