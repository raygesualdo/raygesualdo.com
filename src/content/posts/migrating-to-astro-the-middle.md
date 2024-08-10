---
title: The Middle
date: 2024-01-10
category: code
series:
  id: migrating-to-astro
  order: 2
  includeNameInPageTitle: true
hero:
  credit: https://unsplash.com/photos/white-and-black-stars-in-the-sky-qebM8Nmr7Ok
  image: ../../assets/hero/astro-2.jpg
  alt: The beautiful night sky
---

Welcome back! Last time we walked through generating a new site, getting the blog post index page working, and adding the talks page. This time we'll look at the individual blog post pages. There's a good bit to cover here so let's dive in.

## Add individual blog pages <small>[`65a8968`](https://github.com/raygesualdo/raygesualdo.com/commit/65a89682a950b6d729638054168d42182e3b5b91)</small>

I knew the index page and the individual blog pages were going to be the most complex. The index page actually wasn't too bad; it was a little time consuming because I was porting so much over from React to Astro components but the complexity wasn't high. The individual blog page was different. It wasn't Astro's fault. I had done a lot of custom things to my Markdown rendering pipeline that took more time to port than I realized. I started with getting the content rendering.

### Content

I had already moved all my `.md` files to get the index page working, so there wasn't anything to do there. However, I hadn't brought over any images. I copied and pasted them into `src/assets/` as the Astro docs suggest, and updated all the paths in my Markdown files to point to those images using relative paths.

```diff
--- a/src/content/posts/getting-back-on-the-bandwagon.md
+++ b/src/content/posts/getting-back-on-the-bandwagon.md
@@ -6,6 +6,6 @@
-![I have no memory of this place](/posts/gandalf.jpg 'Me every time I look at my website.')
+![I have no memory of this place](../../assets/gandalf.jpg 'Me every time I look at my website.')
```

I then created a page at `src/pages/posts/[slug].astro`. The `[slug]` part of the path acts as a placeholder. It will be populated with the post slug - a unique identifier Astro creates for each item in a collection - which I can use to fetch the page contents. Here's the logic for generating the blog post pages and getting the data for each:

```ts
import { getCollection, getEntry } from 'astro:content'
import { filterPostCollection } from '../../utils'

export async function getStaticPaths() {
  const posts = await getCollection('posts', filterPostCollection)
  return posts.map((post) => {
    return { params: { slug: post.slug } }
  })
}

const { slug } = Astro.params
const post = await getEntry('posts', slug)
const { Content, remarkPluginFrontmatter } = await post.render()
```

Since this one component is used to render many different pages, we need to tell Astro what pages those should be. In other words, how does Astro know which HTML files to generate given the posts content collection? We tell it exactly what to generate with `getStaticPaths`.

Astro runs this function when it first boots in order to know which pages it should generate. `getStaticPaths` gets all the items from the posts collection and returns an array of what the params should be for each page. We're returning the `slug` param because our page path requires it. If our component had multiple placeholders, e.g. `src/pages/[year]/[month]/[slug]`, we would need to provide values for `year`, `month`, and `slug`. If we want to generate HTML for a subset of our posts, we can limit the list here as well. In fact, that's what we're doing with `filterPostCollection`. `filterPostCollection` is a utility function that filters out unpublished drafts, encapsulating the filtering logic we applied on the index page. We tell Astro exactly what the slug should be for every HTML page it's going to generate.

The rest of the logic is invoked when the pages are being rendered. The `slug` variable we're destructuring from `Astro.params` is exactly what we provided in `getStaticPaths`. With that `slug` - again, the unique identifier for Astro - we can get all the data for a given post and render out it's content. We can use that in the template portion of our Astro component:

```astro
<Layout title={post.data.title}>
  <SEO slot="head" post={post} />
  <PageTitle>{post.data.title}</PageTitle>
  <ArticleMeta
    postData={post.data}
    readingTime={remarkPluginFrontmatter.readingTime}
    class="-mt-14 mb-14 text-center"
  />
  <Markdown>
    <Content />
  </Markdown>
</Layout>
```

