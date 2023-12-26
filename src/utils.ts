import type { CollectionEntry } from 'astro:content'

export function formatDate(date? = new Date()) {
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
