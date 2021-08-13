'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

// const modeEnv = process.env.NODE_ENV === 'development'
const inIframeModel = require('./src/inIframeModel') 
function resolve(dir) {
  return path.join(__dirname, dir)
}
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");

const name = defaultSettings.title || '子系统demo' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9527 // dev port

const CompressionPlugin = require('compression-webpack-plugin')


module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!r
   * Detail: https://cli.vuejs.org/config/#publicpath
   */

  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      // '/crcc-expert-manage': {
      //   // target: 'http://172.16.96.144:9001/',
      //   target: 'http://36.112.137.17:9001/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '/crcc-expert-manage': ''
      //   }
      // },
      '/crcc-expert-manage': {
        target: 'http://192.168.10.28:9092/',
        changeOrigin: true,
        pathRewrite: {
          '/crcc-expert-manage': ''
        }
      }
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
  
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').use(PreloadWebpackPlugin).tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.module.rule('images')
      .include.add(resolve('src/assets'))
      .end()
      .use('url-loader')
      .clear()
      .end()
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 8192,
        name: '[name].[hash:8].[ext]'
      })
      .end()
    
    config.when(process.env.NODE_ENV !== 'development', config => {
      config.set('externals', inIframeModel.externals)
    })
  }
}
