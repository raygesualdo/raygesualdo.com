import React from 'react'
import Helmet from 'react-helmet'
import styled, { keyframes } from 'styled-components'
import TopBarProgressIndicator from 'react-topbar-progress-indicator'

const Loader = styled.div`
  display: flex;
  height: 25vh;
  justify-content: center;
  align-items: center;
`
const rotation = keyframes`
  from {
    opacity: 1;
    transform: rotate(0);
  }
  to {
    opacity: 1;
    transform: rotate(359deg);
  }
`
const Spinner = styled.div`
  height: 5vh;
  min-height: 5rem;
  width: 5vh;
  min-width: 5rem;
  border: 6px solid rgba(0, 0, 0, .2);
  border-top-color: rgba(0, 0, 0, .8);
  border-radius: 100%;
  animation: ${rotation} 0.6s infinite linear 0.25s;
  /* the opacity is used to lazyload the spinner, see animation delay */
  opacity: 0;
`

TopBarProgressIndicator.config({
  barColors: {
    '0': '#fff',
    '1.0': '#fff'
  },
  shadowBlur: 5
})

const Loading = () => (
  <div>
    <Helmet title={'Loading...'} />
    <TopBarProgressIndicator />
    <Loader>
      <Spinner />
    </Loader>
  </div>
)

export default Loading
