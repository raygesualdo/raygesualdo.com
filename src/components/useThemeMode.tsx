import React, { createContext, useContext } from 'react'
import { useLocalStorage, useMedia } from 'react-use'

export type ThemeMode = 'light' | 'dark'

const ThemeToggleContext = createContext<{
  mode: ThemeMode
  toggleMode: () => void
}>(null)

const { Provider } = ThemeToggleContext

export const useThemeMode = () => {
  const context = useContext(ThemeToggleContext)
  if (!context)
    throw new Error('useThemeMode must be used with a ThemeModeProvider')
  return [context.mode, context.toggleMode]
}

export const ThemeModeProvider = ({ children }) => {
  const isBrowserDarkMode = useMedia('(prefers-color-scheme: dark)')
  const [mode, setMode] = useLocalStorage<ThemeMode>(
    'themeMode',
    isBrowserDarkMode ? 'dark' : 'light'
  )

  const toggleMode = () => setMode(mode === 'light' ? 'dark' : 'light')

  return <Provider value={{ mode, toggleMode }}>{children}</Provider>
}
