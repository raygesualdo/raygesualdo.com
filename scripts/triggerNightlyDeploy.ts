import { getAllPosts } from '../lib/posts'

const CURRENT_DATE = new Date().toISOString().slice(0, 10)
const posts = await getAllPosts({ includeDrafts: true })

if (
  posts.some((post) => post.date === CURRENT_DATE) &&
  process.env.NETLIFY_BUILD_HOOK_URL
) {
  console.log(
    'A post scheduled for today was found. Triggering a Netlify build.'
  )
  await fetch(process.env.NETLIFY_BUILD_HOOK_URL, { method: 'POST' })
}
