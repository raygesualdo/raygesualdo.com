import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { Menu, MenuItem, MenuLink } from './Header.styles'

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

interface MenuItem {
  props?: Record<string, any>
  title: string
  url: string
}

export const MenuSection = () => {
  const {
    settings: { menus },
  } = useStaticQuery(query)
  return (
    <Menu role="navigation">
      {menus.header.map((item: MenuItem) => (
        <MenuItem key={item.url}>
          <MenuLink to={item.url} title={item.title} {...item.props}>
            {item.title}
          </MenuLink>
        </MenuItem>
      ))}
    </Menu>
  )
}
