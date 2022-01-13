import { GetStaticProps } from 'next'
import Head from 'next/head'
import capitalize from 'lodash/capitalize'
import { getTalks, Talk } from '../lib/talks'
import { intersperse } from '../lib/utils'
import { PageTitle } from '../components/PageTitle'
import { A } from '../components/Link'

type HomeProps = {
  data: Talk[]
}

export default function Home({ data }: HomeProps) {
  return (
    <div>
      <Head>
        <title>Talks | RayGesualdo.com</title>
      </Head>

      <PageTitle>Talks</PageTitle>

      {data.map((talk) => {
        const { title, abstract, events } = talk

        return (
          <div key={title} className="mb-24">
            <h2 className="text-2xl font-display text-red-500">{title}</h2>
            {events.length && (
              <ul className="my-4 list-[circle] list-inside">
                {events.map(({ title, ...links }) => (
                  <li key={title}>
                    {title} {renderLinks(links)}
                  </li>
                ))}
              </ul>
            )}
            <p>{abstract}</p>
          </div>
        )
      })}
    </div>
  )
}

const renderLinks = (
  event: Pick<Talk['events'][0], 'code' | 'slides' | 'video'>
) => {
  if (!event.code && !event.slides && !event.video) return null

  return (
    <span>
      (
      {intersperse(
        (['slides', 'video', 'code'] as (keyof typeof event)[])
          .map((key) => {
            if (key in event) {
              const link = event[key]!
              return <A href={link}>{capitalize(key)}</A>
            }
          })
          .filter(Boolean),
        (i) => (
          <span key={i}> | </span>
        )
      )}
      )
    </span>
  )
}

export const getStaticProps: GetStaticProps<HomeProps> = async (context) => {
  const data = getTalks()
  return {
    props: {
      data,
    },
  }
}
