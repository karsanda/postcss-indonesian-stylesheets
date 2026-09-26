# Change Log

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