At this point I was able to preview the blog pages and things looked decent. There were still a few missing features though. My images didn't look right because I had added titles to many of them that should have been rendered in `<figcaption>` tags but the titles were showing as weird text butted up against the images. The HTML structure for those wasn't correct. I also had anchors that would display next to each header when the header was hovered. None of those were showing. Lastly, I used HTML comments in a few spots to apply inline styles to elements but those weren't being applied. It took some Googling to figure out how best to handle this and I probably spent too much time trying to find _the_ optimal solution when there were plenty that would work fine.

In the end, I used the exact same rehype[^1] plugins as I did in my old site. I installed `rehypeTitleFigure`, a library to bring back the `<figcaption>` tags for my images; `rehypeAutolinkHeadings` and `rehypeSlug`, which got my heading anchors working; and `rehypeAttrs` which re-applied the inline styles. Remark and rehype are incredibly powerful and it was smart for the Astro team to piggyback off of such a proven and widely-used ecosystem. After installing each of these libraries, I added them to `astro.config.js`.

```diff
diff --git a/astro.config.mjs b/astro.config.mjs
index b8988a5..ea85942 100644
--- a/astro.config.mjs
+++ b/astro.config.mjs
@@ -1,13 +1,38 @@
 import { defineConfig } from 'astro/config'
 import tailwind from '@astrojs/tailwind'
+import rehypeTitleFigure from 'rehype-title-figure'
+import rehypeAutolinkHeadings from 'rehype-autolink-headings'
+import rehypeSlug from 'rehype-slug'
+import rehypeAttrs from 'rehype-attr'
 import { remarkReadingTime } from './src/remark-reading-time.mjs'
+import { remarkExcerpt } from './src/remark-excerpt.mjs'

 // https://astro.build/config
 export default defineConfig({
   site: getCurrentDomain(),
   integrations: [tailwind()],
   markdown: {
-    remarkPlugins: [remarkReadingTime],
+    remarkPlugins: [remarkReadingTime, remarkExcerpt],
+    rehypePlugins: [
+      [rehypeAttrs, { properties: 'attr' }],
+      rehypeTitleFigure,
+      rehypeSlug,
+      [
+        rehypeAutolinkHeadings,
+        {
+          content: {
+            type: 'text',
+            value: '#',
+          },
+          headingProperties: { class: 'relative group' },
+          properties: {
+            ariaHidden: true,
+            class:
+              'invisible group-hover:visible absolute right-full p-1 -mt-1 text-current no-underline',
+          },
+        },
+      ],
+    ],
   },
 })
```

Ignore `remarkExcerpt` for a moment; we'll get to that in the next section. For most of these, adding them to the `markdown.rehypePlugins` array was all that needed to be done. `rehypeAutolinkHeadings` needed a bit more configuration, but almost all of that was styling-related. Speaking of styling, on my old site, I used a library that allowed me to provide React components when HTML from Markdown was going to be rendered. This made it trivial, for instance, to add Tailwind classes to `<img>` tags. But that was a React-specific library. To get the styles back, I added a `<style>` tag in my Astro component and used Tailwind's `@apply` operator to add back the classes that were missing. It wasn't my favorite approach. I would much rather be able to supply Astro components or HTML snippets instead of doing the `@apply` hack. But it works. _Now_ my pages looked exactly the same as they did before. Time to get the machine-readable parts of the page working.

### Meta tags

On my old site, I had a single component that encapsulated all the SEO tags I needed for a blog post. I wanted to do the same in Astro. I copied over the `SEO` component and immediately realized the way I was handling blog post excerpts was not going to work here. I needed the excerpts as strings for the `content` attribute in multiple `<meta>` tags. When I build the index page, I used a third-party package and passed the raw post body to a `PostExcerpt` Astro component. I couldn't use that to pass an excerpt string to a meta tag. Thankfully, I had solved this problem already in my old site. I created `src/remark-excerpt.mjs` and added the following:

```js
import { toString } from 'mdast-util-to-string'
import stripMarkdown from 'strip-markdown'

function removeTags(node, tags) {
  // Strip the given tags out of the AST tree
}

export function remarkExcerpt() {
  return function (tree, { data }) {
    let value = structuredClone(tree)
    value = removeTags(value, ['image', 'imageReference'])
    value = stripMarkdown()(value)
    value = toString(value)
    const trimmedExcerpt = value.trim().substring(0, 137).trim()
    data.astro.frontmatter.excerpt = `${trimmedExcerpt}...`
  }
}
```

