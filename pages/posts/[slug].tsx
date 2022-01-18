import { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import { ArticleMeta } from '../../components/ArticleMeta'
import { Markdown } from '../../components/Markdown'
import { PageTitle } from '../../components/PageTitle'
import { SEO } from '../../components/SEO'
import { getPathIds, getPostData, PostData } from '../../lib/posts'
import { generateSocialImages, SocialImages } from '../../lib/socialImages'

type PostProps = {
  data: PostData
  socialImages: SocialImages
}

export default function Post({ data, socialImages }: PostProps) {
  return (
    <>
      <Head>
        <title>{data.title} | RayGesualdo.com</title>
      </Head>
      <SEO post={data} socialImages={socialImages} />

      <PageTitle>{data.title}</PageTitle>
      <ArticleMeta post={data} className="-mt-14 mb-14 text-center" />
      <Markdown markdown={data.markdown} />
    </>
  )
}

export const getStaticProps: GetStaticProps<PostProps> = async (context) => {
  const data = await getPostData(context.params?.slug as string)
  const socialImages = await generateSocialImages(data.title, data.slug)
  return {
    props: {
      data,
      socialImages,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getPathIds()
  return {
    paths,
    fallback: false,
  }
}
