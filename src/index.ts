import type { Plugin } from 'postcss'
import selectorParser from 'postcss-selector-parser'
import valueParser from 'postcss-value-parser'
import functions from './functions.ts'
import media from './media.ts'
import properties from './properties.ts'
import type { Translation } from './properties.ts'
import selectors from './selectors.ts'
import values from './values.ts'

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

// At-rules whose params are media queries or declaration conditions
const conditionAtRules = new Set(['container', 'custom-media', 'media', 'supports'])

type Dictionary = Map<string, string>

function toMap(list: Translation[], extra: Record<string, string> = {}): Dictionary {
  const map = new Map(list.map(({ id, en }) => [id, en]))
  for (const [id, en] of Object.entries(extra)) map.set(id.toLowerCase(), en)
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

function translateValue(value: string, words: Dictionary[], fns: Dictionary[]) {
  const parsed = valueParser(value)
  let changed = false

  parsed.walk((node) => {
    if (node.type !== 'word' && node.type !== 'function') return
    if (node.type === 'function' && node.value.toLowerCase() === 'url') return false

    const en = lookup(node.value, node.type === 'word' ? words : fns)
    if (en !== undefined && en !== node.value) {
      node.value = en
      changed = true
    }
  })

  return changed ? valueParser.stringify(parsed.nodes) : value
}

function plugin(opts: plugin.Options = {}): Plugin {
  const propertyMap = toMap(properties, opts.properties)
  const valueMap = toMap(values, opts.values)
  const functionMap = toMap(functions, opts.functions)
  const mediaMap = toMap(media, opts.media)
  const selectorMap = toMap(selectors, opts.selectors)

  return {
    postcssPlugin: 'postcss-indonesian-stylesheets',
    Declaration(decl) {
      const withoutImportant = stripImportant(decl.value)
      if (withoutImportant !== undefined) {
        decl.value = withoutImportant
        decl.important = true
      }

      if (decl.prop.startsWith('--')) return

      decl.prop = lookup(decl.prop, [propertyMap]) ?? decl.prop

      if (identifierProperties.has(decl.prop)) return

      const words = propertyListProperties.has(decl.prop) ? [propertyMap, valueMap] : [valueMap]
      decl.value = translateValue(decl.value, words, [functionMap])
    },
    AtRule(atRule) {
      if (!conditionAtRules.has(atRule.name.toLowerCase())) return
      atRule.params = translateValue(
        atRule.params,
        [mediaMap, propertyMap, valueMap],
        [functionMap]
      )
    },
    Rule(rule) {
      if (!rule.selector.includes(':')) return

      let changed = false
      const processor = selectorParser((root) => {
        root.walkPseudos((pseudo) => {
          const colons = pseudo.value.startsWith('::') ? '::' : ':'
          const name = pseudo.value.slice(colons.length)
          const en = lookup(name, [selectorMap])
          if (en !== undefined && en !== name) {
            pseudo.value = colons + en
            changed = true
          }
        })
      })

      let selector: string
      try {
        selector = processor.processSync(rule.selector)
      } catch {
        return // Leave selectors the parser can't read for other tools to report
      }
      if (changed) rule.selector = selector
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
    /** Extra or overriding function names, keyed Indonesian → English. */
    functions?: Record<string, string>
    /** Extra or overriding media query words, keyed Indonesian → English. */
    media?: Record<string, string>
    /** Extra or overriding pseudo-class and pseudo-element names, keyed Indonesian → English. */
    selectors?: Record<string, string>
  }
}

export default plugin
