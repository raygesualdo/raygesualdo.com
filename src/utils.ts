import type { CollectionEntry } from 'astro:content'
import { compileLocalTemplate } from '@resoc/create-img'
import { FacebookOpenGraph, TwitterCard } from '@resoc/core'

export type SocialImages = Awaited<ReturnType<typeof generateSocialImages>>

export const generateSocialImages = async (title: string, slug: string) => {
  const [ogImage, twitterImage] = await Promise.all([
    compileLocalTemplate(
      'src/social-image-template/resoc.manifest.json',
      { title },
      FacebookOpenGraph,
      `public/social-images/og-${slug}-{{ hash }}.jpg`,
      { cache: true }
    ),
    compileLocalTemplate(
      'src/social-image-template/resoc.manifest.json',
      { title },
      TwitterCard,
      `public/social-images/twitter-${slug}-{{ hash }}.jpg`,
      { cache: true }
    ),
  ])

  return {
    ogImage: ogImage.replace('public/', ''),
    twitterImage: twitterImage.replace('public/', ''),
  }
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

export function isPublishedPost(post: CollectionEntry<'posts'>) {
  const today = new Date().toISOString().slice(0, 10)
  return !!post.data.date && post.data.date.toISOString().slice(0, 10) <= today
}

export function filterPostCollection(post: CollectionEntry<'posts'>) {
  if (import.meta.env.NODE_ENV === 'development') return true
  return isPublishedPost(post)
}
