---
title: "Why I'm Bullish on Rspack"
date: 2024-02-17
category: code
hero:
  # https://unsplash.com/photos/red-crab-on-rock-b2iviaMJtoU
  image: ../../assets/hero/bullish-on-rspack.jpg
  alt: A crab
---

If you haven't heard of it, [Rspack](https://www.rspack.dev/) is a Rust-based drop-in replacement for Webpack. It hasn't hit its v1 release yet, but it's already a favorite tool in my build pipeline toolbelt. I've used it in smaller projects at Salesloft and plan to migrate our primary frontend application[^1] to it this year. Here's why I'm bullish on Rspack.

1. **It's well funded and staffed**. Rspack is developed by a team called Web Infra which itself is backed by ByteDance, the parent company of TikTok. The team that works on Rspack does so full-time and all their contributions are open source. The team includes [Boshen](https://twitter.com/boshen_c) who created [oxc](https://oxc-project.github.io/) and [Zack Jackson (a.k.a. ScriptedAlchemy)](https://twitter.com/ScriptedAlchemy) who created Module Federation.
2. **It's API-compliant with Webpack**. For all the negative attention Webpack receives, there's a reason it is the incumbent web compiler. It's got a _great_ API. It's highly extensible and can be used for just about anything. Webpack API compliance was an extremely smart move on the Web Infra team's part. Some Webpack plugins work out-of-the-box with Rspack. Some need slight refactoring because they import Webpack directly, but Rspack versions of those plugins only have to make small changes to support Rspack. This means most projects' Webpack setups will work with Rspack. And compatibility is only improving because...
3. **The team moves very quickly**. It's only been out for a few months and Rspack is already at [75% API parity](https://rspack-cov.vercel.app/) with Webpack. The team is cutting new releases constantly and improving Webpack compatibility with each one. Speaking of moving quickly...
4. **The team created more than just Rspack**. They've shipped Rspack; [Rsbuild](https://rsbuild.dev/), a Parcel-like almost-zero-config build tool based on Rspack; [Rspress](https://rspress.dev/), a Rspack-based static site generator; and [Rsdoctor](https://github.com/web-infra-dev/rsdoctor), a Rspack **and** Webpack-compatible build analysis tool[^2]. They've also got some additional projects such as Modern.js and Garfish that are more ByteDance-specific. In short, they're shipping lots of great stuff.
5. **Rspack can handle micro front ends**. Rspack supports Module Federation and micro front ends out of the box. As I mentioned, Zack Jackson is a core team member now. If you require Module Federation, you can use Rspack today.
6. **The team is very responsive**. They have a public Discord server. I've dropped in there to ask questions a few times and they've always been really responsive. In fact, they encourage devs to jump in, ask questions, and help them find the sharp edges.

It will be interesting coming back to this article in a year or two. The wave of Rust-based tools entering the front end tooling space has made quite a splash and Rspack is no different, although I think it's flown under the radar a bit. All in all, I've got high hopes for what Rspack can do. I think they're poised to become a central part of the front end build ecosystem. I know I'll be using Rspack whenever I can.

[^1]: Our primary frontend application is a fairly robust React single page application with almost a million lines of code. Getting it switched over to Rspack is going to be a huge win for our build times.
[^2]: I've used it. It's amazing!
