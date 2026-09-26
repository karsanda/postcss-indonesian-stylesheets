import type { PluginCreator } from 'postcss'
import properties from './properties.ts'
import values from './values.ts'

const propertyMap = new Map(properties.map(({ id, en }) => [id, en]))
const valueMap = new Map(values.map(({ id, en }) => [id, en]))

const plugin: PluginCreator<Record<string, never>> = () => {
  return {
    postcssPlugin: 'postcss-indonesian-stylesheets',
    Declaration(decl) {
      decl.prop = propertyMap.get(decl.prop) ?? decl.prop
      decl.value = valueMap.get(decl.value) ?? decl.value

      if (decl.value.includes('paksakan!')) {
        decl.value = decl.value.replace(/\s*paksakan!\s*/, '')
        decl.important = true
      }
    }
  }
}

plugin.postcss = true

export default plugin
