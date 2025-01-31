---
title: 'Optimizing Jest Runs with Dynamic Roots'
date: 2024-02-10
category: code
hero:
  credit: https://unsplash.com/photos/brown-tree-trunk-with-green-moss-MskbR8VLNrA
  image: ../../assets/hero/jest-dynamic-roots.jpg
  alt: Tree roots
tags:
  - Jest
  - JavaScript
---

At Salesloft, our primary frontend application has nearly 3,000 test suites containing over 20,000 tests. That's a lot of time spent running tests in CI and the opportunity was ripe for optimization. We were already using Jest's `--shard` CLI argument to run tests across a number of runners in GitHub actions. Moving to multiple runners a few years ago sped things up significantly. In fact, we wrote own sharding script before it was built in to Jest. But given we were now in a monorepo setup using PNPM, we knew we could be more efficient with our CI runs.

## Limiting scope

In a monorepo, we don't need to run tests for everything. We only need to run tests for packages that have changed plus their dependents. Thankfully, PNPM makes determining this very easy[^1]. Its `--filter` flag allows filtering packages based on changes between the HEAD and a given git ref. This filtering can include dependent packages as well. By limiting the scope to specific packages, we can be much more intelligent about what tests we run.

Let's take a moment to talk about our monorepo structure. If you were to peak inside our `pnpm-workspace.yaml` file, it would look something like this:

```yaml
packages:
  - 'apps/*'
  - 'infrastructure/*'
  - 'platform/packages/*'
  - 'shared/*'
```

Apps are organized as packages in the `apps/` directory. `infrastructure/` holds all the packages needed to run, build, test, lint, format, and ship the repo. The scripts we'll be looking at below are in an infrastructure package. `platform/packages/` and `shared/` contain shared code teams can use when building out their apps. In typical monorepo fashion, each package manages its own dependencies[^2] and many of these package depend on others from within the monorepo.

So, for example, a PR may make changes to only `apps/accounts`. In this case, because nothing depends on `apps/accounts`, we should only run the tests for `apps/accounts`. Conversely, if we make a change to `platform/packages/permissions`, we will need to run tests for many other packages because so many depend on the permissions package.

## Alternatives

You may be wondering "Ray, why doesn't each app have it's own `test` script that you run with something like Rush, Lerna, or Turborepo?" That's a legitimate question. For our situation, it makes more sense to keep all tests under a single Jest instance for a number of reasons:

1. Sharding is much easier when all tests are running under a single Jest instance. If each package had its own `test` script, we would either have to add a significant amount of complexity to get package-level sharding working across runners in GitHub actions or be locked in to a monorepo manager that supports it out-of-the-box. We've been very happy with vanilla PNPM as our monorepo manager and don't want to change that.
2. We keep our testing infrastructure very regulated. Every package is on the same version of Jest, uses the same setup file, etc. This regulation would require more management overhead if we specified a `test` script for each package.

One option we do want to explore is the use of `projects` with Jest. They're not incredibly well documented, but we think they may give us the right balance of centralized management while also decentralizing some configuration we want to give individual teams for their test runs. For now, our current approach serves us well and allows for high levels of optimization.

## Making it happen

Configuring Jest to limit its scope turned out to be fairly straightforward. It has a `roots` option to define the root directories in which Jest should look for tests. We can pass in an array of paths that point just to the packages that have changed. In our `jest.config.js`, you'd find this line:

```js
module.exports = {
  roots: getRoots(),
  // ...
}
```

`getRoots` comes from another script, which I've included here in its entirety. Below, we'll break it down section by section to see how it works.

