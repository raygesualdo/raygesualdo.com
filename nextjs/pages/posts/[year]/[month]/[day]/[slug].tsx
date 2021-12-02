import { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import { ArticleMeta } from '../../../../../components/ArticleMeta'
import { PageTitle } from '../../../../../components/PageTitle'
import { getPathIds, getPostData, PostData } from '../../../../../lib/posts'

type PostProps = {
  data: PostData
}

export default function Post({ data }: PostProps) {
  return (
    <>
      <Head>
        <title>{data.title} | RayGesualdo.com</title>
      </Head>

      <PageTitle>{data.title}</PageTitle>
      <ArticleMeta post={data} className="-mt-14 mb-14 text-center" />
      <div
        className="prose prose-lg prose-blue"
        dangerouslySetInnerHTML={{ __html: data.contentHtml }}
      />
    </>
  )
}

export const getStaticProps: GetStaticProps<PostProps> = async (context) => {
  const data = await getPostData(context.params?.slug as string)
  return {
    props: {
      data,
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
