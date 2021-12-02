import { GetStaticProps } from 'next'
import Head from 'next/head'
import { ArticleBlock } from '../components/ArticleBlock'
import { getPathIds, getPostData, PostData } from '../lib/posts'

type HomeProps = {
  data: PostData[]
}

export default function Home({ data }: HomeProps) {
  return (
    <div>
      <Head>
        <title>Home | RayGesualdo.com</title>
      </Head>

      <h1 className="sr-only">Home</h1>

      {data.map((post) => {
        return <ArticleBlock key={post.slug} post={post} />
      })}
    </div>
  )
}

export const getStaticProps: GetStaticProps<HomeProps> = async (context) => {
  const paths = getPathIds().reverse()
  const data = await Promise.all(
    paths.map((path) => getPostData(path.params.slug))
  )
  return {
    props: {
      data,
    },
  }
}
