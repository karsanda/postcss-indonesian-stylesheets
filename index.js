const properties = require('./properties')
const values = require('./values')

module.exports = () => {
  return {
    postcssPlugin: 'postcss-indonesian-stylesheets',
    Declaration (decl) {
      properties.forEach(({id, en}) => decl.prop === id && (decl.prop = en))

      values.forEach(({ id, en }) => decl.value === id && (decl.value = en))
    }

    /*
    Declaration: {
      color: (decl, postcss) {
        // The fastest way find Declaration node if you know property name
      }
    }
    */
  }
}

module.exports.postcss = true
