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
  const formattedReadingTime =
    post.readingTime.minutes > 1
      ? `${Math.ceil(post.readingTime.minutes)} minutes`
      : `${Math.ceil(post.readingTime.minutes)} minute`
  return (
    <Head>
      <link rel="canonical" href={post.permalink} />
      <meta name="description" content={post.excerpt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@raygesualdo" />
      <meta name="twitter:site" content="@raygesualdo" />
      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={post.excerpt} />
      <meta name="twitter:url" content={post.permalink} />
      <meta name="twitter:image" content={abs(socialImages.twitterImage)} />
      <meta name="twitter:image:src" content={abs(socialImages.twitterImage)} />
      <meta name="twitter:label1" content="Est. reading time" />
      <meta name="twitter:data1" content={formattedReadingTime} />
      {post.category && (
        <>
          <meta name="twitter:label2" content="Filed under" />
          <meta name="twitter:data2" content={post.category.name} />
        </>
      )}
      <meta property="og:site_name" content="RayGesualdo.com" />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.excerpt} />
      <meta property="og:image" content={abs(socialImages.ogImage)} />
      <meta property="og:image:width" content={String(FOG.width)} />
      <meta property="og:image:height" content={String(FOG.height)} />
    </Head>
  )
}
