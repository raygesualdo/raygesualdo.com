const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/remark.ts',
  ],
  darkMode: false, // or 'media' or 'class'
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
          },
        },
        DEFAULT: {
          css: {
            color: theme('colors.gray.900'),
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.red.500'),
              fontFamily: theme('fontFamily.display'),
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
          },
        },
      }),
      colors: {
        blueGray: colors.blueGray,
        blue: colors.sky,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