Let's break down this plugin. First, I used [`structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) to make a copy of the AST tree. Remark plugins typically mutate the tree directly and for this excerpt, I didn't want to change what would ultimately get rendered. I wanted to operate on a copy. Next, I used `removeTags` to remove any images from the tree. Alt tags and images titles should be a part of the exceprt. `stripMarkdown` then removed all text formatting. I stringified the AST with `toString` and trimmed it's output, appending an ellipsis to the end[^2]. I imported `remarkExcerpt` into `astro.config.mjs` and added it to the `markdown.remarkPlugins` array.

Now that excerpts were working correctly, I had everything I needed to

Here's where I ended up (with code comments removed):

```astro
---
import { getEntry, type CollectionEntry } from 'astro:content'

interface Props {
  post: CollectionEntry<'posts'>
}

const { post } = Astro.props
const { remarkPluginFrontmatter } = await post.render()

const permalink = Astro.url.href
const category = post.data.category
  ? await getEntry(post.data.category.collection, post.data.category.id)
  : undefined
const formattedReadingTime =
  remarkPluginFrontmatter.readingTime > 1
    ? `${Math.ceil(remarkPluginFrontmatter.readingTime)} minutes`
    : `${Math.ceil(remarkPluginFrontmatter.readingTime)} minute`
---

<link rel="canonical" href={permalink} />
<meta name="description" content={remarkPluginFrontmatter.excerpt} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:creator" content="@raygesualdo" />
<meta name="twitter:site" content="@raygesualdo" />
<meta name="twitter:title" content={post.data.title} />
<meta name="twitter:description" content={remarkPluginFrontmatter.excerpt} />
<meta name="twitter:url" content={permalink} />
<meta name="twitter:label1" content="Est. reading time" />
<meta name="twitter:data1" content={formattedReadingTime} />
{
  category && (
    <>
      <meta name="twitter:label2" content="Filed under" />
      <meta name="twitter:data2" content={category.data.name} />
    </>
  )
}
<meta property="og:site_name" content="RayGesualdo.com" />
<meta property="og:type" content="article" />
<meta property="og:title" content={post.data.title} />
<meta property="og:description" content={remarkPluginFrontmatter.excerpt} />
```

The `post` is passed in as a prop. I populated `category` with the actual category collection entry if the post has an associated category. I also formated the reading time to make it more human-friendly. There's probably a few tags I'm missing or don't need anymore, but everything here helps my site render well, especially when I'm sharing it via Twitter or Slack. I particularly like the `twitter:label1`/`twitter:data1` and `twitter:label2`/`twitter:data2` fields. These give the blog posts a nice two-column preview when shared via Slack.

![Two-column preview when shared to Slack](../../assets/two-column-slack-preview.png 'Slack preview')

One thing I did not do at this point was get my social images working, e.g. the `og:image` and `twitter:image` tags. That was going to take a bit of work and I wanted to tackle other parts of the site first. I'll dig into the social image in the next article. For now, the individual blog pages are done!

## Getting close to the end

Alright, we can all take a breath now! We covered quite a bit but we now have the individual blog pages fully working. Next time, we'll add the remaining pages, get the RSS feed and social sharing images working, add the dark/light mode theme toggle, and put the final finishing touches on. See you then!

[^1]: Remark and rehype are both parts of a larger project called [`unified`](https://unifiedjs.com/) which works to provide structure to content and allow converting it from one format into another. Remark plugins convert Markdown into the unified AST. Rehype plugins manipulate that AST and eventually render it to HTML.
[^2]: I've since [updated the excerpt extraction code](https://github.com/raygesualdo/raygesualdo.com/commit/1c215340c10c315cd640754fa8995a95521b3bb4). Turns out that `stripMarkdown` already had the ability to strip tags so I was able to delete the `removeTags` function. And I optimized the ellipsis logic to never break in the middle of a word.
