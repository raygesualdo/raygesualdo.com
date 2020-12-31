import React from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { useThemeMode } from '../useThemeMode'
import { lightTheme, darkTheme } from '../../utils/theme'

export const ThemeProvider = ({ children }) => {
  const [mode] = useThemeMode()
  const theme = mode === 'light' ? lightTheme : darkTheme

  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
}
