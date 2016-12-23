import React, { PropTypes } from 'react'
import moment from 'moment'
import styled from 'styled-components'

const TheDate = styled.time`
  color: #666666;
  font-size: .8em;
  text-transform: uppercase;
`

const PostDate = ({date}) => (
  <TheDate>
    { moment(date).format('MMMM D, YYYY') }
  </TheDate>
)

PostDate.propTypes = {
  date: PropTypes.string.isRequired
}

export default PostDate
