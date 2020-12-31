import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { Menu, MenuItem, MenuLink } from './styles'

const query = graphql`
  {
    settings: siteSettings {
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

export const MenuSection = () => {
  const {
    settings: { menus },
  } = useStaticQuery(query)
  return (
    <Menu role="navigation">
      {menus.header.map((item) => (
        <MenuItem key={item.url}>
          <MenuLink to={item.url} title={item.title} {...item.props}>
            {item.title}
          </MenuLink>
        </MenuItem>
      ))}
    </Menu>
  )
}
