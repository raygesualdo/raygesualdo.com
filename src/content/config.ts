import { z, defineCollection, reference } from 'astro:content'

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date().optional(),
    category: reference('categories').optional(),
    // readingTime: ,
  }),
})

const categoriesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
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
  posts: postsCollection,
  categories: categoriesCollection,
  talks: talksCollection,
}
