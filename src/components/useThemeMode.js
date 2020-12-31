import React, { createContext, useContext } from 'react'
import { useLocalStorage, useMedia } from 'react-use'

const ThemeToggleContext = createContext({})

export const useThemeMode = () => {
  const context = useContext(ThemeToggleContext)
  if (!context)
    throw new Error('useThemeMode must be used with a ThemeModeProvider')
  return [context.mode, context.toggleMode]
}

export const ThemeModeProvider = ({ children }) => {
  const isBrowserDarkMode = useMedia('(prefers-color-scheme: dark)')
  const [mode, setMode] = useLocalStorage(
    'themeMode',
    isBrowserDarkMode ? 'dark' : 'light'
  )

  const toggleMode = () =>
    setMode(mode === 'light' ? 'dark' : 'light')
  
  return (
    <ThemeToggleContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeToggleContext.Provider>
  )
}