```js
const { execSync } = require('node:child_process')
const { resolve } = require('node:path')
const c = require('ansi-colors')

const resolveFromRoot = (path) => resolve(__dirname, '../../', path)
const IS_CI = process.env.CI
const IS_PR = process.env.GITHUB_EVENT_NAME === 'pull_request'
const ROOTS_ALWAYS_INCLUDED = [resolveFromRoot('platform/mocks')]
const DEFAULT_ROOTS = [
  resolveFromRoot('apps'),
  resolveFromRoot('platform/packages'),
  resolveFromRoot('shared'),
  ...ROOTS_ALWAYS_INCLUDED,
]
const PACKAGES_FORCING_ALL_TESTS = ['@infrastructure/jest']

const log = {
  green: (msg) => console.log(c.green(msg)),
  red: (msg) => console.error(c.red(msg)),
}

function getRoots() {
  log.green('Determining which tests to run.')
  try {
    if (!IS_CI) {
      log.green('↳ Not in a CI context. Running all tests.')
      return DEFAULT_ROOTS
    }

    const gitRef = IS_PR ? `origin/${process.env.GITHUB_BASE_REF}` : getLastMergeCommit()

    log.green(`↳ Event: ${IS_PR ? 'pull request' : 'merge commit'}`)
    log.green(`↳ Getting packages changed from ${gitRef}.`)

    const packages = getChangedPackages(gitRef)

    if (packages.some((pkg) => PACKAGES_FORCING_ALL_TESTS.includes(pkg.name))) {
      log.green(
        `↳ Changed packages includes one of: ${PACKAGES_FORCING_ALL_TESTS.join(
          ','
        )}. Running all tests.`
      )
      return DEFAULT_ROOTS
    }

    const roots = getFilteredPackagePaths(packages)

    if (!roots.length) {
      log.green('↳ No changed packages. Skipping tests.')
      return []
    }

    log.green('↳ Running tests against the following directories:')
    console.log(roots.map((root) => `    - ${root}`).join('\n'))

    return [...roots, ...ROOTS_ALWAYS_INCLUDED]
  } catch (error) {
    log.red('!!! ERROR !!!')
    console.error(error)
    process.exit(1)
  } finally {
    console.log()
  }
}

function getFilteredPackagePaths(packages) {
  return packages
    .filter((pkg) => {
      return !pkg.name.startsWith('@infrastructure')
    })
    .map((pkg) => pkg.path)
}

function getLastMergeCommit() {
  return execSync(`git log --merges -n 1 HEAD~1 --format=format:%H`, {
    encoding: 'utf-8',
  }).trim()
}

function getChangedPackages(gitRef) {
  const output = execSync(`pnpm --filter "...[${gitRef}]" ls --json`, {
    encoding: 'utf-8',
    cwd: resolveFromRoot('.'),
  })
  return JSON.parse(output || '[]')
}

module.exports.getRoots = getRoots
```

A few overarching things to note:

- We've added extra logging at every step in the process. Both locally and in CI, this gives us good visibility into why and what is happening.
- The script is tied to GitHub Actions environment variables (`process.env.GITHUB_EVENT_NAME`, `process.env.GITHUB_BASE_REF`), but these parts could be easily swapped out for another CI provider.
- Our whole script is wrapped in a `try/catch` and we clearly surface underlying error messages if things go sideways.

Now, let's start with the constants at the top of the file.

```js
const IS_CI = process.env.CI
const IS_PR = process.env.GITHUB_EVENT_NAME === 'pull_request'
const ROOTS_ALWAYS_INCLUDED = [resolveFromRoot('platform/mocks')]
const DEFAULT_ROOTS = [
  resolveFromRoot('apps'),
  resolveFromRoot('platform/packages'),
  resolveFromRoot('shared'),
  ...ROOTS_ALWAYS_INCLUDED,
]
const PACKAGES_FORCING_ALL_TESTS = ['@infrastructure/jest']
```

First, we determine if we're running in a CI environment and if we're working with a pull request. Next up, we keep mocks for certain platform packages in the `platform/mocks` directory so regardless of which test suites we're running, we always want those mocks included in the list of roots. We also have a list of default roots for when every test needs to be run. These roots encompass all our workspace packages. Lastly, there are certain packages that should trigger a full test run if they are changed. Currently, only the Jest package is in that list. If we change anything with our testing infrastructure, we want to run all tests to make sure we haven't unintentionally broken anything.

The next thing we do is check to see if we're running in CI:

```js
if (!IS_CI) {
  log.green('↳ Not in a CI context. Running all tests.')
  return DEFAULT_ROOTS
}
```

