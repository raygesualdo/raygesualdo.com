/* eslint-disable @next/next/no-css-tags */
import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useTheme } from 'next-themes'
import { IconGitHub, IconTwitter } from './Icons'
import { A } from './Link'

export function Layout({ children }: { children: JSX.Element }) {
  const { setTheme, resolvedTheme } = useTheme()
  return (
    <>
      <Head>
        <title>RayGesualdo.com</title>
        <meta name="description" content="The personal site of Ray Gesualdo" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="//fonts.googleapis.com/css?family=Montserrat:400"
          rel="stylesheet"
        />
      </Head>
      <SkipToMainContentLink />
      <header className="h-32 py-2 md:py-0 md:h-24 bg-slate-800 text-white font-display">
        <div className="h-full grid md:gap-x-2 justify-between items-center text-center md:text-left grid-cols-1 md:grid-cols-[1fr,max-content,max-content] Xmax-w-5xl mx-auto px-8">
          <div>
            <Link href="/">
              <a className="text-xl py-1 uppercase">Ray Gesualdo</a>
            </Link>
          </div>
          <nav className="space-x-4 md:space-x-2 flex justify-center items-center">
            <Link href="/about">
              <a className="block p-1.5 md:p-2 rounded hover:bg-white/10">
                About
              </a>
            </Link>
            <Link href="/talks">
              <a className="block p-1.5 md:p-2 rounded hover:bg-white/10">
                Talks
              </a>
            </Link>
            <Link href="/rss.xml">
              <a className="block p-1.5 md:p-2 rounded hover:bg-white/10">
                Feed
              </a>
            </Link>
          </nav>
          <div className="space-x-3 md:space-x-1 flex justify-center items-center">
            <a
              className="block px-1.5 md:px-2.5 py-1.5 md:py-3 rounded hover:bg-white/10"
              href="https://twitter.com/RayGesualdo"
              aria-label="My Twitter profile"
            >
              <IconTwitter className="inline text-inherit -mt-1" />
            </a>
            <a
              className="block px-1.5 md:px-2.5 py-1.5 md:py-3 rounded hover:bg-white/10"
              href="http://github.com/raygesualdo"
              aria-label="My GitHub profile"
            >
              <IconGitHub className="inline text-inherit -mt-1" />
            </a>
          </div>
        </div>
      </header>
      <div className="grid grid-cols-[0fr,100%,0fr] md:grid-cols-[1fr,67ch,1fr]">
        <div></div>
        <main id="main" className="mt-4 md:mt-12 p-4">
          {children}
        </main>
        <div></div>
      </div>
      <footer className="p-8 text-center text-gray-500 text-sm">
        Copyright © Ray Gesualdo {new Date().getFullYear()} |{' '}
        <A
          href="https://github.com/raygesualdo/raygesualdo.com"
          className="text-sky-600 underline"
        >
          View source code
        </A>{' '}
        |{' '}
        <button
          className="text-sky-600 underline"
          onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
        >
          Toggle theme
        </button>
      </footer>
    </>
  )
}

function SkipToMainContentLink() {
  return (
    <a
      href="#main"
      className="absolute left-[50%] -translate-x-1/2 bg-indigo-700 font-semibold text-white py-1 px-3 rounded-b -translate-y-full focus:translate-y-0"
    >
      Skip to content
    </a>
  )
}
