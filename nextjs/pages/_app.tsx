import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout'
import '../styles/globals.css'
import '../node_modules/highlight.js/styles/atom-one-dark.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
export default MyApp
