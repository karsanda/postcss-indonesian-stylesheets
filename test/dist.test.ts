import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { test } from 'node:test'
import postcss, { type PluginCreator } from 'postcss'

const require = createRequire(import.meta.url)

async function check(plugin: PluginCreator<Record<string, never>>) {
  assert.equal(typeof plugin, 'function')
  assert.equal(plugin.postcss, true)
  const result = await postcss([plugin()]).process('a { warna: merah paksakan!; }', {
    from: undefined
  })
  assert.equal(result.css, 'a { color: red !important; }')
}

test('CommonJS entry exports the plugin directly', async () => {
  await check(require('postcss-indonesian-stylesheets') as PluginCreator<Record<string, never>>)
})

test('ESM entry exports the plugin as default', async () => {
  const { default: plugin } = await import('postcss-indonesian-stylesheets')
  await check(plugin)
})
