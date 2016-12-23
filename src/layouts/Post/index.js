import React, { PropTypes } from 'react'
import PostDate from '../../components/shared/PostDate'
import Page from '../Page'

const Post = (props) => {
  const header = <PostDate date={props.head.date} />
  return <Page {...props} header={header} />
}

Post.propTypes = {
  head: PropTypes.object.isRequired
}

export default Post
