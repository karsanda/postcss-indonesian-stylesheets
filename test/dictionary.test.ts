import assert from 'node:assert/strict'
import { test } from 'node:test'
import functions from '../src/functions.ts'
import properties from '../src/properties.ts'
import values from '../src/values.ts'
import type { Translation } from '../src/properties.ts'

// Words that are the same in Indonesian and English
const LOANWORDS = new Set([
  'alias',
  'grid',
  'khaki',
  'lavender',
  'linen',
  'normal',
  'salmon',
  'violet'
])

for (const [name, list] of [
  ['properties', properties],
  ['values', values],
  ['functions', functions]
] as [string, Translation[]][]) {
  test(`${name}: ids are unique`, () => {
    const seen = new Set<string>()
    const duplicates = list.filter(({ id }) => seen.has(id) || !seen.add(id))
    assert.deepEqual(duplicates, [])
  })

  test(`${name}: ids are single lowercase tokens`, () => {
    assert.deepEqual(
      list.filter(({ id }) => !/^[a-z0-9-]+$/.test(id)),
      []
    )
  })

  test(`${name}: no id is another entry's English name`, () => {
    const english = new Map(list.map(({ en, id }) => [en, id]))
    assert.deepEqual(
      list.filter(({ id, en }) => id !== en && english.has(id)),
      []
    )
  })

  test(`${name}: only known loanwords map to themselves`, () => {
    assert.deepEqual(
      list.filter(({ id, en }) => id === en && !LOANWORDS.has(id)),
      []
    )
  })
}
