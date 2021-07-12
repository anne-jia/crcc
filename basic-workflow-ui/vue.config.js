const merge = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}
const defaultConfig = {
  externals: {
    'vue-router': 'VueRouter',
    'axios': 'axios'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src'),
      '~api': process.env.VUE_APP_API_TYPE === 'LOCAL' ? resolve('src/apitest') : resolve('src/api')
    }
  },
  plugins: [
    new webpack.NamedChunksPlugin()
  ]
}

module.exports = {
  baseUrl: '',
  outputDir: 'dist',
  // outputDir: '../resources/static/products/workflow',
  css: {
    extract: false
  },
  productionSourceMap: false,
  // eslint-disable-next-line  
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      return merge(defaultConfig, {
        // gzip压缩
        plugins: [new CompressionPlugin({
          test: /\.js$|\.html|\.css/,
          threshold: 102400,
          deleteOriginalAssets: false
        })]
      })
    } else {
      return merge(defaultConfig, {
        // devtool: "eval-source-map"
      })
    }
  },
  chainWebpack: config => {
    config.module
      .rule('svg-sprite')
      .test(/\.(svg)(\?.*)?$/)
      .include
      .add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      });
    config.module
      .rule('svg')
      .exclude
      .add(resolve('src/icons'))
      .end();
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .include
      .add(resolve('src/assets'))
      .end()
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 15360,
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[hash:8].[ext]'
          }
        }
      })
  }
}
