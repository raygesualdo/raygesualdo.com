import { GetStaticProps } from 'next'
import Head from 'next/head'
import { ArticleBlock } from '../components/ArticleBlock'
import { getAllPosts, PostData } from '../lib/posts'
import { generateRssFeed } from '../lib/rss'

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
  const includeDrafts = process.env.NODE_ENV === 'development' ? true : false
  const data = await getAllPosts({ includeDrafts })

  generateRssFeed(data)

  return {
    props: {
      data,
    },
  }
}
