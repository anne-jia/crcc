module.exports = {
  presets: [
    ['@vue/app', {
      polyfills: [
        'es6.promise',
        'es6.symbol'
      ]
    }]
  ],
  "env": {
    "development": {
      "plugins": ["dynamic-import-node"]
    }
  }
}
