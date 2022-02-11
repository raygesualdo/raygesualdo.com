import slugify from 'slugify'
import assert from 'assert'

const stringToConvert = process.argv[2]

assert(!!stringToConvert, 'A string must be provided for conversion')

console.log()
console.log(slugify(stringToConvert, { lower: true, strict: true }))
console.log()
