import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { ArticleBlock } from '../../components/ArticleBlock'
import {
  getCategories,
  getCategoryBySlug,
  Category,
} from '../../lib/categories'
import { getAllPosts, PostData } from '../../lib/posts'

type CategoryProps = {
  category: Category
  data: PostData[]
}

export default function CategoryIndex({ category, data }: CategoryProps) {
  return (
    <div>
      <Head>
        <title>Category: {category.name} | RayGesualdo.com</title>
      </Head>

      <div className="text-lg text-center font-display text-red-500">
        — Category —
      </div>
      <h1 className="text-5xl mb-16 text-center font-display text-red-500">
        {category.name}
      </h1>

      {data.map((post) => {
        return <ArticleBlock key={post.slug} post={post} showCategory={false} />
      })}
    </div>
  )
}

export const getStaticProps: GetStaticProps<CategoryProps> = async (
  context
) => {
  const category = getCategoryBySlug((context.params?.slug as string) ?? '')!
  const allPosts = await getAllPosts()
  const data = allPosts.filter((post) => post.category?.slug === category.slug)
  return {
    props: {
      category,
      data,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getCategories().map(({ slug }) => ({ params: { slug } }))
  return {
    paths,
    fallback: false,
  }
}
