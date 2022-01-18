/**
 * @type {import('next').NextConfig}
 **/
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    deviceSizes: [320, 480, 720],
  },
  env: {
    domain: getCurrentDomain(),
  },
}

function getCurrentDomain() {
  if (process.env.NETLIFY) {
    if (process.env.BRANCH !== 'master') {
      return process.env.DEPLOY_PRIME_URL
    }
    return process.env.URL
  }
  return 'http://localhost:3000'
}
