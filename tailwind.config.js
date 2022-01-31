const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/remark.ts',
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      display: 'Montserrat, sans-serif',
      body: 'Georgia, Cambria, serif',
    },
    extend: {
      typography: (theme) => ({
        lg: {
          css: {
            blockquote: {
              paddingLeft: null,
            },
            pre: {
              paddingTop: null,
              paddingBottom: null,
              paddingLeft: null,
              paddingRight: null,
            },
          },
        },
        DEFAULT: {
          css: {
            color: null,
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.red.500'),
              fontFamily: theme('fontFamily.display'),
            },
            pre: {
              paddingTop: null,
              paddingBottom: null,
              paddingLeft: null,
              paddingRight: null,
            },
            code: {
              fontStyle: 'normal',
              fontWeight: 'normal',
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            blockquote: null,
            'blockquote p': {
              margin: '0 !important',
            },
            'figure figcaption': {
              color: null,
            },
            summary: {
              cursor: 'pointer',
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
