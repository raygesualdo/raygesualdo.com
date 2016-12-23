import pkg from '../package.json'

const menu = new Map([
  [1, {url: '/about', title: 'About'}],
  [2, {url: '/feed.xml', title: 'Feed', props: {target: '_blank'}}]
  // [3, {url: '/series', title: 'Series'}],
  // [4, {url: '/categories', title: 'Categories'}]
])

export default {
  pkg,
  menu
}
