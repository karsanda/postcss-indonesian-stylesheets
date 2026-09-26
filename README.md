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

## Documentations

- [CSS Properties](https://github.com/karsanda/postcss-indonesian-stylesheets/blob/main/src/properties.ts)
- [CSS Values](https://github.com/karsanda/postcss-indonesian-stylesheets/blob/main/src/values.ts)

## Contributing

`postcss-indonesian-stylesheets` doesn't cover all CSS properties and values in Indonesian.
Any help in translating and adding more Indonesian word for properties and values is always appreciated.

### Development

This project uses [pnpm](https://pnpm.io) and Node.js 24+.

```sh
pnpm install
pnpm test        # unit tests with a 100% coverage gate
pnpm lint        # ESLint + Prettier check
pnpm format      # apply Prettier
pnpm verify      # everything CI runs: lint, typecheck, tests, build, package checks
pnpm changeset   # describe your change for the next release
```
