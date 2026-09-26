import assert from 'node:assert/strict'
import { test } from 'node:test'
import postcss from 'postcss'
import plugin from '../src/index.ts'
import properties from '../src/properties.ts'
import values from '../src/values.ts'

async function run(input: string, output: string, opts?: plugin.Options) {
  const result = await postcss([plugin(opts)]).process(input, { from: undefined })
  assert.equal(result.css, output)
  assert.equal(result.warnings().length, 0)
}

test('converts properties', async (t) => {
  for (const { id, en } of properties) {
    await t.test(`converts property ${id} to ${en}`, () =>
      run(`a { ${id}: stub-value; }`, `a { ${en}: stub-value; }`)
    )
  }
})

test('converts values', async (t) => {
  for (const { id, en } of values) {
    await t.test(`converts value ${id} to ${en}`, () =>
      run(`a { stub-property: ${id}; }`, `a { stub-property: ${en}; }`)
    )
  }
})

test('converts property and value together', async () => {
  await run('a { warna: merah; }', 'a { color: red; }')
})

test('leaves unknown declarations untouched', async () => {
  await run('a { stub-property: stub-value; }', 'a { stub-property: stub-value; }')
})

test('it will convert paksakan! to !important', async () => {
  await run(
    'a { stub-property: stub-value paksakan!; }',
    'a { stub-property: stub-value !important; }'
  )
})

test('converts every word in a multi-word value', async () => {
  await run('a { margin: 0 otomatis; }', 'a { margin: 0 auto; }')
  await run('a { batas: 1px padat merah; }', 'a { border: 1px solid red; }')
  await run('a { batas: 1px padat merah paksakan!; }', 'a { border: 1px solid red !important; }')
})

test('converts words inside functions', async () => {
  await run('a { warna: var(--x, merah); }', 'a { color: var(--x, red); }')
})

test('matches regardless of case', async () => {
  await run('a { Warna: Merah; }', 'a { color: red; }')
})

test('leaves strings, urls and author-defined names untouched', async () => {
  await run('a { content: "merah"; }', 'a { content: "merah"; }')
  await run('a { background: url(merah.png); }', 'a { background: url(merah.png); }')
  await run('a { font-family: "merah", merah; }', 'a { font-family: "merah", merah; }')
  await run('a { nama-animasi: merah; }', 'a { animation-name: merah; }')
})

test('leaves custom properties untouched', async () => {
  await run('a { --warna: merah; }', 'a { --warna: merah; }')
  await run('a { --warna: merah paksakan!; }', 'a { --warna: merah !important; }')
})

test('accepts extra and overriding words', async () => {
  const opts = {
    properties: { 'Warna-Teks': 'color' },
    values: { 'merah-bata': 'firebrick', merah: 'crimson' }
  }
  await run('a { warna-teks: merah-bata; }', 'a { color: firebrick; }', opts)
  await run('a { warna: merah; }', 'a { color: crimson; }', opts)
  await run('a { warna: merah; }', 'a { color: red; }', {})
})
