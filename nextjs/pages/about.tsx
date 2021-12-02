import { GetStaticProps } from 'next'
import Head from 'next/head'
import { PageTitle } from '../components/PageTitle'
import { getPageData } from '../lib/pages'

type AboutProps = {
  data: {
    title: string
    content: string
  }
}

export default function About({ data }: AboutProps) {
  return (
    <>
      <Head>
        <title>About Me | RayGesualdo.com</title>
      </Head>

      <PageTitle>{data.title}</PageTitle>

      <div
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />
    </>
  )
}

export const getStaticProps: GetStaticProps<AboutProps> = async (context) => {
  const data = await getPageData('about.md')

  return {
    props: {
      data,
    },
  }
}
