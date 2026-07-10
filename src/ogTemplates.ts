import { readFile } from 'node:fs/promises'
import type { ImagesInput } from 'takumi-js'

type ImageLoader = Extract<ImagesInput, Array<unknown>>

let cachedTwitterPicPayload: Promise<ArrayBuffer> | null = null
async function fetchTwitterPic() {
  cachedTwitterPicPayload ??= fetch(
    'https://pbs.twimg.com/profile_images/550139150066651136/II7xw5O__400x400.jpeg'
  )
    .then((x) => x.arrayBuffer())
    .catch(() => {
      cachedTwitterPicPayload = null
      return new ArrayBuffer()
    })
  return cachedTwitterPicPayload
}

export function getImages(additionalImages?: Record<string, string>): ImageLoader {
  if (additionalImages) {
    return [
      ...Object.entries(additionalImages).map(([src, filePathOrDataUrl]) => ({
        src,
        data: () =>
          filePathOrDataUrl.startsWith('data:image')
            ? Buffer.from(filePathOrDataUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64')
            : readFile(filePathOrDataUrl),
      })),
      {
        src: 'twitter',
        data: fetchTwitterPic,
      },
    ]
  }
  return [
    {
      src: 'twitter',
      data: fetchTwitterPic,
    },
  ]
}

export function renderNoHeroTemplate({ title }: { title: string }) {
  return `<div
    tw="bg-slate-900 flex flex-col text-white font-display items-stretch gap-[3vw] bg-cover relative overflow-hidden w-full h-full"
  >
    <div
      tw="absolute bottom-0 w-full flex justify-end h-[10vh] items-end px-[1vw] bg-slate-100 gap-[2vw]"
    >
      <div tw="text-[6vh] text-slate-800 font-bold self-center">@raygesualdo</div>
      <img
        src="twitter"
        tw="rounded-t-md w-[11vw] h-[11vw] shadow-lg"
      />
    </div>
    <div tw="flex-1 w-3/4 mx-auto @container">
      <div
        tw="h-full flex items-center drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-semibold ${getHeadingFontSize(
          title
        )}"
        style="line-height: 1.3"
      >${title}
      </div>
    </div>
  </div>`
}

export function renderHeroTemplate({ title }: { title: string }) {
  return `<div
    tw="bg-slate-900 flex flex-col text-white font-display items-stretch gap-[3vw] bg-cover relative overflow-hidden w-full h-full"
  >
    <img tw="absolute inset-0 object-cover left-[30vw]" src="heroImage" />
    <div
      tw="absolute bottom-0 w-full flex justify-end h-[10vh] items-end px-[1vw] bg-slate-100 gap-[2vw]"
    >
      <div tw="text-[6vh] text-slate-800 font-bold self-center">@raygesualdo</div>
      <img tw="rounded-t-md w-[11vw] h-[11vw] shadow-lg" src="twitter" />
    </div>
    <div tw="w-2/3 bg-slate-900 absolute top-[-10%] left-[-15%] h-[200%] rotate-[-20deg]"></div>
    <div tw="pl-[4vw] flex-1 w-[45vw]">
      <div
        tw="h-full flex items-center drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-semibold text-6xl"
        style="line-height: 1.3"
      >${title}
      </div>
    </div>
  </div>`
}

function getHeadingFontSize(title: string) {
  if (title.length >= 44) return 'text-7xl'
  return 'text-8xl'
}
