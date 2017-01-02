import React, { PropTypes } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  padding: 1rem 0;
  text-align: center;
`
const Title = styled.div`
  font-size: 8rem;
  line-height: 8rem;
`
const Subtitle = styled.p`
  margin: 2rem 0 4rem;
  font-size: 3.5rem;
  line-height: 4rem;
`

const PageError = ({ error, errorText }) => (
  <Container>
    <Title>🤕 <strong>{error}</strong></Title>
    <Subtitle>{errorText}</Subtitle>
    <div>
      { error === 404 &&
        <div>It seems you found a broken link. Sorry about that.<br />Please <a href='https://github.com/raygesualdo/raygesualdo.com/issues/new'>file an issue</a> so I can resolve it!</div>
      }
    </div>
  </Container>
)

PageError.propTypes = {
  error: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  errorText: PropTypes.string
}

PageError.defaultProps = {
  error: 404,
  errorText: 'Page Not Found'
}

export default PageError
