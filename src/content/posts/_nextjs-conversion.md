---
title: From Gatsby to Next.js
date:
category: code
---

I've been using Gatsby for my personal site for years. I even did some experiments with it back in the v1 days, before it used GraphQL as its data access layer. But it feels like its time for a change. Gatsby recently had a major version bump, which helps with some dev performance issues, but I want to start from scratch. My site's design was cobbled together over a few years as well, so I want to have a blank slate for that as well. Along with changing frameworks, I also want to change the styling solution I use. My site currently uses styled-components which I have also used for years, both personally and professionally, and would still strongly suggest as an excellent CSS-in-JS solution for React projects. But I've spent some time with TailwindCSS recently and have really enjoyed it. For me, it provides a good balance between productive paradigms and helpful guardrails so that my non-designer self can still create decent-looking sites.

Requirements:

- Next.js
- TypeScript
- TailwindCSS
- Content in Markdown
  For my previous site, I wrote all my blogs in Markdown. Doing so is efficient for me and works well with my writing workflow. I wanted to maintain this when switching over.

For this project, I outlined the steps below:

Steps:

- [x] Move all existing code into a `gatsby` folder
- [x] Use `create-next-app` (with TypeScript) to create a new site in `nextjs`
- [x] Get a basic blog running
- [x] Get the new site rendering old posts
- [x] Get the new site rendering post index page
- [x] Get the new site rendering old categories pages
- [x] Get the new site rendering old talks page
- [x] Get the new site rendering an about page
- [x] Add Tailwind + plugins
- [x] Add styling to site
- [x] Add RSS feed
- [x] Add Prism for syntax highlighting
- [x] Get `next/image` working with markdown content (use `react-markdown`)
- [x] Add dark mode styles
- [x] Finishing touches
- [x] Rewrite about page
- [x] Stretch: dynamic social media images (https://blog.philippebernard.dev/static-automated-social-images-with-nextjs)

### 1. (Re)Move all existing code <small>[`9558aa4`](https://github.com/raygesualdo/raygesualdo.com/commit/9558aa413169faf788042e8829eb47738dbde8c6)</small>

Instead of deleting it (for now), I moved all the existing code for my site into a `gatsby` directory. I want to keep it around for now so I can reference it easily as well as have access to my existing content.

### 2. Bootstrap a new site with `create-next-app` <small>[`47dc2fe`](https://github.com/raygesualdo/raygesualdo.com/commit/47dc2fef24db941e8d739b0a5e73827145a07cdb)</small>

With all the old code out of the way, I ran `create-next-app --typescript` to scaffold out a new site. Using `create-next-app` scaffolds out a new site with some basic files and structures to get started. I also wanted the new site to be entirely in TypeScript

Pro Tip: read the documentation and don't run `npm start` to run the dev server like I did :facepalm: Run `npm run dev`.

### 3. Get a basic blog running <small>[`dfa905a`](https://github.com/raygesualdo/raygesualdo.com/commit/dfa905ae71114f5dd22fd0af4467e26068d2c4eb)</small>

Loosely following the instructions in the [Next.js Learn portal for Dynamic Routes](https://nextjs.org/learn/basics/dynamic-routes)

`__dirname` doesn't work for referencing the path to other files since Next will execute files at different places on the filesystem. Use something like `const someDirectory = path.join(process.cwd(), 'path/to/directory/relative/to/project/root')`.

For clarity, I added types for all the different data flowing through my post functions/components.

I also removed the default styles that come with the generated site. I'm going to keep things unstyled until I add Tailwind.

### 4. Bring over old blog posts <small>[`f69c004`](https://github.com/raygesualdo/raygesualdo.com/commit/f69c004f4be41102d829fe2d73a2d857d41a49cd)</small>

Bring over the markdown from my old site. Have to move the images to the `/public` directory and fix references in markdown. Update `getPostData` and `getPathIds` to handle new markdown file structure (nested in directories, number at the beginning, `index.md`) and URL structure (/:year/:month/:day/:slug).

### 5. Create home index page <small>[`1c21599`](https://github.com/raygesualdo/raygesualdo.com/commit/1c21599318cbaaaef8ed3b69c108f98cd89ca6b0)</small>

Routing by `/:year/:month/:day/:slug` made it more difficult than if it was just by slug. May look into getting rid of that. Not sure. It definitely clogs up the URL, but it's also very clear when the post was written. Needed to recreate Gatsby's automatic excerpt extraction function. I wasn't able to find anything out of the box. Had to rely on articles and cobble something together. Also added "read time" functionality using a 3rd-party library.

### 6. Add category index page <small>[`418a31f`](https://github.com/raygesualdo/raygesualdo.com/commit/418a31f6661caf6a38b85c12a587e08d95643007)</small>

This one was pretty straightforward. Copy/pasted a lot of what was on the home page. Will probably have to componentize a lot of this to make it more maintainable. Finding my post fetching code probably needs to be a little more general.

### 7. Get talks page working <small>[`b841805`](https://github.com/raygesualdo/raygesualdo.com/commit/b841805286c469e2f78a62072153029ac6722352)</small>

Getting the talks from YAML was straightfoward. The index page was pretty easy too. Hardest part was getting the links to render. Might need to revisit that code and make it moar gooderer.

### 8. Get about me page working <small>[`4e0fbf0`](https://github.com/raygesualdo/raygesualdo.com/commit/4e0fbf06f55653b79e86d1525b05c71a5c38de64)</small>

I'm doing all the Markdown -> HTML in the `getStaticProps` function at the moment. I need to start consolidating the Remark code, although I should probably wait until `react-markdown` is in there.

### 9. TailwindCSS 🎉 <small>[`5e5e014`](https://github.com/raygesualdo/raygesualdo.com/commit/5e5e014fcec07b5bae25ce2cb3fed259924eeebe)</small>

Followed the [official docs for TailwindCSS + Next.js](https://tailwindcss.com/docs/guides/nextjs).

### 10. Add styles <small>[`2a69dd5`](https://github.com/raygesualdo/raygesualdo.com/commit/2a69dd53038c308dafbafacf9a0aac5e259fe6c4)</small>

Really large body of work. Pulled out a lot of UI into reusable components. Wrote (copy/pasta-ed) custom plugin (https://github.com/chrisg86/gatsby-remark-classes/blob/master/index.js) for adding CSS classes to markdown HTML. Had to create `_document.tsx` to handle adding classes to the `body` tag. Optimized build times by caching Post markdown data. Added overrides for `@tailwindcss/typography`.

- [x] Add layout component with header and footer
- [x] Get header layout in place
- [x] Style footer
- [x] Style markdown content
- [x] Configure font faces
- [x] Configure color palette
- [x] Style index page
- [x] Style talks page
- [x] Style category index page
- [x] Refine header styles
- [x] Refine markdown styles

### 11. Generate RSS feed <small>[`9bffe75`](https://github.com/raygesualdo/raygesualdo.com/commit/9bffe7563eb7c5e30143e402506db269e754c141)</small>

Started with https://ashleemboyer.com/how-i-added-an-rss-feed-to-my-nextjs-site. Added a `permalink` property to Posts. Created a `config.ts` file.

12. Add Prism for syntax highlighting (or, refactor the entire remakr pipeline) <small>[`a082c70`](https://github.com/raygesualdo/raygesualdo.com/commit/a082c70f67510d6e356f9b30f0a634ba3125def2)</small>

Switched to using `react-markdown` and `rehype-highlight`. Doing more work client-side, but it makes swapping out components really easy. I was able to delete my custom remark plugin as well since I could affect the rendered component directly. The remark/rehype/unified ecosystem is really nice.

13. Use next/image <small>[`0c6c5ae`](https://github.com/raygesualdo/raygesualdo.com/commit/0c6c5ae520c6afb4454e6dc9d65a5d6a2b01afdf)</small>

This was harder than it should have been. Went down the road of trying to use a remark plugin that read the image dimensions but that of course didn't work client-side where there's no access to the filesystem 🤦‍♂️ Went with a pretty workable solution where images are imported in a generated file and then they are matched up at render time with the file paths in the markdown files. This way, I still have static imports to use with `Image`. Wish this process was eaiser.

14. Add dark mode <small>[`d9da281`](https://github.com/raygesualdo/raygesualdo.com/commit/d9da281f7fc0567b6616af324f46700b7296ab63)</small>

So quick. Used `next-themes`. Only required changing ~12 lines of code. Caveat: I did have to update the Tailwind typography package first.

### Resources

- https://nextjs.org/learn/basics/dynamic-routes/render-markdown
- https://jfelix.info/blog/how-to-make-a-static-blog-with-next-js
- https://tailwindcss.com/docs/guides/nextjs
- https://brunoscheufler.com/blog/2021-04-18-processing-markdown-with-remark-and-unified-plugins
- https://www.npmjs.com/package/remark-parse
- https://www.npmjs.com/package/remark
- https://www.npmjs.com/package/@tailwindcss/typography
- https://github.com/pacocoursey/next-themes
