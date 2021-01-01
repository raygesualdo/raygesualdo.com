import React from 'react'
import { FooterLayout, LinkButton } from './Footer.styles'
import { useThemeMode } from '../useThemeMode'

const Footer = () => {
  const [, toggleMode] = useThemeMode()
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
