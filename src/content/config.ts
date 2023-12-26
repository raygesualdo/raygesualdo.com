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

export const collections = {
  posts: postsCollection,
  categories: categoriesCollection,
}
