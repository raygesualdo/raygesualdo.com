import { getCollection } from 'astro:content'

export async function GET() {
  const posts = await getCollection('posts')
  const publishDates = Array.from(
    new Set(posts.map((post) => post.data.date?.toISOString().slice(0, 10)).filter(Boolean))
  )
    .sort()
    .reverse()
  return new Response(JSON.stringify(publishDates), {
    headers: { 'content-type': 'application/json' },
  })
}
