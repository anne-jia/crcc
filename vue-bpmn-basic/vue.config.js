const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
//css各文件分离，生成的文件 不嵌入bundle.js，而是放在单独的文件里。使用Extract Text Plugin插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  lintOnSave: false,
  publicPath: '../',
  assetsDir:'/',

  chainWebpack: config => {
   const fontsRule= config.module.rule('fonts')
    fontsRule.uses.clear();

    fontsRule.use('url-loader')
      .loader('url-loader')
      .options({
        limit: 4096,
      })
      .end()
     .use("file-loader")
      .loader('file-loader')
        .options({
        name:'[name].[hash:8].[ext]',
        outputPath:'fonts/'
      }).end()


    config.module.rule('svg')
    .use('url-loader')
        .loader('url-loader')
        .options({
          limit: 4096,
          outputPath:'img/'
        })
        .end()
        .use("file-loader")
        .loader('file-loader')
          .options({
          name:'[name].[hash:8].[ext]',
          outputPath:'img/'
        }).end()

    
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
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 4096,
      })
      .end()
      .use("file-loader")
      .loader('file-loader')
        .options({
        name:'[name].[hash:8].[ext]',
        outputPath:'img/'
      }).end()

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