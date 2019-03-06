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
  })
}
