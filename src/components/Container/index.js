import React, { PropTypes } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  max-width: 720px;
  padding: 20px;
  margin: 0 auto;
`

const Container = (props) => (
  <Wrapper>
    { props.children }
  </Wrapper>
)

Container.propTypes = {
  children: PropTypes.node
}

export default Container
