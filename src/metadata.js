import pkg from '../package.json'
import talks from './talks.json'

const menu = new Map([
  [1, {url: '/about', title: 'About'}],
  [2, {url: '/talks', title: 'Talks'}],
  [3, {url: '/feed.xml', title: 'Feed', props: {target: '_blank'}}]
  // [4, {url: '/categories', title: 'Categories'}]
])

export default {
  pkg,
  menu,
  talks
}
