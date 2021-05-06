const katex = require('katex')

module.exports = {
  book: {
    assets: './static',
    js: [],
    css: [
      'katex.min.css'
    ]
  },
  ebook: {
    assets: './static',
    css: [
      'katex.min.css'
    ]
  },
  blocks: {
    math: { // Double dollar signs ($) for math blocks (centered)
      shortcuts: {
        parsers: ['markdown', 'asciidoc', 'restructuredtext'],
        start: '$$',
        end: '$$'
      },
      process(block) {
        let config = this.book.config.get('pluginsConfig.katex-plus', {})
        let macros = config['macros'] || {}
        let output = ''
        try {
          output = katex.renderToString(block.body, {
            displayMode: true,
            macros: macros
          })
        } catch (e) {
          console.error(e)
          output = e
        }
        return output
      }
    },
    math_inline: { // Single dollar sign for inline math
      shortcuts: {
        parsers: ['markdown', 'asciidoc', 'restructuredtext'],
        start: '$',
        end: '$'
      },
      process(block) {
        let config = this.book.config.get('pluginsConfig.katex-plus', {})
        let macros = config['macros'] || {}
        let output = ''
        try {
          output = katex.renderToString(block.body, {
            displayMode: false,
            unicodeTextInMathMode: true,
            macros: macros
          })
        } catch (e) {
          console.error(e)
          output = e
        }
        return output
      }
    }
  }
}
