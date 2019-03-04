const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

const pageTemplate = path.resolve('./src/templates/page.js')
const pagesQuery = /* GraphQL */ `
  {
    collection: allMarkdownRemark(
      filter: { fields: { contentGroup: { eq: "pages" } } }
    ) {
      edges {
        node {
          fields {
            slug
          }
        }
      }
    }
  }
`
const blogPostTemplate = path.resolve('./src/templates/blog-post.js')
const blogPostsQuery = /* GraphQL */ `
  {
    collection: allMarkdownRemark(
      filter: { fields: { contentGroup: { eq: "posts" } } }
    ) {
      edges {
        node {
          fields {
            slug
          }
        }
      }
    }
  }
`
const tilTemplate = path.resolve('./src/templates/til.js')
const tilQuery = /* GraphQL */ `
  {
    collection: allMarkdownRemark(
      filter: { fields: { contentGroup: { eq: "til" } } }
    ) {
      edges {
        node {
          fields {
            slug
          }
        }
      }
    }
  }
`
const categoriesTemplate = path.resolve('./src/templates/category.js')
const categoriesQuery = /* GraphQL */ `
  {
    collection: allCategoriesYaml {
      edges {
        node {
          fields {
            slug
          }
        }
      }
    }
  }
`
const pageSets = [
  { query: pagesQuery, component: pageTemplate },
  { query: blogPostsQuery, component: blogPostTemplate },
  { query: tilQuery, component: tilTemplate },
  { query: categoriesQuery, component: categoriesTemplate },
]
const createTimestampedPath = node => {
  const datePath = node.frontmatter.date.split('T')[0].replace(/-/g, '/')
  return `/posts/${datePath}`
}

exports.createPages = ({ graphql, actions: { createPage } }) =>
  Promise.all(
    pageSets.map(async ({ query, component }) => {
      const response = await graphql(query)
      if (response.errors) {
        console.error(response.errors)
        throw new Error(response.errors)
      }
      response.data.collection.edges.forEach(({ node }) => {
        createPage({
          path: node.fields.slug,
          component,
          context: {
            slug: node.fields.slug,
          },
        })
      })
    })
  )

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const parent = getNode(node.parent)

    if (['pages', 'posts'].includes(parent.sourceInstanceName)) {
      const pathPrefix =
        parent.sourceInstanceName === 'posts' ? createTimestampedPath(node) : ''
      const value = `${pathPrefix}${createFilePath({ node, getNode })}`

      createNodeField({
        name: 'slug',
        node,
        value,
      })
    }
    if (parent.sourceInstanceName === 'til') {
      const [, value] = node.fileAbsolutePath.match(/(\d{4}-\d{2}-\d{2})\.md/)
      const slug = `til/${value}`
      createNodeField({
        name: 'date',
        node,
        value,
      })
      createNodeField({
        name: 'slug',
        node,
        value: slug,
      })
    }
    createNodeField({
      name: 'contentGroup',
      node,
      value: parent.sourceInstanceName,
    })
  }
  if (node.internal.type === 'CategoriesYaml') {
    createNodeField({
      name: 'slug',
      node,
      value: `category/${node.slug}`,
    })
  }
}
