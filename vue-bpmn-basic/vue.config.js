const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
//css各文件分离，生成的文件 不嵌入bundle.js，而是放在单独的文件里。使用Extract Text Plugin插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  lintOnSave: false,
  publicPath: '../',
  assetsDir:'../',

  chainWebpack: config => {
    config.module.rule('fonts')
    .use('url-loader')
    .tap(args => {
      args.fallback.options.name='fonts/[name].[hash:8].[ext]'

      return args
    }).end(),
    config.module.rule('svg')
    .use('file-loader')
    .options({
      name:'img/[name].[hash:8].[ext]'
    })
    .end(),
    
    // config.module.rule('images')
    // .use('url-loader')
    // .options({
    //   name:'../img/[name].[hash:8].[ext]'
    // })
    // .end(),

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

    config.merge({
      resolve: {
        alias: {
          '@': resolve('src'),
          'assets': resolve('src/assets'),
          'styles':resolve('src/styles')
        },
      },
   
      module: {
        rules: [{
          test: /.(bpmn|xml)$/,
          use: [
            {
              loader: "raw-loader"
            }]
        },
        ]
      },
      plugins: [
        new MiniCssExtractPlugin({
          filename:'css/[name].css'
        })
      ],
    })
    
  }
}