import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { test } from 'node:test'
import postcss from 'postcss'
import type plugin from '../src/index.ts'

type Plugin = typeof plugin

// Resolved at runtime through package.json "exports", so this runs against dist/.
// A variable keeps tsc from needing dist/ types before the build.
const entry = 'postcss-indonesian-stylesheets'
const require = createRequire(import.meta.url)

async function check(plugin: Plugin) {
  assert.equal(typeof plugin, 'function')
  assert.equal(plugin.postcss, true)
  const result = await postcss([plugin()]).process('a { warna: merah paksakan!; }', {
    from: undefined
  })
  assert.equal(result.css, 'a { color: red !important; }')
}

test('CommonJS entry exports the plugin directly', async () => {
  await check(require(entry) as Plugin)
})

test('ESM entry exports the plugin as default', async () => {
  const { default: plugin } = (await import(entry)) as { default: Plugin }
  await check(plugin)
})
