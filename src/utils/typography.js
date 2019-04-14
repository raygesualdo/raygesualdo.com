import Typography from 'typography'
import SternGrove from 'typography-theme-stern-grove'
import { theme } from './theme'

const typography = new Typography({
  ...SternGrove,
  headerColor: theme.headerColor,
  overrideThemeStyles: (vr, options, styles) => ({
    body: {
      color: null,
    },
    a: {
      color: null,
      textDecoration: 'underline',
    },
    code: {
      lineHeight: vr.rhythm(3 / 4),
    },
  }),
})

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

const { rhythm, scale, options } = typography

export { rhythm, scale, options, typography as default }
