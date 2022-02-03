import * as fs from 'fs'
import * as path from 'path'
// Included the file extension here to fix weird bug with `tsm`
import memo from 'lodash/memoize.js'
import yaml from 'js-yaml'

export type Category = {
  name: string
  slug: string
}

export const CATEGORIES_YAML_PATH = path.join(
  process.cwd(),
  'content/categories.yml'
)

export const getCategories = memo(() => {
  const contents = fs.readFileSync(CATEGORIES_YAML_PATH, 'utf-8')
  return yaml.load(contents) as Category[]
})

export const getCategoryBySlug = (slug: string) => {
  const categories = getCategories()
  return categories.find((category) => category.slug === slug)
}
