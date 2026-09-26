import assert from 'node:assert/strict'
import { test } from 'node:test'
import postcss from 'postcss'
import plugin from '../src/index.ts'
import functions from '../src/functions.ts'
import media from '../src/media.ts'
import properties from '../src/properties.ts'
import selectors from '../src/selectors.ts'
import values from '../src/values.ts'

async function run(input: string, output: string, opts?: plugin.Options) {
  const result = await postcss([plugin(opts)]).process(input, { from: undefined })
  assert.equal(result.css, output)
  assert.equal(result.warnings().length, 0)
}

async function warnings(input: string, opts: plugin.Options = { warnings: true }) {
  const result = await postcss([plugin(opts)]).process(input, { from: undefined })
  return result.warnings().map(({ text }) => text)
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

test('converts functions', async (t) => {
  for (const { id, en } of functions) {
    await t.test(`converts function ${id} to ${en}`, () =>
      run(`a { stub-property: ${id}(1px); }`, `a { stub-property: ${en}(1px); }`)
    )
  }
})

test('converts media query words', async (t) => {
  for (const { id, en } of media) {
    await t.test(`converts media word ${id} to ${en}`, () =>
      run(`@media ${id} {}`, `@media ${en} {}`)
    )
  }
})

test('converts pseudo-classes and pseudo-elements', async (t) => {
  for (const { id, en } of selectors) {
    await t.test(`converts selector ${id} to ${en}`, () => run(`a:${id} {}`, `a:${en} {}`))
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

test('paksakan! is case-insensitive and must be a standalone trailing word', async () => {
  await run('a { warna: merah PAKSAKAN! ; }', 'a { color: red !important; }')
  await run('a { content: "paksakan!"; }', 'a { content: "paksakan!"; }')
  await run('a { content: "a paksakan!"; }', 'a { content: "a paksakan!"; }')
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

test('converts property names inside transition and will-change', async () => {
  await run('a { transisi: lebar 1s, warna 2s; }', 'a { transition: width 1s, color 2s; }')
  await run('a { properti-transisi: semua; }', 'a { transition-property: all; }')
  await run('a { akan-berubah: transformasi; }', 'a { will-change: transform; }')
})

test('leaves more author-defined names untouched', async () => {
  await run('a { container-name: merah; }', 'a { container-name: merah; }')
  await run('a { view-transition-name: merah; }', 'a { view-transition-name: merah; }')
})

test('converts function names and their arguments', async () => {
  await run(
    'a { lebar: hitung(100% - 1px); latar-belakang: gradien-linear(merah, biru); }',
    'a { width: calc(100% - 1px); background: linear-gradient(red, blue); }'
  )
  await run('a { transformasi: Translasi-X(1px); }', 'a { transform: translateX(1px); }')
  await run('a { lebar: var(--x); }', 'a { width: var(--x); }')
})

test('converts media queries and other condition at-rules', async () => {
  await run('@media layar dan (lebar-minimal: 600px) {}', '@media screen and (min-width: 600px) {}')
  await run('@media (preferensi-skema-warna: gelap) {}', '@media (prefers-color-scheme: dark) {}')
  await run('@supports (warna: merah) {}', '@supports (color: red) {}')
  await run('@container (lebar > 400px) {}', '@container (width > 400px) {}')
  await run('@LAYER merah {}', '@LAYER merah {}')
})

test('converts selectors, leaving everything but pseudo names alone', async () => {
  await run('a:arahkan::sebelum {}', 'a:hover::before {}')
  await run('a:SEBELUM, b:bukan(:anak-pertama) {}', 'a:before, b:not(:first-child) {}')
  await run('[title=":fokus"] .merah {}', '[title=":fokus"] .merah {}')
  await run('a:hover,\n  b:unknown {}', 'a:hover,\n  b:unknown {}')
  await run('a:arahkan) {}', 'a:arahkan) {}')
})

test('accepts extra function, media and selector words', async () => {
  const opts = {
    functions: { tambah: 'calc' },
    media: { telepon: 'screen' },
    selectors: { disorot: 'hover' }
  }
  await run('a { lebar: tambah(1px); }', 'a { width: calc(1px); }', opts)
  await run('@media telepon {}', '@media screen {}', opts)
  await run('a:disorot {}', 'a:hover {}', opts)
})

test('warns about likely typos when enabled', async () => {
  assert.deepEqual(await warnings('a { wrna: mrah; lebar: hitng(1px); }'), [
    'Unknown property "wrna". Did you mean "warna"?',
    'Unknown word "mrah". Did you mean "merah"?',
    'Unknown function "hitng". Did you mean "hitung"?'
  ])
  assert.deepEqual(await warnings('@media layr {} a:arahkn {}'), [
    'Unknown word "layr". Did you mean "layar"?',
    'Unknown selector "arahkn". Did you mean "arahkan"?'
  ])
})

test('does not warn about English, numbers or unrelated words', async () => {
  assert.deepEqual(
    await warnings('a { color: red; stub-property: 1px #fff -x qwertyuiop; } a:hover {}'),
    []
  )
  assert.deepEqual(await warnings('a { wrna: mrah; }', {}), [])
})
