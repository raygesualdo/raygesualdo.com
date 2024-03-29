import { cp } from 'node:fs/promises'
import { performance } from 'node:perf_hooks'
import { type AstroIntegration } from 'astro'

export function generateSocialImages(): AstroIntegration {
  return {
    name: 'social-images',
    hooks: {
      'astro:build:done': async ({ logger }) => {
        const numOfImages = globalThis.socialImagePromises.length
        performance.mark('start')
        await Promise.all(globalThis.socialImagePromises)
        const duration = displayDuration(performance.measure('generate', 'start').duration)
        await cp('public/social-images', 'dist/social-images', { recursive: true })
        logger.info(`${numOfImages} social images generated in ${duration}`)
      },
    },
  }
}

function displayDuration(duration: number) {
  if (duration > 60_000) return (Math.round(duration / 1000) / 60).toFixed(2) + 'm'
  if (duration > 1_000) return (Math.round(duration / 10) / 100).toFixed(2) + 's'
  return (Math.round(duration * 100) / 100).toFixed(2) + 'ms'
}
