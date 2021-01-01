export interface Theme {
  bodyBgColor: string
  textColor: string
  linkColor: string
  headerColor: string
  topBarBgColor: string
  topBarColor: string
  codeBgColor: string
  codeColor: string
  footerColor: string
  blockquoteBgColor: string
  blockquoteBorderColor: string
  codeTagBgColor: string
  codeTagColor: string
}

const colors = {
  white: '#fff',
  grayDarkest: '#b2b2b2',
  grayDark: '#cecece',
  gray: '#e5e5e5',
  grayLight: '#eee',
  grayLightest: '#f5f5f5',
  red: 'hsl(5, 86%, 53%)',
  blueGray: 'hsl(206, 15%, 43%)',
  blueLighter: 'hsla(206, 86%, 67%, 1)',
  blueLight: 'hsla(206, 86%, 47%, 1)',
  blue: '#062f4f',
  blueDark: 'hsla(206, 86%, 5%, 1)',
  black: '#111',
}

export const lightTheme: Theme = {
  bodyBgColor: colors.white,
  textColor: colors.black,
  linkColor: colors.blueLight,
  headerColor: colors.red,
  topBarBgColor: colors.blue,
  topBarColor: colors.white,
  codeBgColor: colors.grayLight,
  codeColor: colors.blue,
  footerColor: colors.blueGray,
  blockquoteBgColor: 'hsla(0,0%,0%,0.03)',
  blockquoteBorderColor: colors.blue,
  codeTagBgColor: colors.gray,
  codeTagColor: colors.black,
}

export const darkTheme: Theme = {
  bodyBgColor: colors.blueDark,
  textColor: colors.gray,
  linkColor: colors.blueLighter,
  headerColor: colors.red,
  topBarBgColor: colors.blue,
  topBarColor: colors.white,
  codeBgColor: colors.grayLight,
  codeColor: colors.blue,
  footerColor: colors.blueGray,
  blockquoteBgColor: 'hsla(0, 0%, 100%, 0.2)',
  blockquoteBorderColor: colors.blueLight,
  codeTagBgColor: colors.gray,
  codeTagColor: colors.black,
}

export const theme = lightTheme
