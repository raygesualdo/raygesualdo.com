---
title: The End
date: 2024-01-12
category: code
series:
  id: migrating-to-astro
  order: 3
  includeNameInPageTitle: true
hero:
  # https://unsplash.com/photos/a-starry-night-sky-over-a-mountain-range-Ie-4ZBfvI2U
  image: ../../assets/hero/astro-3.jpg
  alt: Night with the sun on the horizon
---

Howdy again! We're in the final mile now. We got the individual blog post pages working last time. In this final installment, we'll add a few more pages, look at RSS feeds and social sharing images, and add a dark/light theme toggle. Let's get started!

## Add About Me page <small>[`fff60ed`](https://github.com/raygesualdo/raygesualdo.com/commit/fff60ed0ed3f73e912eb7c21b52c7962c9cf99c8)</small>

As I mentioned in the first series post, Astro can automatically convert Markdown files in `src/pages/` to HTML. For the About Me page, I did just that. I created `src/pages/about-me.md` and copy/pasted the contents from my old site. The text was present, but neither the structure nor the styling were correct. I fixed the first issue by creating `src/layouts/MarkdownPageLayout.astro` just for Markdown pages to pull in the site layout.

```astro
---
import type { MarkdownLayoutProps } from 'astro'
import PageTitle from '../components/PageTitle.astro'
import Markdown from '../components/Markdown.astro'
import Layout from './Layout.astro'

type Props = MarkdownLayoutProps<{
  title: string
}>

const {
  frontmatter: { title },
} = Astro.props
---

<Layout title={title}>
  <PageTitle>{title}</PageTitle>
  <Markdown>
    <slot />
  </Markdown>
</Layout>
```

Astro supports layouts specific to Markdown files. For these cases, we have the `MarkdownLayoutProps` type helper that sets the type of `Astro.props` for us. We're passing in a generic here to define the structure of our frontmatter. Everything in the template is straightforward and matches fairly closely the HTML we added to the individual blog posts page.

To fix the styling issue, I added Tailwind's typography plugin via `pnpm add @tailwindcss/typography`, copying over my theme overrides from my old site and applying the necessary Tailwind classes in a shared `Markdown` component. With these changes, I can add as many `.md` pages as I wish and they will all automatically render correctly.

## Add category list page <small>[`cdf1c2a`](https://github.com/raygesualdo/raygesualdo.com/commit/cdf1c2a5a1996fb89644c2f64992c8c166e5c510)</small>

For the category index pages, I didn't need to update any content collections since we defined the category collection for the main index page nor did I need to add any new components as everything I needed had already been built. I created `src/pages/category/[slug].astro` and added logic to get the current category based on the slug as well as any posts that referenced the current category. As with the individual blog posts page, we are using `getStaticPaths` to tell Astro about all of our categories it needs to render.

```astro
---
import { getCollection, getEntry } from 'astro:content'
import Layout from '../../layouts/Layout.astro'
import { filterPostCollection } from '../../utils'
import ArticleBlock from '../../components/ArticleBlock.astro'

export async function getStaticPaths() {
  const categories = await getCollection('categories')

  return categories.map((category) => {
    return { params: { slug: category.id } }
  })
}

const { slug } = Astro.params
const category = await getEntry('categories', slug)
const posts = await getCollection('posts', (post) => {
  return filterPostCollection(post) && post.data.category?.id === category.id
})
---

<Layout title={`Category: ${category.data.name}`}>
  <div class="text-lg text-center font-display text-red-500">— Category —</div>
  <h1 class="text-5xl mb-16 text-center font-display text-red-500">
    {category.data.name}
  </h1>
  {posts.map((post) => <ArticleBlock post={post} showCategory={false} />)}
</Layout>
```

The template renders the list much like the main index page. One difference is that we're adding an additional page header and subheader here. Another is that the `ArticleBlock` doesn't display the category link since we're already on the category listing page.

## Add theme toggler <small>[`7341d58`](https://github.com/raygesualdo/raygesualdo.com/commit/7341d580e03ce8ba26632f9273bede6cc8fb03f4)</small>

