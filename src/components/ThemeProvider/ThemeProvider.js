import React, { createContext, useContext } from 'react'
import { ThemeProvider } from 'styled-components'
import { useLocalStorage } from 'react-use'
import { lightTheme, darkTheme } from '../../utils/theme'

export const ThemeToggleContext = createContext({})

export const useThemeToggle = () => {
  const { mode, toggleMode } = useContext(ThemeToggleContext)
  return [mode, toggleMode]
}

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useLocalStorage('themeMode', 'light')

  const toggleMode = () =>
    setMode(mode => (mode === 'light' ? 'dark' : 'light'))
  const theme = mode === 'light' ? lightTheme : darkTheme

  return (
    <ThemeToggleContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeToggleContext.Provider>
  )
}
