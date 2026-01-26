import type { AppBskyFeedDefs, AppBskyFeedGetLikes } from '@atproto/api'
import { html, render } from 'lit-html'
import { map } from 'lit-html/directives/map.js'

type Thread = AppBskyFeedDefs.ThreadViewPost
type Like = AppBskyFeedGetLikes.Like
type NestedTemplate = unknown

const timeFormatter = new Intl.DateTimeFormat(undefined, { timeStyle: 'short' })
const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'long' })

function rootTemplate(data: {
  postUrl: string
  numReplies: number
  numLikes: number
  numQuotes: number
  repliesList: NestedTemplate
  likes: Like[]
}) {
  const displayLimit = 5
  const likesToDisplay = data.likes.slice(0, displayLimit)
  const numRemainingLikes = data.numLikes > displayLimit ? data.numLikes - data.likes.length : 0
  return html`
    <div>
      <a
        href="${data.postUrl}"
        target="_blank"
        class="text-sky-700 dark:text-sky-400 flex items-center gap-2 mb-2"
      >
        <svg
          class="bluesky-flutter size-6"
          viewBox="0 0 566 500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <path
              id="wing"
              fill="currentColor"
              d="M 123.244 35.008 C 188.248 83.809 283.836 176.879 283.836 235.857 C 283.836 316.899 283.879 235.845 283.836 376.038 C 283.889 375.995 282.67 376.544 280.212 383.758 C 266.806 423.111 214.487 576.685 94.841 453.913 C 31.843 389.269 61.013 324.625 175.682 305.108 C 110.08 316.274 36.332 297.827 16.093 225.504 C 10.271 204.699 0.343 76.56 0.343 59.246 C 0.343 -27.451 76.342 -0.206 123.244 35.008 Z"
            ></path>
          </defs>
          <use xlink:href="#wing" class="left"></use>
          <use xlink:href="#wing" class="right"></use>
        </svg>
        Join the discussion on Bluesky!
      </a>
    </div>
    <div class="flex gap-4 items-center mb-4">
      <div class="flex ms-1.5">
        ${map(
          likesToDisplay,
          (like, index) => html`
            <a
              href="https://bsky.app/profile/${like.actor.handle}"
              title="@${like.actor.handle}"
              target="_blank"
              class="rounded-full size-8 border-2 border-slate-300 dark:border-slate-700 overflow-clip -ms-1.5"
              style="z-index: ${displayLimit - index}"
            >
              <img src="${like.actor.avatar ?? ''}" class="" />
            </a>
          `
        )}
        ${numRemainingLikes
          ? html`
              <div
                class="rounded-full size-8 border-2 border-slate-300 dark:border-slate-700 overflow-clip -ms-1.5 grid place-content-center dark:bg-surface-dark"
              >
                <span class="text-xs leading-none cursor-default">+${numRemainingLikes}</span>
              </div>
            `
          : null}
      </div>
      <div class="flex gap-2 text-sm tabular-nums">
        <div>${data.numLikes} ${pluralize(data.numLikes, 'like', 'likes')}</div>
        <div>·</div>
        <div>${data.numReplies} ${pluralize(data.numReplies, 'reply', 'replies')}</div>
        <div>·</div>
        <div>${data.numQuotes} ${pluralize(data.numQuotes, 'quote', 'quotes')}</div>
      </div>
    </div>
    <div>
      <div>${data.repliesList}</div>
    </div>
  `
}

function errorTemplate(data: { message: string }) {
  return html`
    <div
      class="min-h-12 text-sm text-center grid place-content-center rounded-lg bg-slate-50 dark:bg-slate-900"
    >
      ${data.message}
    </div>
  `
}

function replyTemplate(data: {
  postUrl: string
  avatar: string
  name: string
  handle: string
  text: string
  likes: number
  time: string
  date: string
  replies: NestedTemplate
  hasMoreReplies: boolean
}) {
  return html`
    <div class="mb-8 text-sm">
      <a
        href="${data.postUrl}"
        class="flex gap-2 md:gap-3 mb-2 py-2 px-1 md:px-3 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg"
        target="_blank"
      >
        <span class="flex-shrink-0 mt-1">
          <img src="${data.avatar}" class="rounded-full size-12" />
        </span>
        <span>
          <span class="flex gap-2">
            <span class="font-semibold">${data.name}</span>
            <span class="text-slate-600 dark:text-slate-400">@${data.handle}</span>
          </span>
          <span>
            <span>${data.text}</span>
          </span>
          <span class="flex gap-2 text-slate-600 dark:text-slate-400">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-4 inline"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                ></path>
              </svg>
              <span>${data.likes}</span>
            </span>
            <span>·</span>
            <span>${data.time}</span>
            <span>·</span>
            <span>${data.date}</span>
          </span>
        </span>
      </a>
      <div class="border-l md:border-l-2 pl-2 md:pl-4 border-l-slate-200 dark:border-l-slate-800">
        ${data.replies}
      </div>
      ${data.hasMoreReplies
        ? html`
            <a
              href="${data.postUrl}"
              target="_blank"
              class="block -mt-2 pl-1 md:pl-3 text-sky-700 dark:text-sky-400"
            >
              View more replies...
            </a>
          `
        : null}
    </div>
  `
}

