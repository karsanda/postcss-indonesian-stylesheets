---
'postcss-indonesian-stylesheets': major
---

Modernize the package:

- **Breaking:** require Node.js 24 or newer.
- Rewrite the plugin in TypeScript and ship type declarations.
- Publish both ES module and CommonJS builds (`import` and `require` both work).
- Look up properties and values with a `Map` instead of scanning the lists for every declaration.
- Upgrade all development dependencies, switch to pnpm, `node:test`, ESLint flat config and Prettier.
