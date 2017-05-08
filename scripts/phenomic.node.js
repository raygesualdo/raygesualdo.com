const phenomicStatic = require('phenomic/lib/static').default

const metadata = require('../src/metadata.js')
const routes = require('../src/routes.js')
const store = require('../src/store.js')

module.exports = (options) =>
  phenomicStatic({ ...options, metadata, routes, store })
