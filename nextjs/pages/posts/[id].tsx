import { GetStaticProps, GetStaticPaths } from 'next'
import { getPathIds, getPostData, PostData } from '../../lib/posts'

type PostProps = {
  data: PostData
}

export default function Post({ data }: PostProps) {
  return (
    <div>
      <h1>{data.title}</h1>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: data.contentHtml }} />
    </div>
  )
}

export const getStaticProps: GetStaticProps<PostProps> = async (context) => {
  const data = await getPostData(context.params?.id as string)
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
