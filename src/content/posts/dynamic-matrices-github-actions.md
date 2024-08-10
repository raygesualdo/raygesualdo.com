---
title: 'Dynamic Matrices in GitHub Actions: Streamlining Our Jest Runs'
date: 2024-02-24
category: code
hero:
  credit: https://unsplash.com/photos/black-and-white-checkered-illustration-iBG594vhR1k
  image: ../../assets/hero/gha-dynamic-matrices.jpg
  alt: Many-squared architecture.
---

We had a problem: our test runs in CI were too slow. This was in our primary frontend application at Salesloft, a codebase nearing one million lines of code. Granted, considering how large the codebase is, the test runs weren't too bad. Worst case scenario they would take about 10 minutes wall clock time[^1], but we knew there was room for improvement because our billable time was still quite high. What follows is our adventures streamling our Jest runs by making our GitHub actions job matrix dynamic.

_The following solution was implemented with Jest because it supports sharding and fully utilizes multi-core machines out-of-the-box. However, any test runner that does the same will benefit from this approach._

## Where we started

We use [GitHub actions](https://docs.github.com/en/actions) for continuous integration at Salesloft. As I wrote a few weeks ago, we were already limiting CI test runs to [packages that had changed in our monorepo](./jest-dynamic-roots). The next few sections build on code from that post, so I do recommend giving it a readthrough before continuing.

<details>
<summary>Our Monorepo Structure</summary>

To recap from the previous blog post, our `pnpm-workspace.yaml` file looks something like this:

```yaml
packages:
  - 'apps/*'
  - 'infrastructure/*'
  - 'platform/packages/*'
  - 'shared/*'
```

Apps are organized as packages in the `apps/` directory. `infrastructure/` holds all the packages needed to run, build, test, lint, format, and ship the repo. The scripts we'll be looking at below are in an infrastructure package. `platform/packages/` and `shared/` contain shared code teams can use when building out their apps. In typical monorepo fashion, each package manages its own dependencies and many of these package depend on others from within the monorepo.

</details>

Here is the snippet of GitHub actions workflow file that ran our Jest tests:

```yml
tests:
  name: Tests (${{ matrix.ci_node_index }} of ${{ matrix.ci_node_total }})
  runs-on: ubuntu-latest
  strategy:
    fail-fast: false
    matrix:
      ci_node_index: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
      ci_node_total: [16]

  steps:
    - name: Check out code
      uses: actions/checkout@v4
      with:
        fetch-depth: 0
        filter: 'tree:0'

    - name: Setup
      uses: ./.github/actions/setup

    - name: Run tests
      run: pnpm test --shard=${{ matrix.ci_node_index }}/${{ matrix.ci_node_total }}
```

The important thing to note here is that we're hard-coding a matrix for the CI nodes we want to run. Matrices in GitHub actions allow you to run multiple versions of the same job with different arguments each time. In this case, the value for `ci_node_total` never changes. It's always `16`. But because there are sixteen values for `ci_node_index`, GitHub will run this job sixteen times[^2].

There are problems with this approach though:

1. We're having to check out the entire repo for each of these jobs. This takes a significant (relative) amount of time with our repo having grown so much in the last few years. We need the full git history (as opposed to a shallow clone) because PNPM uses git under the hood to determine which packages have changed. This has gotten significantly better now that the checkout action supports [partial cloning](https://github.blog/2020-12-21-get-up-to-speed-with-partial-clone-and-shallow-clone/) but not having to do full checkouts for each Jest job would speed up the process.
2. Our setup code – encapsulated in a composite action at `.github/actions/setup` in our repo – is not particularly fast. Depending on how many tests we're running, the setup code can range from 5% to 50% of the overall runtime. It's in these latter cases particularly where having fewer runners handling more tests would result in better efficiency.
3. We were overprovisioning runners in most cases. We rarely run all tests in our repo. The majority of PRs run 5% to 25% of our tests. We don't need sixteen runners in those cases.

## Making it dynamic

Instead of hard-coding our matrix, we want the number of jobs run to be dynamically allocated for each CI run based on how many tests files need to be processed. This means we need to split the logic for running our tests into two parts: an orchestrator and runners. The orchestrator is responsible for cloning the entire repository, determining which packages have changed, counting the resulting number of test files, and passing those values out to the runners. The runners are only concerned with running the tests handed to them.

Here's what the GitHub workflow looks like for the orchestrator:

```yml
tests-orchestrator:
  name: Test Orchestrator
  runs-on: ubuntu-latest
  outputs:
    matrix: ${{ steps.determine.outputs.matrix }}
    roots: ${{ steps.determine.outputs.roots }}
  steps:
    - name: Check out code
      uses: actions/checkout@v4
      with:
        fetch-depth: 0
        filter: 'tree:0'

    - name: Setup
      uses: ./.github/actions/setup

    - name: Determine test matrix
      id: determine
      run: node ./infrastructure/jest/determineTestMatrix.js
```

The `outputs` section allows us to pass outputs from a specific step to other jobs that depend on `test-orchestration`. We will use this when we configure the runners. The rest of this job looks like our old `tests` job except for the last step. We run the `determineTestMatrix.js` file instead of running Jest directly. Let's dig into the JavaScript file to see what it's doing.

```js
const { execSync } = require('node:child_process')
const { resolve } = require('node:path')
const core = require('@actions/core')
const { getRoots } = require('./getRoots')

const resolveRelative = (path) => resolve(__dirname, path)
const __root = resolve(__dirname, '../../')

const roots = getRoots()

const jestBin = resolveRelative('./node_modules/.bin/jest')
const testFilesCount = execSync(
  [jestBin, '--config', resolveRelative('./jest.config.js'), '--listTests'].join(' '),
  { cwd: __root, encoding: 'utf-8' }
)
  .split('\n')
  .filter((line) => line.startsWith('/')).length
const numberOfRunners = Math.min(Math.ceil(testFilesCount / 200), 24)
const matrix = {
  ci_node_index: Array.from(range(1, numberOfRunners)),
  ci_node_total: [numberOfRunners],
}

core.setOutput('matrix', JSON.stringify(matrix))
core.setOutput('roots', JSON.stringify(roots))
core.setOutput('numberOfTests', String(testFilesCount))

/** Generator that creates an inclusive range */
function* range(start, end) {
  let iteration = 0
  while (true) {
    if (start + iteration > end) return
    yield start + iteration
    iteration += 1
  }
}
```

There's a few things going on here, so let's break it down. The first thing we do (after imports and a few utility functions) is call `getRoots` to determine which packages have changed (again, see [my previous post](./jest-dynamic-roots) for more details). Next, we run Jest with the `--listTests` flags to list out all the tests files we need to execute. It is using `getRoots` internally so the tests it returns will always be inside the directories listed in `roots`. Then, we calculate how many runners we need, dividing the number of tests by 200 and maxing out at 24 runners. The result of this math is `numberOfRunners`. We create an array from `1` to `numberOfRunners` for `matrix.ci_node_index` and set `matrix.ci_node_total` to an array with `numberOfRunners` as the sole value. If you squint, you'll notice that the shape of `matrix` matches the shape of the hard-coded job matrix we used to have in our workflow! Lastly, we stringify the JSON values and pass them out of the step via `core.setOutput`[^3]. This script's job is done. Time for the runners to take over.

Interestingly, the runners need very little customization compared to their prior setup. We'll be running the exact same steps as we did with the hard-coded matrix. The primary difference this time is how we're defining `matrix`:

```yaml
tests:
  needs: [tests-orchestrator]
  name: Tests (${{ matrix.ci_node_index }} of ${{ matrix.ci_node_total }})
  strategy:
    fail-fast: false
    matrix: ${{ fromJSON(needs.tests-orchestrator.outputs.matrix) }}
  env:
    JEST_ROOTS: ${{ needs.tests-orchestrator.outputs.roots }}

  steps:
    - name: Check out code
      uses: actions/checkout@v4

    - name: Setup
      uses: ./.github/actions/setup

    - name: Run tests
      run: pnpm test --shard=${{ matrix.ci_node_index }}/${{ matrix.ci_node_total }}
```

Notice we add `needs: [tests-orchestrator]` at the top to make sure this runs after the orchestrator job. This also allows us to use outputs from that job using the `needs.tests-orchestrator.outputs` expression. The real magic though is in this line:

```yaml
matrix: ${{ fromJSON(needs.tests-orchestrator.outputs.matrix) }}
```

This parses the `matrix` value we passed out of the orchestrator script and uses it to define the matrix for the workflow. So if our script had passed out `{ ci_node_index: [1, 2], ci_node_total: [2] }`, it would run two jobs. But our script could just as easily have passed `{ ci_node_index: [1, 2, 3, 4, 5], ci_node_total: [5] }` which would run 5 jobs. The great thing is that it's all dynamic! We run jobs based on the number of tests we need to execute. Most of our test runs now only run 2 to 4 runner jobs. This greatly reduced our billable time.

The runners don't need to clone the entire repo anymore. Nor are they having to make determinations on what packages have changed or what files to run. This makes speeds up their wall clock time.

Now, I said we didn't need to add any special scripts for the runner, but we did have to make one change. Since we already determined which roots we need to run against in the orchestrator, we can pass those values in and use them directly without having to go to PNPM to determine which packages changed. In our workflow file, we do that by passing in `JEST_ROOTS` via `env.JEST_ROOTS: ${{ needs.tests-orchestrator.outputs.roots }}`. We need make a small update to `getRoots.js` to handle that:

```js
// If JEST_ROOTS is passed in as an env var, parse it as a JSON array and use it
if (process.env.JEST_ROOTS) {
  const roots = JSON.parse(process.env.JEST_ROOTS)
  log.green('Jest roots provided via environment variable.')
  log.green('↳ Running tests against the following directories:')
  console.log(roots.map((root) => `    - ${root}`).join('\n'))
  return roots
}
```

## Across the finish line

With that, we are now A) running tests only for packages that have changed and B) dynamically allocating runners based on how many test files are included in the current run. This has given us huge gains in our CI pipeline bringing our billable time for each down from multiple hours to 20 minutes on average. With the test runners being more focused, we also moved them to 4x runners (as opposed to the default 2x) which gave us a ~2.1x improvement in wall clock time. All in all, these changes have been an immense qualify of life as well as business improvement.