This step was interesting because I got to embed client-side JS in an Astro component. My old site had a button in the footer that allowed the user to change which theme to use. The old site used a Next.js-specific library though so I was going to need to use a more generic solution this time around. Conveniently, Astro had [a tutorial](https://docs.astro.build/en/tutorial/6-islands/2/) for how to add a theme toggle, so I copied that while making a few small tweaks for my use case.

```html
<button data-theme-toggler class="text-sky-600 underline">Toggle theme</button>

<script is:inline>
  // ...

  const handleToggleClick = () => {
    const element = htmlEl
    element.classList.toggle('dark')

    const isDark = element.classList.contains('dark')
    localStorage?.setItem('theme', isDark ? 'dark' : 'light')
  }

  document.querySelector('[data-theme-toggler]').addEventListener('click', handleToggleClick)
</script>
```

The cool feature here is the custom `is:inline` directive on the `<script>` tag. This tells Astro to not bundle the JS with the main bundle, but to leave the `<script>` tag exactly where it is when rendering the page. Notice too how we're adding an old school event listener to our theme toggler button. Because Astro components are rendered to HTML without any sort of client-side templating engine or framework, handlers can't be passed as attributed to tags e.g. `onClick={handleToggleClick}` in React. The `// ...` line contains boilerplate code for getting/setting the theme using a combination of media queries and `window.localStorage`[^1]. I'll refer you to the [Astro tutorial](https://docs.astro.build/en/tutorial/6-islands/2/) if you'd like to explore that code further.

## Add social images <small>[`7daa74f`](https://github.com/raygesualdo/raygesualdo.com/commit/7daa74f06bf71a83eb2625b16ba8194a0ad9a36e)</small>

With my old site, I used a clever library called [resoc](https://github.com/Resocio/resoc) to generate social images for each of my blog posts. Resoc allows me to write HTML which it loads up in a browser via Playwright and takes screenshots. This gives me immense control over what my social images look like. I won't go into the whole setup; that's another blog post in and of itself. I will say that getting it integrated into Astro was fairly effortless. I first copied over the `generateSocialImages` function from my old site into `utils.ts`.

```ts
export const generateSocialImages = async (title: string, slug: string) => {
  const ogImage = await compileLocalTemplate(
    'src/social-image-template/resoc.manifest.json',
    {
      title,
    },
    FacebookOpenGraph,
    `public/social-images/og-${slug}-{{ hash }}.jpg`,
    { cache: true }
  )
  const twitterImage = await compileLocalTemplate(
    'src/social-image-template/resoc.manifest.json',
    {
      title,
    },
    TwitterCard,
    `public/social-images/twitter-${slug}-{{ hash }}.jpg`,
    { cache: true }
  )

  return {
    ogImage: ogImage.replace('public/', ''),
    twitterImage: twitterImage.replace('public/', ''),
  }
}
```

This function generates two different images, one optimized for Twitter and the other a more generic OpenGraph size and shape[^2]. Next, I installed the necessary dependencies, copied over the resoc configuration files, and added meta tags for the images to the `SEO.astro` component. Most everything worked. One issue I didn't realize until I generated the site for the first time on Netlify was that PNPM's strict hoisting (or non-hoisting, really) meant I had to add [sharp as a direct depencency](https://github.com/raygesualdo/raygesualdo.com/commit/bf22eec72cf1473f1b2a45b2df0fda2da587fb2a). There was also a strange CommonJS/ES Modules bug that I [patched via `pnpm patch`](https://github.com/raygesualdo/raygesualdo.com/commit/6e5770bdeff9ab2bb0593ea998fbbc4fa0b49f27). With those two fixes in place, the social images generated smoothly.

## Add RSS feed <small>[`915776a`](https://github.com/raygesualdo/raygesualdo.com/commit/915776aeadb9433a010f44b2c5d258f35a0cf6ba)</small>

Thankfully, Astro has a first-party package for generating RSS feeds. This was not the case with my old site and I was happy to see how easy it was get an RSS feed added. I ran `pnpm install @astrojs/rss` and created `src/pages/rss.xml.ts` with the following contents:

```ts
import type { APIContext } from 'astro'
import rss, { type RSSFeedItem } from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { filterPostCollection } from '../utils'

export async function GET(context: APIContext) {
  const posts = await getCollection('posts', filterPostCollection)
  return rss({
    title: 'RayGesualdo.com',
    description: 'The personal site of Ray Gesualdo.',
    site: String(context.site),
    items: await Promise.all(
      posts.map(async (post) => {
        const { remarkPluginFrontmatter } = await post.render()
        return {
          title: post.data.title,
          link: `/posts/${post.slug}`,
          pubDate: post.data.date ?? new Date(),
          description: remarkPluginFrontmatter.excerpt,
        } satisfies RSSFeedItem
      })
    ),
    customData: `<language>en</language>
<copyright>Copyright © Ray Gesualdo ${new Date().getFullYear()}</copyright>`,
  })
}
```

Most of it is boilerplate, but I do want to point out two things. First, this page has a `.ts` suffix which means we have to be more instructive in telling Astro what to render for this page. This is why we're using the `GET` named export here to tell Astro how to generate the contents of this file[^3]. Second, we're doing a lot of `async`/`await` here but that's not a problem since this code will only be run during the build and most of the data we're waiting on is already going to be held in memory by the Astro build process. According to the logs on my site's most recent build, the RSS page took 6ms to generate.

## Final touches

There were just a few last things I needed to get the site finished up. I copied over a [few files for Netlify](https://github.com/raygesualdo/raygesualdo.com/commit/d48d075b273d769c99e08028936df895925a8063) from my previous site. I also [parallelized the social image generation code](https://github.com/raygesualdo/raygesualdo.com/commit/b910757a0e6bb4b7ea5e2d7788ba7ad19455a802). That cut the genration time for those pages in half. Lastly, I added [Plausible analytics](https://github.com/raygesualdo/raygesualdo.com/commit/0b66bef2f65ca6ad216615bb797356d09547cd12) back into my site. With that, I [created a PR](https://github.com/raygesualdo/raygesualdo.com/pull/49) for posterity and merged it. 🚀

## Conclusion

What a ride! I'm glad I took a chance on Astro. Considering my last site rewrite took me the better part of six months on and off, I was hestitant to do another, but I got all this done in 24 hours! While raising tiny humans! I really am impressed with what Astro provides out-of-the-box. The developer experience is top-notch and I haven't even explored all of it's features. It has first-class support for view transitions, enables island architectures, allows link prefetching, has many different integrations, and much more I'm going to have fun with. Any content-heavy sites I'm building, Astro will be the first framework I reach for.

[^1]: I've since updated the theme toggle to support dark mode, light mode, and system mode. The logic is broken up between two components: [`ThemeToggle.astro`](https://github.com/raygesualdo/raygesualdo.com/blob/aa4ca0a4b780b532dbbb01172cbd90d38f852962/src/components/ThemeToggle.astro) and [`ThemeToggleScript.astro`](https://github.com/raygesualdo/raygesualdo.com/blob/aa4ca0a4b780b532dbbb01172cbd90d38f852962/src/components/ThemeToggleScript.astro).
[^2]: This image generation process was ripe for optimization. I also found that including the `{{ hash }}` in the file path caused issues because the hash wasn't deterministic enough. The solution I went with was to move the final image processing to an Astro plugin. The [end result](https://github.com/raygesualdo/raygesualdo.com/compare/cb39a292b0ea391963f0d55eecc6f56b62d19cf9..f2c7eccbf553bc33cef824b60e60c2c409e60b4c) turned out nicely.
[^3]: Other verbs are available, e.g. `POST`, when using SSR and running Astro via edge/serverless functions. When doing traditional static site generation, only the `GET` verb is supported and it determines the resulting output for a given page.
