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
```

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

[official docs]: https://github.com/postcss/postcss#usage

### Documentations
- [CSS Properties](https://github.com/karsanda/postcss-indonesian-stylesheets/blob/main/properties.js)  
- [CSS Values](https://github.com/karsanda/postcss-indonesian-stylesheets/blob/main/values.js)  

### Contributing
`postcss-indonesian-stylesheets` doesn't cover all CSS properties and values in Indonesian. 
Any help in translating and adding more Indonesian word for properties and values is always appreciated.
