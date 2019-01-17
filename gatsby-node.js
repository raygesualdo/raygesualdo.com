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
const pageSets = [
  { query: pagesQuery, component: pageTemplate },
  { query: blogPostsQuery, component: blogPostTemplate },
]
const createTimestampedPath = node => {
  const datePath = node.frontmatter.date.slice(0, 10).replace(/-/g, '/')
  return `/posts/${datePath}`
}

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

    if (parent.sourceInstanceName !== 'til') {
      // const pathPrefix = parent.sourceInstanceName === 'posts' ? '/posts' : ''
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
      createNodeField({
        name: 'date',
        node,
        value,
      })
    }
    createNodeField({
      name: 'contentGroup',
      node,
      value: parent.sourceInstanceName,
    })
  }
}
