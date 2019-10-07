---
title: 'Building a Lockscreen Notifier in Swift'
date: 2019-10-06
category: code
---

At my job, we're supposed to keep our computers locked if we ever walk away from them, a good practice wherever you are. But I constantly found myself walking away from my Mac and forgetting if I locked it or not. I wanted a way to check my laptop's locked or unlocked status from my phone. To do this, I built both a Swift app that runs on my laptop to notify "the cloud" when my computer locks or unlocks as well as a website to surface that information. In this post, I'll share how I arrived at this solution I did and how I implemented it. We will walk through much of the code together so feel free to code along or view the [GitHub repository](https://github.com/raygesualdo/amiunlocked). I hope you find it useful.

> This project is open-sourced and [available on GitHub](https://github.com/raygesualdo/amiunlocked). Instructions on how to use this yourself are included in the project's README.

Again, my goal was to check my laptop's locked or unlocked status from my phone. Let's start by taking a step back and thinking through how we might structure a solution to meet this goal.

## Researching a solution

To start, I knew what I couldn't do: I couldn't rely on communicating with the laptop directly. Having a server on the laptop set up with tunneling would have been overly complex and difficult to maintain, and it wouldn't have worked when my laptop was asleep. An optimal solution would require a cloud-based persistence layer to store the un/locked status accessible from anywhere. The architecture would need to look something like this:

![Flow diagram showing a local process writing to a cloud key/value store that is read from a website](./architecture-diagram-before.png 'Project architecture')

Working counter-clockwise in the diagram, I knew the website would be a simple HTML & JS website. I didn't want to over-engineer it. For the key/value store, I started googling for "free redis hosting" and "free key value stores". I happened across a seemingly new service called [KVdb.io](https://kvdb.io) that allows you to create "buckets" (think Redis databases) and read from/write to keys over HTTP. The final part, the local process, took longer to figure out.

Originally, I thought of using this as an opportunity to learn a little Rust. With Rust, I could compile the program down to a small binary to run on my laptop. I have a strong JavaScript background, so Node.js could have worked but I didn't want to have any dependencies for the final program. Rust seemed like a great option until I started looking at the macOS APIs for listening to lock and unlock events. From my research, unless one was using Objective C or Swift, interacting with the macOS APIs required writing C++ and then calling that C++ from whatever language one was using. This would have been my first foray into Rust and I have almost no experience with C++. That was beyond the level of effort I was willing to put into this project. I considered Go as well but the same caveat applied about needing to write custom C++.

I was left with two options: Objective C or Swift. I knew I didn't want to write any Objective C. I've never been a fan of the syntax (sorry to my Objective C friends). But Swift was much more intriguing. It's type system seemed much friendlier and, while not truly functional, it had more than a few functional programming concepts built into the language. I decided to go with Swift to build the local process.

The diagram now looked like this:

![Flow diagram showing a local process using Swift writing to the KVdb cloud key/value store that is read from an HTML & JS website](./architecture-diagram-after.png 'Project architecture with specific implementations')

With the system architecture sketched out, we can start building.

## macOS program

Let's get started by looking at the macOS program.

> If you're following along in the repo, the code we walk through from here through [Refactoring for retries](#refactoring-for-retries) is from the [`v1.0.0`](https://github.com/raygesualdo/amiunlocked/tree/v1.0.0) git tag. Starting with [Refactoring for retries](#refactoring-for-retries) through the end of the article, all code is on the master branch.

### Bootstrapping the project

The first step was to name and bootstrap the project. I decided to call it `amiunlocked`. After some googling, I found the following commands set up the project:

```shell
mkdir -p amiunlocked/program
cd amiunlocked/program
swift package init --type executable --name amiunlocked
```

You'll notice I bootstrapped the project into the `program` directory. When we get to building the website, we'll put that in an adjacent directory helpfully named `website` to keep our code organized.

> NOTE: I already had Xcode installed on my laptop. If you do not and want to follow along as we code, make sure you install [Xcode](https://developer.apple.com/xcode/) before proceeding.

### Defining states

Swift is statically typed so my next step was to define the different states the laptop can be in. There were only two in this case: `locked` and `unlocked`. These could be represented using an [enumeration](https://docs.swift.org/swift-book/LanguageGuide/Enumerations.html#ID535). I cracked open `Sources/amiunlocked/main.swift` (which was created for me by `swift package init`) and started coding.

```swift
enum State: String {
  case locked
  case unlocked
}
```

### Adding configuration management

I knew from looking at the [KVdb docs](https://kvdb.io/docs/) that I would need to provide a URL and a write key to my program. Since I was planning on open-sourcing it, configuration options would be provided at runtime rather than hard-coded. IBM's [Configuration](https://github.com/IBM-Swift/Configuration) library seemed to fit this need well. I started by adding the dependency to `Package.swift`.

```swift
.package(url: "https://github.com/IBM-Swift/Configuration.git", from: "3.0.4"),

// ...

.target(name: "amiunlocked", dependencies: ["Configuration"]),
```

I then ran `swift package update` to have Swift download the dependency. Time to start using `Configuration`.

```swift
import Configuration

// ...

let manager = ConfigurationManager()
manager.load(file: "config.json")
let url = manager["url"] as? String ?? ""
let writeKey = manager["writeKey"] as? String ?? ""

if url == "" {
  fatalError("The config parameter 'url' is required. Set it in 'config.json' and please try again.")
}

if writeKey == "" {
  fatalError("The config parameter 'writeKey' is required. Set it in 'config.json' and please try again.")
}
```

Let's walk through what this code is doing. First, we import the `Configuration` library at the top of `main.swift`. Next, `ConfigurationManager` is initialized and loads the configuration from an adjacent `config.json` file. We store configuration values in `url` and `writeKey` as strings. Lastly, we create a [fatal error](https://ericasadun.com/2015/06/26/swift-crash-burn-die/) if either configuration option is missing.

We're not done with configuration though. We still need our `config.json`. An example of the `config.json` contents is below:

```json
{
  "url": "https://kvdb.io/<idofbucketgoeshere>/state",
  "writeKey": "<alphanumericawritekeygoeshere>"
}
```

`config.json` must be adjacent to the `amiunlocked` binary. This means you'll have to copy this file to multiple places on the file system when developing (or put it in one place and create symlinks). When developing, you'll put it in `.build/debug` but when you generate a release you'll put it in `.build/release`. We'll come back to this file in the [KVdb section](#kvdb) when we generate the `url` and `writeKey` values.

### Preparing the HTTP client

Next up, the program needed to write to our KVdb bucket over HTTP. I found a nice and simple HTTP request library for Swift called [Just](https://justhttp.github.io/). I edited `Package.swift` again to add the dependency:

```swift
.package(url: "https://github.com/dduan/Just.git",  from: "0.8.0")

// ...

.target(name: "amiunlocked", dependencies: ["Configuration", "Just"]),
```

I ran `swift package update` again to download it. Back in `main.swift`, I added a function to make HTTP requests:

```swift
import Foundation
import Just

// ...

func sendRequest(state: State) {
  let r = Just.post(
    url,
    json: ["state": state.rawValue, "updatedAt": getISOTimestamp()],
    auth: (writeKey, "")
  )
  if r.ok {
    NSLog("Network: request succeeded")
  } else {
    NSLog("Network: request failed")
  }
}
```

The `sendRequest` function accepts the `state` parameter which is of the `State` enum type. We call `Just.post` with the `url` we loaded from the configuration file. We include a `json` parameter with a dictionary to be converted to stringified JSON and sent as the POST body. We'll break this dictionary down in a moment. We also set an `auth` parameter to pass Basic Authentication credentials with the request and use the `writeKey` configuration setting as the username. Lastly, we log success or failure out to the console using `NSLog` (which is why we needed the `import Foundation` entry at the top of the file).

Let's take another look at the `json` dictionary. For the `state` entry, we grab the raw value of the `state` parameter that is passed in. By default, the raw value of an enum in Swift is a string matching the enum name e.g. `State.unlocked.rawValue == "unlocked"`. The second entry, `updatedAt`, passes an ISO8601 timestamp. Sadly, there is no built in function for getting an ISO8601 timestamp in Swift but we can still generate one ourselves. Let's create a `getISOTimestamp` function.

```swift
func getISOTimestamp() -> String {
  if #available(macOS 10.12, *) {
    let date = Date()
    let dateFormatter = ISO8601DateFormatter()
    return dateFormatter.string(from: date)
  } else {
    fatalError("This process only runs on macOS 10.12+.")
  }
}
```

This function takes no arguments and returns a string. The `ISO8601DateFormatter` class is not available in all versions of macOS, so we do a [minimum version check](https://www.hackingwithswift.com/example-code/language/how-to-use-available-to-check-for-api-availability) and throw a fatal error if it's not available. If it is available, we create a date at the current time, instantiate the formatter, and call the formatter with the date.

With the `sendRequest` and `getISOTimestamp` functions complete, we have everything we need to send our computer's lock status to KVdb. Now we need to figure out how to get that lock status from the operating system.

### Get locked status

I tried looking for documentation from Apple on how to get the locked status. Real talk: their docs are awful. I couldn't find anything helpful there, but, as usual, StackOverflow came to the rescue. I initially found a solution that used polling to get the locked status via the [CGSessionCopyCurrentDictionary class](https://developer.apple.com/documentation/coregraphics/1454780-cgsessioncopycurrentdictionary). This felt hacky and I wasn't thrilled about having to poll the OS constantly. Thankfully, there was a better way. macOS has system events one can listen to and two of those events are `com.apple.screenIsLocked` and `com.apple.screenIsUnlocked`. macOS will publish these event notification types each time the computer is locked and unlocked, respectively. The original code for this section listened to sleep and shutdown events. These were unnecessary as macOS will fire the locked event prior to sleeping or shutting down. Let's look at the code:

```swift
import Cocoa

// ...

func logAndSendRequest(notification: Notification, state: State) {
  NSLog("Event: \(notification.name.rawValue)")
  sendRequest(state: state)
}

let dnc = DistributedNotificationCenter.default()

dnc.addObserver(
  forName: .init("com.apple.screenIsLocked"),
  object: nil,
  queue: .main
) { notification in
  logAndSendRequest(notification: notification, state: State.locked)
}

dnc.addObserver(
  forName: .init("com.apple.screenIsUnlocked"),
  object: nil,
  queue: .main
) { notification in
  logAndSendRequest(notification: notification, state: State.unlocked)
}
```

We import `Cocoa` and create a `logAndSendRequest` function that will log our event to the console and call the `sendRequest` function we wrote earlier. We create a reference to the default notification center and [add observers for each of our event types](https://stackoverflow.com/a/54356794). To be honest, I'm not sure what the `object` and `queue` parameters do, but it works. We then call `logAndSendRequest` with the event type (captured here as `notification`) and the resulting state of the computer.

Finally, we need to make sure our [script keeps running](https://alejandromp.com/blog/2019/01/19/a-runloop-for-your-swift-script/) and doesn't immediately shutdown.

```swift
NSLog("Process: started")
RunLoop.main.run()
```

With that, our application is done. Time to generate a release.

### Compile for production

Generating a release with Swift is incredibly simple:

```shell
swift build -c release
```

This will create a release in the `.build/release`. To run the program, you will only need the binary `.build/release/amiunlocked`. You can copy that file to another directory or leave it where it is.

### Run as a background service

With the program created, we need to make sure it always runs in the background. macOS has the concept of Launch Daemons and Launch Agents for running programs in the background. The difference between the two comes down to scope. Daemons run regardless of who is logged in and typically on behalf of the `root` user (although they can run on behalf of any user). Agents are run on behalf of specific users. I had to do a good bit of research on creating agents and daemons. There were some helpful [reference](https://www.launchd.info/) [materials](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/CreatingLaunchdJobs.html), but the best resource was a Medium article on [adding startup scripts to the launch daemon](https://medium.com/@fahimhossain_16989/adding-startup-scripts-to-launch-daemon-on-mac-os-x-sierra-10-12-6-7e0318c74de1). I followed the article line for line but could not get the program to load and run correctly. After much trial and error, I found that, for whatever reason, `amiunlocked` had to be run as an agent, not a daemon. Having figured that out, I wrote some bash scripts to automate the process of creating and installing the program as an agent.

```shell
./scripts/createPlistFile.sh
```

This script will ask you for the _absolute_ path to the `amiunlocked` binary we created in the previous section. Input the path and press Enter. The script will create a `.plist` file in the current directory. Now we need to put that file in the correct spot on the filesystem and have macOS load it. Thankfully, there's a script for that.

```shell
./scripts/installPlistFile.sh
```

Running this script installs `amiunlocked` as a launch agent and runs the program.

### Refactoring for retries

> This section covers refactoring and adding network retry logic. We already have a running program, so if you'd rather move on, you can skip ahead to the [KVdb section](#kvdb).

The program works but it has a glaring problem. If I unlock my computer, but the network is glitchy or takes a few extra seconds to connect while the program makes its HTTP request, that event is lost forever. To solve this, we could blindly add HTTP request retries, but we would get into all sorts of race conditions if the computer was locked and unlocked in quick succession. A better approach would be to design a system that continues to make HTTP requests until it succeeds while always sending the most recent locked or unlocked status. Let's walk through what that looks like.

First, we'll break up our program into more manageable files. We'll pull out our configuration code since its entirely self-contained and put it in `Sources/amiunlocked/config.swift`.

```swift
import Configuration

// Start a configuration manager, load configuration from an adjacent
// `config.json` file, cast config values to appropriate types, and
// fail if required config values are not present
struct Config {
  var url: String
  var writeKey: String
  init() {
    let manager = ConfigurationManager()
    manager.load(file: "config.json")
    url = manager["url"] as? String ?? ""
    writeKey = manager["writeKey"] as? String ?? ""

    if url == "" {
      fatalError("The config parameter 'url' is required. Set it in 'config.json' and please try again.")
    }

    if writeKey == "" {
      fatalError("The config parameter 'writeKey' is required. Set it in 'config.json' and please try again.")
    }
  }
}
```

This code is a little longer than it was before, but does the exact same thing. We wrap it in a `struct` to keep everything organized. On `init`, configuration will be loaded from `config.json` as before and the `url` and `writeKey` values will be available on the struct. We'll see this struct used in just a bit.

Next, let's extract and refactor our network request logic in `Sources/amiunlocked/sync.swift`. We'll start by importing the necessary dependencies and porting over the `getISOTimestamp` function exactly as it was before.

```swift
import Cocoa
import Just

private func getISOTimestamp() -> String {
  if #available(macOS 10.12, *) {
    let date = Date()
    let dateFormatter = ISO8601DateFormatter()
    return dateFormatter.string(from: date)
  } else {
    fatalError("This process only runs on macOS 10.12+.")
  }
}
```

Now it's time to tackle handling retries. Things get a little more complicated here because we can't simply make HTTP requests and forget about them. We need a way to track if a request needs to be retried. I was kicking this around at the office and my co-worker Ben suggested using a state machine. While the following solution isn't strictly a state machine, it follows some of the same characteristics. The idea is that any time a network request needs to be made, this is called a "sync". A sync can be in a pending state, success state, or failure state. How these flow is outlined in the diagram below.

![State machine diagram showing failure and success states flowing through pending state](./sync-status-state-machine.png 'Sync status state machine')

Let's start writing some code.

```swift
class Sync {
  private static let config = Config()

  enum SyncStatus {
    case pending(nextState: State)
    case success
    case failure(retryState: State)
  }

  var syncStatus: SyncStatus = .success
  private var task: DispatchWorkItem?

}
```

The first thing we do is make our `Config` struct available as a private static value on our `Sync` class. We'll need these configuration values when making the actual network request. Next, we create an enum to capture the different `SyncStatus` states possible: pending, success, and failure. Notice that the pending and failure states carry a `State` type with them. This is the current `State` of the computer, locked or unlocked. If a sync is pending, or fails and needs to be retried, we know what `State` needs to be sent in the HTTP request. We also add the `syncStatus` property to track our current sync status and a private `task` property which we'll come back to later.

We still need a function that triggers a sync when the locked state of the computer changes. Let's write that function now.

```swift
  func initializeSync(state: State) {
    syncStatus = .pending(nextState: state)
    handleSync()
  }
```

> The period (`.`) in front of the `pending` status means the enum is available in the class directly and doesn't require a namespace, e.g. `ExternalModule.SyncStatus.pending`.

The `initializeSync` function sets the class' `syncStatus` property to `pending` and provides what state should be sent to the server. It then calls the `handleSync` function. Let's write that one next.

```swift
  private func handleSync() {
    if task != nil { task!.cancel() }

    switch syncStatus {
    case let .pending(nextState):
      sendRequest(state: nextState)
    case .success:
      break
    case let .failure(retryState):
      syncStatus = .pending(nextState: retryState)
      sendRequest(state: retryState)
    }
  }
```

Now we're getting somewhere. The first thing we do is cancel the class' `task` if it's present. We'll look at what that is in a moment. Then we use a simple switch on `syncStatus`. If the status is `pending`, we'll send a request using the `sendRequest` function. If the status is `success`, we do nothing - our job is done. If the status is `failure`, we set the status to `pending` and try again. With this switch statement, `syncStatus` will always be `pending` when we call `sendRequest`. Let's continue and write `sendRequest`.

```swift
private func sendRequest(state: State) {
  let r = Just.post(
    Sync.config.url,
    json: ["state": state.rawValue, "updatedAt": getISOTimestamp()],
    auth: (Sync.config.writeKey, "")
  )
  if r.ok {
    NSLog("Network: request succeeded")
    syncStatus = .success
  } else {
    NSLog("Network: request failed")
    syncStatus = .failure(retryState: state)
    task = DispatchWorkItem { self.handleSync() }
    DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + 2, execute: task!)
  }
}
```

Here is where we make the actual network request. As with the original code, we use the `url` and `writeKey` from our class' `config` property. We send a JSON payload with the request of the current state and timestamp. If the network request succeeds, we log the success and set the status as `success`. If the network request fails, we log the failure, set the sync status to `failure`, create a task to be executed, and [dispatch the task](https://stackoverflow.com/questions/28359768/cancel-a-timed-event-in-swift/39684520#39684520) to be executed in two seconds (technically, current time plus two seconds).

This is where our retry logic comes into play. On a failed network response, our code will retry until it succeeds. Our code is also free of race conditions. If the state of the laptop is toggled very quickly while network requests are failing, the `if task != nil { task!.cancel() }` line from the `handleSync` function will clear out the currently scheduled task and make a network request with the most recent state.

Alright, we're almost to the finish line with this refactor. The remaining code will stay in `Sources/amiunlocked/main.swift` and looks much like it did before.

```swift
import Cocoa
import Foundation

// Enumerate valid states for our computer: "locked" and "unlocked"
enum State: String {
  case locked
  case unlocked
}

var sync = Sync()

func logAndSync(notification: Notification, state: State) {
  NSLog("Event: \(notification.name.rawValue)")
  sync.initializeSync(state: state)
}

let dnc = DistributedNotificationCenter.default()

dnc.addObserver(
  forName: .init("com.apple.screenIsLocked"),
  object: nil,
  queue: .main
) { notification in
  logAndSync(notification: notification, state: State.locked)
}

dnc.addObserver(
  forName: .init("com.apple.screenIsUnlocked"),
  object: nil,
  queue: .main
) { notification in
  logAndSync(notification: notification, state: State.unlocked)
}

// Let's do this thing!
NSLog("Process: started")
RunLoop.main.run()
```

The only changes here are instantiating our `Sync` class with `var sync = Sync()` and calling `sync.initializeSync` in `logAndSync`. With these changes, our project is better organized and the program is much more resilient to network failures. You can create a new release and run `./program/scripts/installPlistFile.sh` again to reload the latest release.

The refactor is complete. Now we need somewhere to send our HTTP request.

## KVdb

With our program written, we can move on to creating our cloud key/value store using KVdb. It uses a construct called "buckets" which are groups of key/value pairs that can be write-protected and read-protected. Buckets are created using simple HTTP requests. I wrapped the necessary request in a shell script saved as `program/scripts/setupDb.sh`. The script requires the user to provide a secret key and a write key in code. The secret key is used for bucket management and the write key is used to provide write-access to the bucket. While we could put read-access controls in place, we want the bucket to be publicly readable for our purposes.

> KVdb, while a paid service, has a generous free tier which this project stays within.

Generate two random strings by running `openssl rand -hex 16` twice, open `program/scripts/setupDb.sh` and enter your generated keys for `secretKey` and `writeKey`. Save and close the file, then run it.

```shell
./program/scripts/setupDb.sh
```

Running the script creates the bucket and outputs the URL, secret key, and write key to the console. The URL and write key can be added to your `config.json` now. Our key/value store is configured. Time to build our website.

## Website

The website is fairly straightforward. It needs to display text showing whether the computer is unlocked or not. We'll start by creating a directory for our website files at the root of our project and scaffolding out a default `package.json` file.

```shell
mkdir website
cd website
npm init -y
```

> A recent version of [Node.js](https://nodejs.org/) (current LTS or newer) is required to develop the website. I recommend using [asdf](https://github.com/asdf-vm/asdf) to manage Node.js versions. It handles most other languages well too.

### Build Process

While our website doesn't need a complex build process, there will be some "compile time" tasks that need to occur, mostly around injecting environment variables into our site. [Parcel](https://parceljs.org/) is a wonderfully simple option. I installed it as well as [nunjucks](https://mozilla.github.io/nunjucks/templating.html), a JavaScript templating engine.

```shell
npm install parcel-bundler nunjucks parcel-plugin-nunjucks
```

I also added two scripts to the scripts section of the project's `package.json`.

```json
{
  "start": "parcel index.njk",
  "build": "parcel build index.njk --experimental-scope-hoisting"
}
```

We can run our build process with simple npm commands now. Let's build out our HTML next.

### HTML

I decided to start with the [HTML5 boilerplate](https://html5boilerplate.com/) and trim it down to my needs. After downloading the latest version, I converted `index.html` to `index.njk` (a nunjucks file) and edited the necessary parts.

<!-- prettier-ignore -->
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>{{title}}</title>
    <meta name="description" content="" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="assets/favicon.ico" />
    <link rel="apple-touch-icon" href="assets/icon.png" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Alfa+Slab+One|Hind" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/modern-normalize/0.5.0/modern-normalize.min.css" integrity="sha256-N6+kUxTWxpqVK+BrPWt3t4jeOWPtp37RZEbm5n9X+8U=" crossorigin="anonymous" />
    <link rel="stylesheet" href="assets/css/main.css" />
    <meta name="theme-color" content="#fafafa" />
  </head>

  <body>
    <main>
      <div>Your computer is</div>
      <div id="state">Schrödinger's cat</div>
      <div id="updated-at">&nbsp;</div>
    </main>
    <script>
      window.kvdbUrl = '{{kvdbUrl}}'
    </script>
    <script src="assets/js/main.js"></script>
  </body>
</html>
```

Most of what's in the `<head>` tag is the default, minus a dynamically provided value for `<title>` and the Google fonts. The `<body>` tag is more interesting. We add a `<main>` tag with elements for holding our state and the "updated at" timestamp. The `state` and `updated-at` div tags will be manipulated via JavaScript which we will look at in a minute. We set `window.kvdbUrl` to a dynamically provided value as well.

Let's talk about those dynamically provided values. We're using two here: `title` and `kvdbUrl`. Like most templating engines, nunjucks allows us to inject values into our templates, but we must tell nunjucks what those values should be. The [nunjucks plugin](https://www.npmjs.com/package/parcel-plugin-nunjucks) for Parcel will automatically read a `nunjucks.config.js` file if it exists adjacent to our `package.json`. I created the file and added a minimal configuration.

```javascript
;['TITLE', 'KVDB_URL'].forEach(key => {
  if (!process.env[key]) {
    throw new Error(`Environment variable "${key}" is required.`)
  }
})

module.exports = {
  root: './',
  data: {
    title: process.env.TITLE,
    kvdbUrl: process.env.KVDB_URL,
  },
}
```

First, we check that both the `TITLE` and `KVDB_URL` environment variables are set. If not, we throw an error and our Parcel build process will not start. Then, we set the `data` key with both `title` and `kvdbUrl`, matching the variable names used in `index.njk`.

To make sure our build process doesn't error out, we need to provide `TITLE` and `KVDB_URL` environment variables. The title can be whatever you want it to be. The URL should be the URL we generated in the [KVdb](#kvdb) section. We can do this using a `.env` file.

```
TITLE=Title of my website
KVDB_URL=https://kvdb.io/<bucket>/<key>
```

Our website's structure is finished. Let's verify that our build process is working.

```shell
npm start
```

It should build without error and the console output will direct you to http://localhost:1234. In dev mode, Parcel serves our website with live reload enabled, meaning as we make changes to source files, the updates will automatically be applied to the page. Leave this command running for the remainder of our work on the website. Go ahead and open that link now. We can see our HTML structure, but our site isn't doing much yet. Let's change that.

### JavaScript

We need the site to pull the latest state from our KVdb bucket. We'll add our JavaScript to `assets/js/main.js`. Let's look at the code in two chunks, the first to update the UI and the second to handle fetching our state.

```javascript
const $main = document.querySelector('main')
const $state = document.querySelector('#state')
const $updatedAt = document.querySelector('#updated-at')

const STATES = ['locked', 'unlocked']

const updateUi = ({ state, updatedAt } = {}) => {
  if (state) {
    $main.classList.remove(...STATES)
    $main.classList.add(state)
    $state.textContent = state
  }
  if (updatedAt) {
    const date = new Date(updatedAt)
    const humanReadableDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    })
    $updatedAt.textContent = `Updated ${humanReadableDate}`
  }
}

const resetUi = () => {
  $main.classList.remove(...STATES)
  $state.textContent = "Schrödinger's cat"
  $updatedAt.innerHTML = '&nbsp;'
}
```

This first section deals with manipulating the DOM. We start by selecting a few elements from the page's DOM for us to use later. We also define the two valid states for our application: `locked` and `unlocked`. Next, we create an `updateUi` function to handle updating our UI with provided data.

The `updateUi` function does two things. First, it checks to see if new `state` has been provided. If so, it removes all state-related classes from `$main`, adds the appropriate class based on the current state, and sets the `$state` text. The second part of `updateUi` checks for an `updatedAt` timestamp. If it exists, it formats it and displays it in `$updatedAt`.

We'll also create a `resetUi` function to reset the UI back to its original state. With these two functions, we have everything we need to work with the DOM. We can now focus on fetching our data.

```javascript
const fetchState = async () => {
  try {
    const response = await fetch(window.kvdbUrl, { cache: 'no-store' })
    const json = await response.json()
    updateUi(json)
  } catch (error) {
    console.error(error)
    resetUi()
  }
}

fetchState()
setInterval(() => {
  fetchState()
}, 5000)
```

The `fetchState` function makes a `fetch` call to `window.kvdbUrl` (the dynamic value we injected via nunjucks driven by the `KVDB_URL` environment variable). If successful, it updates the UI using the JSON payload from the request. If there are any errors, we log them to the console and reset the UI. To kick everything off, we call `fetchState` on page load as well as invoke a `setInterval` to call it every 5 seconds.

With this code in place, our website will fetch the current state of the computer with the timestamp for when it was updated from our KVdb bucket. If we view our site at http://localhost:1234, we should see the text updating to match the current state of our laptop (assuming you've already run the `amiunlocked` program and there's data in the KVdb bucket).

The structure and functionality of our site are in place. The only thing left is to make it look a little nicer.

### CSS

The HTML5 Boilerplate comes with a `assets/css/main.css` file. I didn't change any of the existing styles in that file. I only appended my own.

```css
html {
  color: #222;
  font-size: 2em;
  line-height: 1.4;
  font-family: 'Hind', sans-serif;
}

main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  background-color: #222;
  color: #fff;
  text-shadow: 1px 1px 2px #717171;
}

main.locked {
  background-color: #1dbab4;
}

main.unlocked {
  background-color: #bc0b0b;
}

[id='state'] {
  font-size: 1.5em;
  text-transform: uppercase;
  font-family: 'Alfa Slab One', cursive;
}

@media only screen and (min-width: 30em) {
  [id='state'] {
    font-size: 2em;
  }
}

@media only screen and (min-width: 45em) {
  [id='state'] {
    font-size: 3em;
  }
}

[id='updated-at'] {
  font-size: 0.5em;
}
```

These styles mostly handle font family and font size, including some responsive font sizing depending on screen width. The remaining styles are for `main` where we use flexbox to center the content on the screen. Save `main.css` and you should see the styles immediately applied to the site.

### Building for Production

Our website is finished. Kill the `npm start` command that's still running and run the production build command instead.

```shell
npm run build
```

This command builds a production version of the site, compiling our JavaScript, optimizing our static assets, and outputting all processed files to the `dist/` directory. We can optionally deploy the built site to a static hosting provider like [Netlify](https://www.netlify.com/) (the [README](https://github.com/raygesualdo/amiunlocked/blob/master/website/README.md) for the source code covers this process), but I'll leave that to you to explore.

## Wrapping Up

Whoo, we've come a long way. First, we discussed the problem and the architecture of the proposed solution. We then wrote a Swift program that listens to lock and unlock events from the operating system and sends an HTTP request when an event is received. Next, we refactored that program to be more resilient and consistent when handling edge cases and flaky network connectivity. After that, we created our key/value store, or bucket, with KVdb. Lastly, we built a website to pull the computer state from KVdb and display the most recent value to the user.

I hope this walkthrough was helpful. I know I learned a lot going through the process. As a reminder, the entire project is [open-sourced on GitHub](https://github.com/raygesualdo/amiunlocked) with detailed README instructions if you would like to get it up and running for yourself. I've been using `amiunlocked` for two months now and it's served its purpose well.

> I have since created an additional layer to this project written in Elixir/Phoenix to add more real-time functionality to the website portion of the project. Be on the lookout for that article soon.

Til next time!

---

Interested in `amiunlocked`, Swift, websites, or anything else discussed in this article? Chat with me about it on [Twitter](https://twitter.com/RayGesualdo)!
