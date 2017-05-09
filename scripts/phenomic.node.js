const phenomicStatic = require('phenomic/lib/static').default

const metadata = require('../src/metadata.js').default
const routes = require('../src/routes.js').default
const store = require('../src/store.js').default

module.exports = (options) =>
  phenomicStatic({ ...options, metadata, routes, store })
