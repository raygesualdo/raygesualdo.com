import { z, defineCollection, reference } from 'astro:content'
import { isDraft } from '../utils'
import slugify from 'slugify'

const postsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        date: z.date().optional(),
        category: reference('categories').optional(),
        hero: z
          .object({
            credit: z.string(),
            image: image(),
            alt: z.string(),
          })
          .optional(),
        series: z
          .object({
            id: reference('series'),
            order: z.number().int(),
            includeNameInPageTitle: z.literal(true).optional(),
          })
          .optional(),
        tags: z.array(z.string()).optional(),
      })
      .transform((value) => Object.assign(value, { isDraft: isDraft(value.date) }))
      .transform((value) => {
        return Object.assign(value, {
          tagsWithSlugs: value.tags?.map((tag) => {
            return {
              slug: slugify(tag, { lower: true }),
              label: tag,
            }
          }),
        })
      }),
})

const categoriesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
  }),
})

const seriesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    complete: z.literal(true).optional(),
  }),
})

const talksCollection = defineCollection({
  type: 'data',
  schema: z.array(
    z.object({
      title: z.string(),
      abstract: z.string(),
      events: z.array(
        z.object({
          title: z.string(),
          slides: z.string().optional(),
          video: z.string().optional(),
          code: z.string().optional(),
        })
      ),
    })
  ),
})

export const collections = {
  categories: categoriesCollection,
  posts: postsCollection,
  series: seriesCollection,
  talks: talksCollection,
}
