const postcss = require('postcss')
const plugin = require('./')
const properties = require('./properties')
const values = require('./values')

async function run (input, output, opts = { }) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

test.each(properties)('converts property $id to $en', async ({ id, en }) => {
  await run(`a { ${id}: stub-value; }`, `a { ${en}: stub-value; }`, { })
})

test.each(values)('converts value in $id to $en', async ({ id, en }) => {
  await run(`a { stub-property: ${id}; }`, `a { stub-property: ${en}; }`, { })
})

test('it will convert paksakan! to !important', async () => {
  await run('a { stub-property: stub-value paksakan!; }', 'a { stub-property: stub-value !important; }', {})
})
