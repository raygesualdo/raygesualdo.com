import Head from 'next/head'
import { FacebookOpenGraph as FOG } from '@resoc/core'
import { PostData } from '../lib/posts'
import { SocialImages } from '../lib/socialImages'
import { config } from '../lib/config'

const abs = (url: string) => `${config.siteUrl}${url}`

export const SEO = ({
  post,
  socialImages,
}: {
  post: PostData
  socialImages: SocialImages
}) => {
  return (
    <Head>
      <meta name="description" content={post.excerpt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@raygesualdo" />
      <meta name="twitter:site" content="@raygesualdo" />
      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={post.excerpt} />
      {/* <meta name="twitter:image" content={abs(socialImages.twitterImage)} /> */}
      {/* <meta name="twitter:image:src" content={abs(socialImages.twitterImage)} /> */}
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.excerpt} />
      <meta property="og:image" content={abs(socialImages.ogImage)} />
      <meta property="og:image:width" content={String(FOG.width)} />
      <meta property="og:image:height" content={String(FOG.height)} />
    </Head>
  )
}
