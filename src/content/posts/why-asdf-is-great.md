---
title: Why asdf Is Great
date: 2024-01-20
category: infrastructure
hero:
  # https://unsplash.com/photos/white-red-and-green-wooden-street-sign-Aohf8gqa7Zc
  image: ../../assets/hero/asdf.jpg
  alt: Road sign pointing in many different directions
---

A few weeks ago, [@chantastic](https://twitter.com/chantastic) tweeted asking how people are managing their Node.js versions these days. My response was simple.

![@chantastic asking on Twitter "what do you use to manage node versions? nvm? volta? i've enjoyed volta. but i'm regularly having to bypass its shims to work across package managers" and me replying with "asdf. All day. Every day."](../../assets/asdf-tweet.png 'Seriously. Every day.')<!--rehype:style=width:589px;-->

Even for my personal projects, I always reach for [`asdf`](https://asdf-vm.com/). Here's why:

- **It handles multiple languages.** Out of the box, `asdf` doesn't come with any languages pre-installed. Instead, it has a plugin system with support for over 70 languages. This means you can manage any combination of languages across all your projects using the same tool. For instance, if you are working on an Phoenix project in Elixir but also need Node.js for some frontend tooling, that can all be codified in a single `.tool-versions` file[^1]:
  ```
  erlang 24.3.4
  elixir 1.15.5
  nodejs 20.11.0
  ```
- **It handles more than just languages.** There may be other tools you're working with that aren't as easily versionable, e.g. the PNPM package manager for Node.js. These tools are usually installed in a global context so they can be used from the command line anywhere. `asdf` has first- and third-party plugins for 100s of these tools. Particularly in a professional context where projects may be locked to specific languages, package managers, and toolchains, managing this in one file is incredibly helpful.
- **It's rock solid.** I've been using `asdf` personally and professionally for the better part of five years. In that time, I've never had an issue with `asdf`. Others' mileage may vary, but I've never had to wrestle with it to get a language running on my machine.
- **It's cross-platform.** It works natively on both Linux and macOS. Windows users can also experience the joys of `asdf` if they're using WSL2. `asdf` works everywhere I need it to.

I leave installing `asdf` and adding plugins as an exercise for the reader. Once that's done though, `.tool-versions` files and the `asdf install` command will be all you'll ever need to manage language versions!

[^1]: Helpfully, asdf supports using "legacy version files". Support varies depending on the specific language, but for Node.js, `asdf` can read `.nvmrc` and `.node-version`.
