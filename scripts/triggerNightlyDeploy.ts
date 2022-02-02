// @ts-expect-error
import fetch from 'node-fetch'
import { getAllPosts } from '../lib/posts'

const CURRENT_DATE = new Date().toISOString().slice(0, 10)

async function main() {
  const posts = await getAllPosts({ includeDrafts: true })
  if (
    posts.some((post) => post.date === CURRENT_DATE) &&
    process.env.NETLIFY_BUILD_HOOK_URL
  ) {
    console.log(
      'A post scheduled for today was found. Triggering a Netlify build.'
    )
    fetch(process.env.NETLIFY_BUILD_HOOK_URL, { method: 'POST' })
  }
}

main()
