const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    proxy: 'http://localhost:80'
  },
  transpileDependencies: [
    'vuetify'
  ]
})
