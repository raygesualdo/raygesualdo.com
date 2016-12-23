import React, { PropTypes } from 'react'
import { Link } from 'phenomic'
import styled from 'styled-components'

const Title = styled.h1`
  font-size: 3.8rem;
  line-height: 1.3;
  color: #404040;
`
const TitleLink = styled(Link)`
  text-decoration: none;
  color: #404040;
`

const PostTitle = ({children, nolink, ...props}) => (
  <Title>
    { nolink
      ? children
      : <TitleLink {...props}>{ children }</TitleLink>
    }
  </Title>
)

PostTitle.propTypes = {
  children: PropTypes.node,
  nolink: PropTypes.bool
}

export default PostTitle
