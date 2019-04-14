exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const parent = getNode(node.parent)

    createNodeField({
      name: 'contentGroup',
      node,
      value: parent.sourceInstanceName,
    })
  }
}
