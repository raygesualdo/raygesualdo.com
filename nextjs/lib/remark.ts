import parseMarkdown from 'remark-parse'
import githubFlavoredMarkdown from 'remark-gfm'

export const COMMON_PLUGINS = [parseMarkdown, githubFlavoredMarkdown]
