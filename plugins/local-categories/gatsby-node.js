const { merge } = require('lodash')
const {
  findManyPaginated,
} = require('../../node_modules/gatsby/dist/schema/resolvers.js')

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    MarkdownRemarkFrontmatter: {
      categoryData: {
        type: 'CategoriesYaml',
        async resolve(source, args, context) {
          const data = await context.nodeModel.runQuery({
            type: 'CategoriesYaml',
            query: { filter: { slug: { eq: source.category } } },
            firstOnly: true,
          })
          return data
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
        async resolve(source, args, context, info) {
          merge(args, {
            filter: { frontmatter: { category: { eq: source.slug } } },
          })
          const typeName = 'MarkdownRemark'
          const data = await findManyPaginated(typeName)({
            args,
            context,
            info,
          })
          return data
        },
      },
    },
  })
}
