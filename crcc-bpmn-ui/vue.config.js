// 'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
// const webpack = require('webpack')
const inIframeStyle = process.env.VUE_APP_IFRAME_STYLE === 'in-iframe'
// const modeEnv = process.env.NODE_ENV === 'development'
const inIframeModel = inIframeStyle ? require('./src/inIframeModel') : ''
function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || '流程系统' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9527 // dev port

const CompressionPlugin = require('compression-webpack-plugin')
// All configuration item explanations can be find in https://cli.vuejs.org/config/
const outputDir = inIframeStyle
  ? 'D://Programs//nginx//nginx-1.17.9//nginx-1.17.9//html//dist//projects//crcc-manage'
  : 'dist'
const publicPath = inIframeStyle ? '/projects/crcc-manage/' : '/'

module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!r
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: publicPath,
  outputDir: outputDir,
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
    
      '/purchase/purchase-workflow-engine-server': {
        target: 'http://linkecc.com:9999/',
        changeOrigin: true,
      },
    
      '/crcc-process': {
        target: 'http://172.16.96.126:9090/',
        changeOrigin: true,
        pathRewrite: {
          '/crcc-process': ''
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
    plugins: [
      new CompressionPlugin({
        test: /\.js$|\.html|\.css/,
        threshold: 102400,
        deleteOriginalAssets: false
      })
    ]
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
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

    config.when(process.env.NODE_ENV !== 'development', config => {
      config.when(inIframeStyle, config => {
        config.set('externals', inIframeModel.externals)
        config.plugin('html').tap(args => {
          args[0].modelPath = inIframeModel.modelPath
          return args
        })
      })

      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk('single')
    })
  }
}
