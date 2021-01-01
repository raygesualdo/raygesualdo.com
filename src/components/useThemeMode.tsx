import React, { createContext, useContext } from 'react'
import { useLocalStorage, useMedia } from 'react-use'

export type ThemeMode = 'light' | 'dark'

interface ThemeToggleContext {
  mode: ThemeMode
  toggleMode: () => void
}

const ThemeToggleContext = createContext<ThemeToggleContext>(
  {} as ThemeToggleContext
)

const { Provider } = ThemeToggleContext

export const useThemeMode = () => {
  const context = useContext(ThemeToggleContext)
  if (!context?.mode)
    throw new Error('useThemeMode must be used with a ThemeModeProvider')
  return [context.mode, context.toggleMode] as const
}

export const ThemeModeProvider: React.FunctionComponent = ({ children }) => {
  const isBrowserDarkMode = useMedia('(prefers-color-scheme: dark)')
  const [mode, setMode] = useLocalStorage<ThemeMode>(
    'themeMode',
    isBrowserDarkMode ? 'dark' : 'light'
  )

  const toggleMode = () => setMode(mode === 'light' ? 'dark' : 'light')

  return <Provider value={{ mode: mode!, toggleMode }}>{children}</Provider>
}