If we're running Jest locally, we don't want to limit the roots at all. We want engineers to run Jest as they normally would, perhaps invoking watch mode or providing the path to a specific test file they need to run. By passing `DEFAULT_ROOTS` when running locally, all of these typical Jest use-cases still work as they should.

The next piece of information we need is which git ref to compare against to find packages that have changed.

```js
const gitRef = IS_PR ? `origin/${process.env.GITHUB_BASE_REF}` : getLastMergeCommit()
```

When we're working with a pull request, GitHub already provides the base ref we're merging into. We can use the value directly in that case. If we're running via an actual merge commit (i.e. when we've merged the pull request), we need to do more work to determine the last merge commit.

```js
function getLastMergeCommit() {
  return execSync(`git log --merges -n 1 HEAD~1 --format=format:%H`, {
    encoding: 'utf-8',
  }).trim()
}
```

The `getLastMergeCommit` function invokes `git log` looking for the first merge commit (`--merges -n 1`) prior to the current HEAD commit (`HEAD~1`) and returns the full git SHA `--format=format:%H`. With our `gitRef` in hand, we can now get which packages have changed.

```js
const packages = getChangedPackages(gitRef)

function getChangedPackages(gitRef) {
  const output = execSync(`pnpm --filter "...[${gitRef}]" ls --json`, {
    encoding: 'utf-8',
    cwd: resolveFromRoot('.'),
  })
  return JSON.parse(output || '[]')
}
```

`getChangedPackages` invokes `pnpm ls` to list out repo packages. It uses the `--filter "...[GIT_REF]"` syntax which is [built into PNPM](https://pnpm.io/filtering#--filter-since) to find any packages changed since the given `GIT_REF` plus their dependents. We use the `--json` flag to output JSON from PNPM and `JSON.parse` to parse the output back into a JavaScript array.

If any of the changed packages are in `PACKAGES_FORCING_ALL_TESTS`, we log the result and return `DEFAULT_ROOTS`:

```js
if (packages.some((pkg) => PACKAGES_FORCING_ALL_TESTS.includes(pkg.name))) {
  log.green(
    `↳ Changed packages includes one of: ${PACKAGES_FORCING_ALL_TESTS.join(
      ','
    )}. Running all tests.`
  )
  return DEFAULT_ROOTS
}
```

Then, we further filter down the list to remove any packages from the `infrastructure` directories as these packages are tested outside of Jest. We also get the absolute paths to each package from the PNPM JSON output.

```js
const roots = getFilteredPackagePaths(packages)

function getFilteredPackagePaths(packages) {
  return packages
    .filter((pkg) => {
      return !pkg.name.startsWith('@infrastructure')
    })
    .map((pkg) => pkg.path)
}
```

At this point, if there aren't any `roots` left (e.g. we made a change to the README.md file at the repo root), we return an empty array.

```js
if (!roots.length) {
  log.green('↳ No changed packages. Skipping tests.')
  return []
}
```

Otherwise, we log out the roots we're running tests in and return the list along with the path to our mocks directory.

```js
log.green('↳ Running tests against the following directories:')
console.log(roots.map((root) => `    - ${root}`).join('\n'))

return [...roots, ...ROOTS_ALWAYS_INCLUDED]
```

The returned array is what is finally passed in to Jest's `roots` configuration.

## Conclusion

And there is it! Using dynamic roots with Jest has drastically improved our CI runtimes. It saves us 10s of 1000s of CI run minutes per month! Very little I've shared here is specific to our setup though. If you're running Jest in a PNPM monorepo, you can do all of this as well. And I hope you do. Please reach out to me on [Twitter](https://twitter.com/RayGesualdo) or [LinkedIn](https://www.linkedin.com/in/raygesualdo) if you'd like to discuss it further.

[^1]: NPM and Yarn may have built-in utilities for this as well, but I haven't checked recently. Either way, with a little `git` work, one could probably emulate this feature without too much code.
[^2]: To a point. We do lock certain dependencies down to specific versions. And all parts of the app use the same build/test/lint infrastructure which is maintained by a single team.
