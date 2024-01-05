---
title: The Beginning
date: 2024-01-05
category: code
series:
  id: migrating-to-astro
  order: 1
  includeNameInPageTitle: true
---

My website hasn't gotten much attention the past few years. In 2020, I slowly migrated from Gatsby to Next.js. I even had a partially-written blog post about it.[^1] But I was never happy with my setup. Next.js doesn't have great support for content sites out-of-the-box. My primary pain point was converting Markdown content to HTML. I had to manually create a conversion pipeline using remark and wire the content up to pages as opposed to it being built into the framework. Next.js also had many features I didn't need and seemed unnecessary for my use case.

I'm wanting to get more of my thoughts down on (digital) paper in 2024. Naturally, the first thing to do is redo my website instead of writing! I heard great things about Astro over the past year or so and thought I would give it a try. Initially, this whole process was meant to be a small trial to see if Astro was even worth considering. Turns out it was! And my website is now fully powered by it. What follows is my experience migrating my site over.

## Generate a new site <small>[`3256557`](https://github.com/raygesualdo/raygesualdo.com/commit/325655794209a879f9d332a21991dcddfbdb7887)</small>

Astro has a project init script one can use with `npm create`[^2]. This makes spinning up a new project effortless. After [removing the old site's Next.js files](https://github.com/raygesualdo/raygesualdo.com/commit/9e1ba2c9ed63fdb37c876c5cf1fa4aaf84581d34), it was time to initialize my new Astro site.

```
pnpm create astro@latest temp
```

For the prompts, I went with the default of including sample files, didn't install dependencies (cause I was going to move the project files in a moment), selected TypeScript with the "Strictest" setting (cause that's how I roll), and declined to create a new git repository. The init script created a new Astro site in the `temp/` directory with the following directory structure:

```
temp
├── .vscode
├── public
├── src
├── .gitignore
├── README.md
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

`npm create` doesn't support generating files in an existing directory so I used `temp/`, copied and pasted everything but `README.md` and the `.vscode` directory into the repo root, and deleted `temp/`. I also added an [asdf](https://asdf-vm.com/) `.tool-versions` file to define which versions of Node.js and PNPM to use. With that, I had an empty Astro site ready to populate.

## Add Tailwind <small>[`397b797`](https://github.com/raygesualdo/raygesualdo.com/commit/397b7973884ac3b5ded1f740acdec5d976f87b2c)</small>

My old site used Tailwind for styling and I liked my old site's design so I wasn't going to change much if anything from a styling perspective. Which brings me to one of my favorite parts of Astro: [integrations](https://astro.build/integrations/). Astro provides a structured way for first- or third-party code to be added to an Astro site. All I had to do was run the `astro add` command:

```
pnpm astro add tailwind
```

The command installed the Tailwind dependencies, created `tailwind.config.mjs`, and made the necessary changes to `astro.config.mjs`. That's it. It was that easy. `git commit` and move on.

## Migrate layout from old site <small>[`147ca11`](https://github.com/raygesualdo/raygesualdo.com/commit/147ca118a80121a8a9750e8a642cc6df40880948)</small>

At this point, I had Tailwind installed, but I wasn't using it at all because the site still had the default files that come with a fresh Astro installation. The first order of business was to modify `src/layouts/Layout.astro` to match the HTML structure of my old site. This was shockingly easy as Astro components give you 100% control over your HTML. It was also at this point I made the executive decision to use Astro components for everything. My previous site was all in React. Thankfully, simple React components - which almost all of mine were - are easily converted to Astro components. To get everything working correctly, I converted a few SVG icons I was using as well as a global `Link` component, and added a few lines of Tailwind config to get the correct fonts in place. Lastly, I copied over the HTML from my old site layout into `src/layouts/Layout.astro`.

## Get index page working <small>[`3dd5c36`](https://github.com/raygesualdo/raygesualdo.com/commit/3dd5c36d5979c2c79bb09ddd1912a04ffc8928f7)</small>

My site layout was in place. It was time to get the home page content working. To do so, I needed to bring over all my posts and categories from the old site. This is when I started working with Astro's [Content Collections](https://docs.astro.build/en/guides/content-collections/).

### Content Collections

Since Astro is a framework for content-heavy sites, using Markdown to generate HTML is almost trivial. There are two main ways of doing this:

1. adding `.md` pages to the `src/pages/` directory which get converted directly to HTML pages, or
2. adding `.md` files to subdirectories inside of `src/content/` creating "Content Collections".

These approaches can also be used in parallel which I do on my site. For my posts and categories, I needed Content Collections because they provide programmatic access to the content. With this approach, one needs to define each collection as well as provide a [Zod](https://zod.dev/)-based schema to check data against.

Defining the collection schema is important because it both enforces a data contract for for a given type of content and provides TypeScript type completion/checking when accessing entry data. I needed to create two collections, one for my blog posts and one for categories my blog posts are attributed to. The blog posts were `.md` files and the category data was stored in `.yml` files. Astro handles both of these seemlessly. I created `src/content/config.ts` and defined my collections like so:

```ts
import { z, defineCollection, reference } from 'astro:content'

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date().optional(),
    category: reference('categories').optional(),
  }),
})

const categoriesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
  }),
})

export const collections = {
  posts: postsCollection,
  categories: categoriesCollection,
}
```

A few things to unpack here. First, each collection has a type, either `content` or `data` for `.md` and `.yml`/`.json` files, respectively. The schemas for `content` collections enforce the shape of the YAML frontmatter. For `data` collections, the schema is checked against the entire file. Posts required a title, allowed a publish date, and allowed a reference to a category. References work similarly to foreign keys in relational databases. Categories required just a name. Now these collections can be fetched in Astro components via the `getCollection` or `getEntry` functions!

### Index page component

I created `src/pages/index.astro` and added the following logic and HTML to get all the posts to show on the page:

```astro
---
import { getCollection } from 'astro:content'
import Layout from '../layouts/Layout.astro'
import ArticleBlock from '../components/ArticleBlock.astro'
import { isPublishedPost, sortPostsByPublishDate } from '../utils'

const data = (
  await getCollection('posts', (post) => {
    if (import.meta.env.NODE_ENV === 'development') return true
    return isPublishedPost(post)
  })
).toSorted(sortPostsByPublishDate)
---

<Layout title="Home">
  <h1 class="sr-only">Home</h1>
  {
    data.map((post) => {
      return <ArticleBlock post={post} />
    })
  }
</Layout>
```

The first thing I did was use the `getCollection` function to get all the blog posts. The second argument for `getCollection` adds a filter. During development, we want to show all posts. Otherwise, we want to filter out unpublished posts. I base the "published" state on if the post has a publish date and the publish date is on or before today. Any missing dates or dates in the future get filtered out. The posts are then sorted by their publish date in descending order so the most recent is at the top of the list.

Next, I ported over the React components I used for each `ArticleBlock` on the index page as well as add a remark plugin to get the reading time for each of my posts. Astro uses Remark/Rehype under the hood for it's Markdown-to-HTML pipeline and allows one to add additional plugins to that pipeline. I copy/pasted the [reading time recipe](https://docs.astro.build/en/recipes/reading-time/) from the Astro docs and everything worked straight away. I had also written a custom Remark pipeline on my old site to extract an excerpt from Markdown, stripping away HTML tags and things like image alt text. Before bringing that over, I did a quick Google search and found someone had already written [an Astro component](https://www.npmjs.com/package/@igor.dvlpr/astro-post-excerpt) for this. I used that component instead of my plugin.

I now had my index page with all the bells and whistles from the old site: componentized article blocks, reading time, excerpts, etc. It was time to get some other pages working.

## Add Talks page <small>[`f96d4dd`](https://github.com/raygesualdo/raygesualdo.com/commit/f96d4ddc422696a8d93a33e24c11335869dee94a)</small>

I store all my talks in a single `.yml` file with a consistent data structure. As we've already seen, Astro handles this easily. I copied `talks.yml` from my old site, pasted it into the `src/content/talks/` directory[^3], and added the following to `src/content/config.ts`:

```ts
const talksCollection = defineCollection({
  type: 'data',
  schema: z.array(
    z.object({
      title: z.string(),
      abstract: z.string(),
      events: z.array(
        z.object({
          title: z.string(),
          slides: z.string().optional(),
          video: z.string().optional(),
          code: z.string().optional(),
        })
      ),
    })
  ),
})
```

Each talk has a title and abstract as well as a list of events where I've given the talk. I created `src/pages/talks.astro` and added logic to get the talks data:

```ts
import { getEntry } from 'astro:content'
const { data } = await getEntry('talks', 'talks')
```

I then ported over my React code from the old site and cleaned up a bit of the structure. You can [view the full template](https://github.com/raygesualdo/raygesualdo.com/commit/f96d4ddc422696a8d93a33e24c11335869dee94a#diff-454c79748122e5224df4d2f950cf220b5be8a4e1b765ea7b72417f3f13000e65) if you'd like to see the full HTML structure.

## Til next time

We've still got a ways to go but we'll stop here for now. I'll be walking through generating the individual blog post pages next time. There is a lot to cover there so I don't want to rush through it. See you then! 👋

There is still much more to share but we'll stop here for now. If you'd like to discuss anything I shared, chat with me about it on [Twitter](https://twitter.com/RayGesualdo). Next time we'll walk through generating individual blog post pages. See you then! 👋

<hr>

[^1]: If the Gatsby-to-Next.js process interests you, you can read the very unedited outline [here](https://github.com/raygesualdo/raygesualdo.com/blob/42eed64fd7e8244fac7a267379fc59b6f6f63a8e/src/content/posts/_nextjs-conversion.md).
[^2]: The `create` command works with all the major package managers: npm, yarn, or (my personal favorite) pnpm. This functionality is an overload of the `npm init` command as documented [here](https://docs.npmjs.com/cli/v10/commands/npm-init).
[^3]: If you're wondering why I created a directory `talks/` for the single file `talks.yml`, it's because Astro doesn't yet support single-file content collections. Effectively, it doesn't make a difference. I can call `getEntry('talks', 'talks')` to get the talks data which isn't any different from having built-in support for single-file collections.
