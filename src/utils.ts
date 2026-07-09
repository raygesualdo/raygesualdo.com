import { writeFile } from 'node:fs/promises'
import { getEntry, type CollectionEntry, type InferEntrySchema } from 'astro:content'
import { render } from 'takumi-js'
import { googleFonts } from 'takumi-js/helpers'
import { getImages, renderHeroTemplate, renderNoHeroTemplate } from './ogTemplates'

export const resolutions = {
  openGraph: {
    width: 1200,
    height: 630,
  },
  twitter: {
    width: 1500,
    height: 750,
  },
}

export type SocialImages = Awaited<ReturnType<typeof generateSocialImages>>

declare global {
  var socialImagePromises: Promise<unknown>[]
}

globalThis.socialImagePromises ??= []

export const generateSocialImages = async (title: string, slug: string, heroImagePath?: string) => {
  if (import.meta.env.PROD || import.meta.env.GENERATE_OG_IMAGES) {
    globalThis.socialImagePromises.push(generateWithTakumi('og', title, slug, heroImagePath))
    globalThis.socialImagePromises.push(generateWithTakumi('twitter', title, slug, heroImagePath))
  }

  return {
    ogImage: `social-images/og-${slug}.webp`,
    twitterImage: `social-images/twitter-${slug}.webp`,
  }
}

async function generateWithTakumi(
  type: 'og' | 'twitter',
  title: string,
  slug: string,
  heroImage?: string
) {
  const outPath =
    type === 'og'
      ? `public/social-images/og-${slug}.webp`
      : `public/social-images/twitter-${slug}.webp`
  const desiredResolution = type === 'og' ? resolutions.openGraph : resolutions.twitter
  const additionalImages = heroImage ? { heroImage } : undefined
  const renderer = heroImage ? renderHeroTemplate : renderNoHeroTemplate

  const image = await render(renderer({ title }), {
    ...desiredResolution,
    format: 'webp',
    quality: 80,
    fontFamilies: ['Montserrat'],
    fonts: await googleFonts({
      families: ['Montserrat'],
    }),
    images: getImages(additionalImages),
  })

  await writeFile(outPath, image)
}

export function formatDate(date = new Date()) {
  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'utc',
  })
}

export function sortPostsByPublishDate(a: CollectionEntry<'posts'>, b: CollectionEntry<'posts'>) {
  if (!a.data.date) return -1
  if (!b.data.date) return 1
  return b.data.date.getTime() - a.data.date.getTime()
}

type TagsWithSlugs = Exclude<InferEntrySchema<'posts'>['tagsWithSlugs'], undefined>
type TagWithSlug = TagsWithSlugs[number]

export function dedupeTags(tags: TagsWithSlugs): TagsWithSlugs {
  return Object.values(
    tags.reduce<Record<string, TagWithSlug>>((acc, tag) => {
      acc[tag.slug] ??= tag
      return acc
    }, {})
  )
}

export function isDraft(date?: Date) {
  const today = new Date().toLocaleDateString('sv')
  return !date || date?.toISOString().slice(0, 10) > today
}

export function filterPostCollection(post: CollectionEntry<'posts'>) {
  if (import.meta.env.NODE_ENV === 'development') return true
  return !post.data.isDraft
}

export async function getPostTitle(post: CollectionEntry<'posts'>) {
  if (!post.data.series) return post.data.title
  if (!post.data.series.includeNameInPageTitle) return post.data.title
  const series = await getEntry(post.data.series.id.collection, post.data.series.id.id)
  if (!series) return post.data.title
  return `${series.data.name}: ${post.data.title}`
}
