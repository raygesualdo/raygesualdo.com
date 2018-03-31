---
title: 301 Redirects with Next.js
date: 2017-05-09
---

Last week, 3blades - the company I work for - launched our new website using [Next.js](https://github.com/zeit/next.js)/[Now](https://github.com/zeit/now-cli). In the process, we moved our company blog from our main website to a Medium site. Consequently, we had a block of 301 redirects from `3blades.io/blog` to `blog.3blades.io`. I looked through the Next.js documentation and googled around, but I couldn't find any 301 redirect examples. Since Next.js let's you use any custom server you want, I figured I could hand-wire it using Express. There's an [Express example site](https://github.com/zeit/next.js/tree/master/examples/custom-server-express) in the Next.js repo I used for reference.

First, I installed `express` and created a `server.js` file with the following code (essentially the one from the example with extraneous parts removed):

```javascript
const express = require('express')
const next = require('next')
const { join } = require('path')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, err => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
```

This got the site working in the exact same way as running `next`. I put the redirects in an array of objects, with each redirect having a `from` and `to` key:

```javascript
const redirects = [
  { from: '/old-link-1', to: '/new-link-1' },
  { from: '/old-link-2', to: 'https://externalsite.com/new-link-2' },
]
```

Then, inside `app.prepare()`, I iterated over the redirects, adding a handler for each onto the express instance `server`.

```javascript
redirects.forEach(({ from, to, type = 301, method = 'get' }) => {
  server[method](from, (req, res) => {
    res.redirect(type, to)
  })
})
```

`redirect.from` is used as the handler path and `redirect.to` is passed to `res.redirect`. Each redirect can optionally define the HTTP method (GET, POST, etc.) and response code (301, 302).

I've included the full `server.js` code below:

```javascript
const express = require('express')
const next = require('next')
const { join } = require('path')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const redirects = [
  { from: '/old-link-1', to: '/new-link-1' },
  { from: '/old-link-2', to: 'https://externalsite.com/new-link-2' },
]

app.prepare().then(() => {
  const server = express()

  redirects.forEach(({ from, to, type = 301, method = 'get' }) => {
    server[method](from, (req, res) => {
      res.redirect(type, to)
    })
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(3000, err => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
```

Lastly, I edited `dev` and `start` scripts in `package.json` to the new configuration:

```javascript
{
  "dev": "node server.js",
  "start": "NODE_ENV=production node server.js"
}
```

With that, the 301 redirects are all set up. This code is running in production for us beautifully. Hope the walkthrough was helpful!

NOTE: The 3blades website is entirely open-sourced, so you can check out the [source code](https://github.com/3Blades/www-site).
