import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      display: 'Montserrat, sans-serif',
      body: 'Georgia, Cambria, serif',
    },
    extend: {
      colors: {
        'surface-dark': '#070a13',
      },
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
            '.footnotes h2': {
              marginBlockStart: theme('space.4'),
              marginBlockEnd: `-${theme('space.4')}`,
              fontSize: theme('fontSize.2xl[0]'),
              ...theme('fontSize.2xl[1]'),
            },
          },
        },
        DEFAULT: {
          css: {
            color: null,
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.red.500'),
              fontFamily: theme('fontFamily.display'),
              fontWeight: 'inherit',
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
  plugins: [typography],
}