[^1]: Throughout this article, I will use the phrases "wall clock time" or "run time" to refer to how many minutes it took if one was timing with a stopwatch. "Billable time" or "total time" refers to the sum of time all CI job runners ran for. For example, a job running across 15 runners may take 5 minutes according to wall clock time. But the total billable time would be `5 minutes * 15 runners`, or 75 minutes worth of billable time.
[^2]:
    Technically, GitHub actions will run a job for every permutation of the values provided. We can multiply the number of values for each key to know how many jobs GitHub will run. For instance, the following matrix runs six jobs (`3 x 2`):

    ```yaml
    matrix:
      os: ['linux', 'mac', 'windows']
      version: ['v2.0', 'v3.0']
    ```

    Whereas this matrix runs twenty seven jobs (`3 x 3 x 3`):

    ```yaml
    matrix:
      distro: ['ubuntu', 'debian', 'mint']
      version: ['v2.0', 'v3.0', 'v4.0']
      arch: ['x86', 'amd64', 'arm64']
    ```

[^3]: GitHub actions only allows passing strings back and forth between jobs. Thankfully, stringifying and parsing JSON is trivial and GitHub actions even provides a helper function to [parse JSON](https://docs.github.com/en/actions/learn-github-actions/expressions#fromjson) directly in workflow files.
