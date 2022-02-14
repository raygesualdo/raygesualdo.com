import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { Layout } from '../components/Layout'
import '../styles/globals.css'
import '../styles/atom-one-dark-augmented.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}
export default MyApp
