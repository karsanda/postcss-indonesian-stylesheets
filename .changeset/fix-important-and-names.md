---
'postcss-indonesian-stylesheets': minor
---

`paksakan!` is now case-insensitive and only matched as the last word of a value, so it is no longer stripped from strings. Property names inside `transition`, `transition-property` and `will-change` are translated (`transisi: lebar 1s` → `transition: width 1s`). `container-name`, `view-transition-name`, `anchor-name` and other name-only properties are left untouched.
