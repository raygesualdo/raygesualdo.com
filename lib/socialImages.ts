import { compileLocalTemplate } from '@resoc/create-img'
import { FacebookOpenGraph, TwitterCard } from '@resoc/core'

export type SocialImages = Awaited<ReturnType<typeof generateSocialImages>>

export const generateSocialImages = async (title: string, slug: string) => {
  const ogImage = await compileLocalTemplate(
    'resoc-template/resoc.manifest.json',
    {
      title,
    },
    FacebookOpenGraph,
    `public/social-images/og-${slug}-{{ hash }}.jpg`,
    { cache: true }
  )
  const twitterImage = await compileLocalTemplate(
    'resoc-template/resoc.manifest.json',
    {
      title,
    },
    TwitterCard,
    `public/social-images/twitter-${slug}-{{ hash }}.jpg`,
    { cache: true }
  )

  return {
    ogImage: ogImage.replace('public', ''),
    twitterImage: twitterImage.replace('public', ''),
  }
}
