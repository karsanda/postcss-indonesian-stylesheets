const properties = require('./properties')
const values = require('./values')

module.exports = () => {
  return {
    postcssPlugin: 'postcss-indonesian-stylesheets',
    Declaration (decl) {
      properties.forEach(({id, en}) => decl.prop === id && (decl.prop = en))

      values.forEach(({ id, en }) => decl.value === id && (decl.value = en))

      if (decl.value.indexOf('paksakan!') >= 0) {
        decl.value = decl.value.replace(/\s*paksakan!\s*/, '')
        decl.important = true
      }
    }
  }
}

module.exports.postcss = true
