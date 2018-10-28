const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

const pageTemplate = path.resolve('./src/templates/page.js')
const pagesQuery = `
  {
    collection: allMarkdownRemark(filter: { fileAbsolutePath: { glob: "**/pages/**" } }) {
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
const blogPostsQuery = `
  {
    collection: allMarkdownRemark(filter: { fileAbsolutePath: { glob: "**/posts/**" } }) {
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
]

exports.createPages = ({ graphql, actions, getNode }) => {
  const { createPage } = actions
  pageSets.forEach(async ({ query, component }) => {
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
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const parent = getNode(node.parent)
    const pathPrefix = parent.sourceInstanceName === 'posts' ? '/posts' : ''
    const value = `${pathPrefix}${createFilePath({ node, getNode })}`

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
