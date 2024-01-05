import { z, defineCollection, reference } from 'astro:content'
import { isDraft } from '../utils'

const postsCollection = defineCollection({
  type: 'content',
  schema: z
    .object({
      title: z.string(),
      date: z.date().optional(),
      category: reference('categories').optional(),
      series: z
        .object({
          id: reference('series'),
          order: z.number().int(),
          includeNameInPageTitle: z.literal(true).optional(),
        })
        .optional(),
    })
    .transform((value) => Object.assign(value, { isDraft: isDraft(value.date) })),
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
