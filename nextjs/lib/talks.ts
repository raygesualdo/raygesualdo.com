import * as fs from 'fs'
import * as path from 'path'
import memo from 'lodash/memoize'
import yaml from 'js-yaml'

export type Talk = {
  title: string
  abstract: string
  events: {
    title: string
    video?: string
    slides?: string
    code?: string
  }[]
}

export const TALKS_YAML_PATH = path.join(process.cwd(), 'content/talks.yml')

export const getTalks = memo(() => {
  const contents = fs.readFileSync(TALKS_YAML_PATH, 'utf-8')
  return yaml.load(contents) as Talk[]
})
