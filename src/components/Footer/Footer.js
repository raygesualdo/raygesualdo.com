import React from 'react'
import { FooterLayout, LinkButton } from './styles'
import { useThemeToggle } from '../ThemeProvider/ThemeProvider'

const Footer = () => {
  const [, toggleMode] = useThemeToggle()
  return (
    <FooterLayout>
      Copyright © Ray Gesualdo {new Date().getFullYear()} |{' '}
      <a href="https://github.com/raygesualdo/raygesualdo.com">
        View source code
      </a>{' '}
      |{' '}
      <LinkButton
        onClick={(e) => {
          e.preventDefault()
          toggleMode()
        }}
      >
        Toggle theme
      </LinkButton>
    </FooterLayout>
  )
}

export default Footer
