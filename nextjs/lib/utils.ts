// Adapted from https://github.com/lodash/lodash/issues/2339
export const intersperse = <T>(arr: T[], separator: (n: number) => T): T[] =>
  arr.flatMap((a, i) => (i > 0 ? [separator(i - 1), a] : [a]))
