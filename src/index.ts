import type { Plugin } from 'postcss'
import valueParser from 'postcss-value-parser'
import properties from './properties.ts'
import values from './values.ts'

const basePropertyMap = new Map(properties.map(({ id, en }) => [id, en]))
const baseValueMap = new Map(values.map(({ id, en }) => [id, en]))

const IMPORTANT = 'paksakan!'

// Properties whose values are author-defined names, not CSS keywords
const identifierProperties = new Set([
  'anchor-name',
  'animation-name',
  'container-name',
  'counter-increment',
  'counter-reset',
  'font-family',
  'grid-area',
  'grid-template-areas',
  'position-anchor',
  'scroll-timeline-name',
  'timeline-scope',
  'view-timeline-name',
  'view-transition-name'
])

// Properties whose values name other properties
const propertyListProperties = new Set(['transition', 'transition-property', 'will-change'])

type Dictionary = Map<string, string>

function extend(base: Dictionary, extra: Record<string, string> = {}) {
  const entries = Object.entries(extra)
  if (entries.length === 0) return base
  const map = new Map(base)
  for (const [id, en] of entries) map.set(id.toLowerCase(), en)
  return map
}

function lookup(word: string, dictionaries: Dictionary[]) {
  const key = word.toLowerCase()
  for (const dictionary of dictionaries) {
    const en = dictionary.get(key)
    if (en !== undefined) return en
  }
}

function stripImportant(value: string) {
  const trimmed = value.trimEnd()
  if (!trimmed.toLowerCase().endsWith(IMPORTANT)) return
  // Only a standalone trailing word, so "…paksakan!" inside a string is left alone
  const before = trimmed.at(-IMPORTANT.length - 1)
  if (before !== undefined && !/\s/.test(before)) return
  return trimmed.slice(0, -IMPORTANT.length).trimEnd()
}

function translateValue(value: string, words: Dictionary[]) {
  const parsed = valueParser(value)
  let changed = false

  parsed.walk((node) => {
    if (node.type === 'function' && node.value.toLowerCase() === 'url') return false
    if (node.type !== 'word') return

    const en = lookup(node.value, words)
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
      const withoutImportant = stripImportant(decl.value)
      if (withoutImportant !== undefined) {
        decl.value = withoutImportant
        decl.important = true
      }

      if (decl.prop.startsWith('--')) return

      decl.prop = propertyMap.get(decl.prop.toLowerCase()) ?? decl.prop

      if (identifierProperties.has(decl.prop)) return

      const words = propertyListProperties.has(decl.prop) ? [propertyMap, valueMap] : [valueMap]
      decl.value = translateValue(decl.value, words)
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