class BlueskyComments extends HTMLElement {
  maxReplyDepth = 10
  root = this.querySelector<HTMLElement>('#root')!
  postId = this.dataset.blueskyPostId ?? ''

  connectedCallback() {
    this.getBlueskyData(this.postId)
  }

  async getBlueskyData(postId: string) {
    try {
      const [thread, likes] = await Promise.all([
        getPostThread(postId, this.maxReplyDepth),
        getPostLikes(postId),
      ])
      this.renderRoot(thread, likes)
    } catch (error) {
      console.error(error)
      this.renderError()
    }
  }

  renderRoot(thread: Thread, likes: Like[]) {
    const repliesList = this.generateReplies(thread)
    render(
      rootTemplate({
        postUrl: atUriToBskyAppUrl(thread.post.uri),
        numReplies: thread.post.replyCount ?? 0,
        numLikes: thread.post.likeCount ?? 0,
        numQuotes: thread.post.quoteCount ?? 0,
        repliesList,
        likes,
      }),
      this.root
    )
  }

  renderError() {
    render(
      errorTemplate({
        message: 'An error occurred retrieving comments from Bluesky. Please try again later.',
      }),
      this.root
    )
  }

  generateReplies(thread: Thread, depth = 0): ReturnType<typeof map> {
    const replies = thread.replies?.filter(isThreadViewPost) ?? []
    return map(replies, (reply) => {
      return replyTemplate({
        postUrl: atUriToBskyAppUrl(reply.post.uri, reply.post.author.handle),
        avatar: reply.post.author.avatar ?? '',
        name: reply.post.author.displayName ?? '',
        handle: reply.post.author.handle,
        text: reply.post.record.text as string,
        likes: reply.post.likeCount ?? 0,
        time: timeFormatter.format(new Date(reply.post.record.createdAt as string)),
        date: dateFormatter.format(new Date(reply.post.record.createdAt as string)),
        replies: this.generateReplies(reply, depth + 1),
        hasMoreReplies: depth >= this.maxReplyDepth && !!thread.replies?.length,
      })
    })
  }
}

customElements.define('bluesky-comments', BlueskyComments)

async function getPostThread(postId: string, depth: number) {
  const uri = `at://did:plc:r7tcvme4xkh6o6pmosqcsv4j/app.bsky.feed.post/${postId}`
  // @ts-expect-error - why are `URLSearchParams` types so terrible?
  const params = new URLSearchParams({ uri, depth })

  const res = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?${params}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    throw new Error(`Failed to fetch post thread\n\n${await res.text()}`)
  }

  const data = await res.json()
  const thread = data.thread

  if (!isThreadViewPost(thread)) {
    throw new Error('Fetched post data is invalid')
  }

  return thread
}

async function getPostLikes(postId: string) {
  try {
    const uri = `at://did:plc:r7tcvme4xkh6o6pmosqcsv4j/app.bsky.feed.post/${postId}`
    const params = new URLSearchParams({ uri })

    const res = await fetch(`https://public.api.bsky.app/xrpc/app.bsky.feed.getLikes?${params}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch post likes\n\n${await res.text()}`)
    }

    const data = await res.json()
    const likes = data.likes

    if (!Array.isArray(likes) || !likes.every(isLike)) {
      throw new Error('Fetched like data is invalid')
    }

    return likes
  } catch (error) {
    console.error(error)
    return []
  }
}

function isThreadViewPost(t: unknown): t is Thread {
  return (
    !!t && typeof t === 'object' && '$type' in t && t.$type === 'app.bsky.feed.defs#threadViewPost'
  )
}

function isLike(t: unknown): t is Like {
  return !!t && typeof t === 'object' && 'actor' in t
}

// Copied from https://github.com/bluesky-social/atproto/discussions/2523#discussioncomment-12096639
/**
 * Converts an AT URI for a Bluesky post to a https://bsky.app.
 *
 * @param atUri The AT URI of the post.  Must be in the format at://<DID>/<COLLECTION>/<RKEY>
 * @param didOverride Optional override for the DID value. Typically used to substitute human-readable handles for DIDs.
 * @returns The HTTPS URL to view the post on bsky.app, or null if the AT URI is invalid or not a post.
 */
function atUriToBskyAppUrl(atUri: string, didOverride?: string): string {
  const regex = /^at:\/\/([^/]+)\/([^/]+)\/([^/]+)$/
  const match = atUri.match(regex)

  if (!match) {
    return ''
  }

  const did = didOverride ?? match[1]
  const collection = match[2]
  const rkey = match[3]

  if (collection === 'app.bsky.feed.post') {
    return `https://bsky.app/profile/${did}/post/${rkey}`
  } else {
    return ''
  }
}

function pluralize(num: number, singular: string, plural: string) {
  return num === 1 ? singular : plural
}
