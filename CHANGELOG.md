# Change Log

## 2.1.0

### Minor Changes

- 10fdc22: `paksakan!` is now case-insensitive and only matched as the last word of a value, so it is no longer stripped from strings. Property names inside `transition`, `transition-property` and `will-change` are translated (`transisi: lebar 1s` → `transition: width 1s`). `container-name`, `view-transition-name`, `anchor-name` and other name-only properties are left untouched.
- a885bf5: Translate `@media`, `@supports`, `@container` and `@custom-media` conditions (`@media layar dan (lebar-minimal: 600px)` → `@media screen and (min-width: 600px)`) and pseudo-classes/elements (`a:arahkan::sebelum` → `a:hover::before`). Add your own with the new `media` and `selectors` options.
- 78d6eac: Translate function names, e.g. `hitung()` → `calc()` and `gradien-linear()` → `linear-gradient()`. Add your own with the new `functions` option.
- 31515ac: New `warnings` option reports unknown words that look like typos of an Indonesian word (`Unknown property "wrna". Did you mean "warna"?`). The package now ships `css-data.json` for VS Code autocomplete of Indonesian property names, pseudo-classes and pseudo-elements.

## 2.0.0

### Major Changes

- ceb5d2d: Modernize the package:
  
  - **Breaking:** require Node.js 24 or newer.
  - **Breaking:** custom property values (`--foo: merah`) are no longer translated, since they can hold anything.
  - Translate every keyword in a value, including inside functions: `margin: 0 otomatis` → `margin: 0 auto`, `var(--x, merah)` → `var(--x, red)`. Strings, `url()` and author-defined names such as `font-family` are left untouched.
  - Match property names and keywords case-insensitively.
  - New `properties` and `values` options to add or override words.
  - New words: `padat` (solid) and `penyaring` (filter).
  - Rewrite the plugin in TypeScript and ship type declarations.
  - Publish both ES module and CommonJS builds (`import` and `require` both work).
  - Upgrade all development dependencies, switch to pnpm, `node:test`, ESLint flat config and Prettier.

This project adheres to [Semantic Versioning](http://semver.org/).
