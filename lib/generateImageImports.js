const { resolve, relative } = require('path')
const { readdir } = require('fs').promises
const { writeFileSync } = require('fs')

async function getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = resolve(dir, dirent.name)
      return dirent.isDirectory() ? getFiles(res) : res
    })
  )
  return files.flat()
}

function base(path) {
  return relative(resolve(__dirname, '../public'), path)
}

function importName(path) {
  return base(path).replace(/\W(\w)/g, (match, char) => {
    return char.toUpperCase()
  })
}

function relativePath(path) {
  return relative(__dirname, path)
}

const generateImport = (filepath) =>
  `import ${importName(filepath)} from '${relativePath(filepath)}'`

const generateObjectEntry = (filepath) =>
  `  '/${base(filepath)}': ${importName(filepath)},`

getFiles(resolve(__dirname, '../public/posts')).then((files) => {
  const file = `
${files.map(generateImport).join('\n')}
  
export const exportMap = {
${files.map(generateObjectEntry).join('\n')}
}
  `
  writeFileSync(resolve(__dirname, 'staticImages.ts'), file, 'utf-8')
})
