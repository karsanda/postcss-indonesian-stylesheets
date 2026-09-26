import assert from 'node:assert/strict'
import { test } from 'node:test'
import postcss from 'postcss'
import plugin from '../src/index.ts'
import properties from '../src/properties.ts'
import values from '../src/values.ts'

async function run(input: string, output: string) {
  const result = await postcss([plugin()]).process(input, { from: undefined })
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
