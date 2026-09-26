# postcss-indonesian-stylesheets

[PostCSS] plugin for writing CSS in Indonesian.

[PostCSS]: https://github.com/postcss/postcss

```css
.foo {
  /* Input example */
  a {
    warna: merah paksakan!;
  }
}
```

```css
.foo {
  /* Output example */
  a {
    color: red !important;
  }
}
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-indonesian-stylesheets
# or
pnpm add -D postcss postcss-indonesian-stylesheets
```

Requires Node.js 24 or newer.

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-indonesian-stylesheets'),
    require('autoprefixer')
  ]
}
```

The plugin ships ES module and CommonJS builds with TypeScript types, so ESM configs work too:

```js
// postcss.config.mjs
import indonesian from 'postcss-indonesian-stylesheets'

export default {
  plugins: [indonesian()]
}
```

[official docs]: https://github.com/postcss/postcss#usage

## How it works

- Property names and every keyword in a value are translated, including keywords inside
  functions: `margin: 0 otomatis` → `margin: 0 auto`, `var(--x, merah)` → `var(--x, red)`.
- Property names in `transition`, `transition-property` and `will-change` are translated:
  `transisi: lebar 1s` → `transition: width 1s`.
- Matching is case-insensitive.
- `paksakan!` at the end of a value becomes `!important`.
- Strings, `url()`, custom property values (`--foo: merah`) and author-defined names
  (`font-family`, `animation-name`, `grid-area`, `grid-template-areas`, `counter-*`,
  `container-name`, `view-transition-name`, `anchor-name`, …) are left untouched.
  Names inside shorthands such as `animation` or `container` are still translated if they
  happen to be dictionary words.
- Unknown words pass through unchanged, so Indonesian and English can be mixed freely.

## Options

Add your own words or override the built-in ones. Keys are the Indonesian words, values are the CSS they become:

```js
indonesian({
  properties: { 'warna-teks': 'color' },
  values: { 'merah-bata': 'firebrick' }
})
```

## Dictionary

See [DICTIONARY.md](DICTIONARY.md) for every supported property and value.

## Contributing

`postcss-indonesian-stylesheets` doesn't cover all CSS properties and values in Indonesian.
Any help in translating and adding more Indonesian word for properties and values is always appreciated.
Add words to `src/properties.ts` or `src/values.ts`, then run `pnpm dictionary` to regenerate `DICTIONARY.md`,
or [suggest a translation](https://github.com/karsanda/postcss-indonesian-stylesheets/issues/new?template=translation.yml).

### Development

This project uses [pnpm](https://pnpm.io) and Node.js 24+.

```sh
pnpm install
pnpm test        # unit tests with a 100% coverage gate
pnpm lint        # ESLint + Prettier check
pnpm format      # apply Prettier
pnpm dictionary  # regenerate DICTIONARY.md after editing the word lists
pnpm verify      # everything CI runs: lint, typecheck, tests, build, package checks
pnpm changeset   # describe your change for the next release
```
