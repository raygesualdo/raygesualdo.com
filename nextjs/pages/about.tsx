import { GetStaticProps } from 'next'
import Head from 'next/head'
import { Markdown } from '../components/Markdown'
import { PageTitle } from '../components/PageTitle'
import { getPageData } from '../lib/pages'

type AboutProps = {
  data: {
    title: string
    markdown: string
  }
}

export default function About({ data }: AboutProps) {
  return (
    <>
      <Head>
        <title>About Me | RayGesualdo.com</title>
      </Head>

      <PageTitle>{data.title}</PageTitle>
      <Markdown markdown={data.markdown} />
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
