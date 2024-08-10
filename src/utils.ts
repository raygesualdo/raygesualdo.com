import { access } from 'node:fs/promises'
import { getEntry, type CollectionEntry } from 'astro:content'
import { compileLocalTemplate } from '@resoc/create-img'
import { FacebookOpenGraph, TwitterCard } from '@resoc/core'

export type SocialImages = Awaited<ReturnType<typeof generateSocialImages>>

globalThis.socialImagePromises ??= []

export const generateSocialImages = async (title: string, slug: string) => {
  globalThis.socialImagePromises.push(generateOGImage(title, slug))
  globalThis.socialImagePromises.push(generateTwitterImage(title, slug))

  return {
    ogImage: `social-images/og-${slug}.jpg`,
    twitterImage: `social-images/twitter-${slug}.jpg`,
  }
}

const generateOGImage = async (title: string, slug: string) => {
  const path = `public/social-images/og-${slug}.jpg`
  try {
    await access(path)
    return
  } catch {}
  return compileLocalTemplate(
    'src/social-image-template/resoc.manifest.json',
    { title },
    FacebookOpenGraph,
    `public/social-images/og-${slug}.jpg`,
    { cache: true }
  )
}
const generateTwitterImage = async (title: string, slug: string) => {
  const path = `public/social-images/twitter-${slug}.jpg`
  try {
    await access(path)
    return
  } catch {}
  return compileLocalTemplate(
    'src/social-image-template/resoc.manifest.json',
    { title },
    TwitterCard,
    `public/social-images/twitter-${slug}.jpg`,
    { cache: true }
  )
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
  return `${series.data.name}: ${post.data.title}`
}
