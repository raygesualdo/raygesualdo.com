const { merge } = require('lodash')
const {
  findManyPaginated,
} = require('../../node_modules/gatsby/dist/schema/resolvers.js')

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    MarkdownRemarkFrontmatter: {
      categoryData: {
        type: 'CategoriesYaml',
        resolve(source, args, context) {
          return context.nodeModel.runQuery({
            type: 'CategoriesYaml',
            query: { filter: { slug: { eq: source.category } } },
            firstOnly: true,
          })
        },
      },
    },
    CategoriesYaml: {
      posts: {
        type: 'MarkdownRemarkConnection',
        args: {
          filter: 'MarkdownRemarkFilterInput',
          sort: 'MarkdownRemarkSortInput',
          skip: 'Int',
          limit: 'Int',
        },
        resolve(source, args, context, info) {
          merge(args, {
            filter: { frontmatter: { category: { eq: source.slug } } },
          })
          const typeName = 'MarkdownRemark'
          return findManyPaginated(typeName)(source, args, context, info)
        },
      },
    },
  })
}
