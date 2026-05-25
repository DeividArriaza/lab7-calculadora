module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow semicolons'
    },
    schema: [],
    messages: {
      unexpected: 'Semicolons are not allowed.'
    }
  },
  create (context) {
    return {
      Program (node) {
        const sourceCode = context.getSourceCode()
        const tokens = sourceCode.getTokens(node)
        for (const token of tokens) {
          if (token.type === 'Punctuator' && token.value === ';') {
            context.report({ loc: token.loc, messageId: 'unexpected' })
          }
        }
      }
    }
  }
}
