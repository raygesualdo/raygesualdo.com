import Typography from 'typography'
import SternGrove from 'typography-theme-stern-grove'

const typography = new Typography({
  ...SternGrove,
  headerColor: '#e32',
  overrideThemeStyles: (vr, options, styles) => ({
    a: {
      textDecoration: 'underline',
    },
  }),
})

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

const { rhythm, scale, options } = typography

export { rhythm, scale, options, typography as default }
