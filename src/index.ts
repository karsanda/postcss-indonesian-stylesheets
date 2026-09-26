import type { Plugin } from 'postcss'
import valueParser from 'postcss-value-parser'
import properties from './properties.ts'
import values from './values.ts'

const basePropertyMap = new Map(properties.map(({ id, en }) => [id, en]))
const baseValueMap = new Map(values.map(({ id, en }) => [id, en]))

// Properties whose values are author-defined names, not CSS keywords
const identifierProperties = new Set([
  'animation-name',
  'counter-increment',
  'counter-reset',
  'font-family',
  'grid-area',
  'grid-template-areas'
])

function extend(base: Map<string, string>, extra: Record<string, string> = {}) {
  const entries = Object.entries(extra)
  if (entries.length === 0) return base
  const map = new Map(base)
  for (const [id, en] of entries) map.set(id.toLowerCase(), en)
  return map
}

function translateValue(value: string, valueMap: Map<string, string>) {
  const parsed = valueParser(value)
  let changed = false

  parsed.walk((node) => {
    if (node.type === 'function' && node.value.toLowerCase() === 'url') return false
    if (node.type !== 'word') return

    const en = valueMap.get(node.value.toLowerCase())
    if (en !== undefined && en !== node.value) {
      node.value = en
      changed = true
    }
  })

  return changed ? valueParser.stringify(parsed.nodes) : value
}

function plugin(opts: plugin.Options = {}): Plugin {
  const propertyMap = extend(basePropertyMap, opts.properties)
  const valueMap = extend(baseValueMap, opts.values)

  return {
    postcssPlugin: 'postcss-indonesian-stylesheets',
    Declaration(decl) {
      if (decl.value.includes('paksakan!')) {
        decl.value = decl.value.replace(/\s*paksakan!\s*/, '')
        decl.important = true
      }

      if (decl.prop.startsWith('--')) return

      decl.prop = propertyMap.get(decl.prop.toLowerCase()) ?? decl.prop

      if (!identifierProperties.has(decl.prop)) {
        decl.value = translateValue(decl.value, valueMap)
      }
    }
  }
}

plugin.postcss = true as const

// eslint-disable-next-line @typescript-eslint/no-namespace -- merges Options into the CJS `export =` types
declare namespace plugin {
  export interface Options {
    /** Extra or overriding property names, keyed Indonesian → English. */
    properties?: Record<string, string>
    /** Extra or overriding value keywords, keyed Indonesian → English. */
    values?: Record<string, string>
  }
}

export default plugin
