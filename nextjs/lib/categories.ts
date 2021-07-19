import * as fs from 'fs'
import memo from 'lodash/memoize'
import yaml from 'js-yaml'
import { CATEGORIES_YAML_PATH } from './posts'

export type Category = {
  name: string
  slug: string
}

export const getCategories = memo(() => {
  const contents = fs.readFileSync(CATEGORIES_YAML_PATH, 'utf-8')
  return yaml.load(contents) as Category[]
})

export const getCategoryBySlug = (slug: string) => {
  const categories = getCategories()
  return categories.find((category) => category.slug === slug)
}
