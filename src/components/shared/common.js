import styled from 'styled-components'
import { Link } from 'phenomic'

export const Article = styled.article`
  margin-bottom: 8rem;
  border-bottom: 1px solid #dddddd;
`
export const PostDescription = styled.p`
  color: #787878;
  margin-bottom: .75rem;
`
export const MoreLink = styled(Link)`
  text-transform: uppercase;
  font-size: .8em;
`
export const Body = styled.div`
  & p {
    color: #787878;
  }
  & a {
    color: #007acc;
    transition: all 0.2s;
    text-decoration: none;
    border-bottom: 1px solid transparent;

    &:hover {
      color: #006bb3;
      border-bottom-color: #007acc;
    }
  }

  & img {
    max-width: 100%;
    height: auto;
  }
`
