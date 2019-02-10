const siteMetadata = {
  title: 'Ray Gesualdo',
  description: 'The personal site of Ray Gesualdo.',
  author: 'Ray Gesualdo',
  siteUrl: 'https://www.raygesualdo.com',
}
const mapping = {
  'MarkdownRemark.frontmatter.category': 'CategoriesYaml.slug',
}

module.exports = {
  siteMetadata,
  mapping,
  plugins: [
    {
      resolve: '@raygesualdo/gatsby-plugin-settings',
      options: {
        path: `${__dirname}/settings`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/posts`,
        name: 'posts',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/til`,
        name: 'til',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/pages`,
        name: 'pages',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/talks`,
        name: 'talks',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/categories`,
        name: 'categories',
      },
    },
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: siteMetadata.siteUrl,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-autolink-headers',
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 720,
              linkImagesToOriginal: false,
              showCaptions: true,
            },
          },
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1.0725rem',
            },
          },
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              showLineNumbers: true,
            },
          },
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-transformer-yaml',
    'gatsby-plugin-sharp',
    'gatsby-plugin-styled-components',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-22333936-5',
      },
    },
    'gatsby-plugin-offline',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
      },
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) =>
              allMarkdownRemark.edges.map(edge => ({
                ...edge.node.frontmatter,
                description: edge.node.excerpt,
                url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                custom_elements: [{ 'content:encoded': edge.node.html }],
              })),
            query: /* GraphQL */ `
              {
                allMarkdownRemark(
                  limit: 100
                  sort: { order: DESC, fields: [frontmatter___date] }
                  filter: { fileAbsolutePath: { glob: "**/posts/**" } }
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields {
                        slug
                      }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: '/feed.xml',
          },
        ],
      },
    },
  ],
}
