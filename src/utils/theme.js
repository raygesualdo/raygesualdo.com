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
}

export const lightTheme = {
  bodyBgColor: colors.white,
  textColor: colors.black,
  linkColor: colors.blueLight,
  headerColor: colors.red,
  topBarBgColor: colors.blue,
  topBarColor: colors.white,
  codeBgColor: colors.grayLight,
  codeColor: colors.red,
  footerColor: colors.blueGray,
  blockQuoteColor: 'hsla(0,0%,0%,0.03)',
}

export const darkTheme = {
  bodyBgColor: colors.blueDark,
  textColor: colors.gray,
  linkColor: colors.blueLighter,
  headerColor: colors.red,
  topBarBgColor: colors.blue,
  topBarColor: colors.white,
  codeBgColor: colors.grayLight,
  codeColor: colors.red,
  footerColor: colors.blueGray,
  blockQuoteColor: 'hsla(0, 0%, 100%, 0.97)',
}

export const theme = lightTheme
