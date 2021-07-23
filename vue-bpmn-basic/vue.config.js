const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
//css各文件分离，生成的文件 不嵌入bundle.js，而是放在单独的文件里。使用Extract Text Plugin插件
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  lintOnSave: false,
  publicPath: '/',
  chainWebpack: config => {
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
          {
            test: /\.svg$/,
            include: [resolve('src/icons')],
            use: [
              {
                loader: "svg-sprite-loader",
                options:({
                  symbolId: 'icon-[name]'
                })
              }]
    
          },
          {
            test: /\.(sass|scss)$/,
            use:ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: ['sass-loader','css-loader'],
              
            }),
          },
          {
            test: /\.css$/,
            use:ExtractTextPlugin.extract({
              fallback:"style-loader",
              use: ["css-loader"],
            }),
          },
          {
            test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
            use: {
              loader: "file-loader",
              options: {
                esModule: false, // 这里设置为false
                outputPath: "fonts/", // 指定图片输入的文件夹，打包地址是 “/dist/fonts/字体文件”
                publicPath: "../fonts", // 指定字体的路径，即打包结果引入的地址是 "/fonts/字体文件名"
              }
            }
          },
          {
            test: /\.(png|jpg|gif)$/,
            use: [
              {
                loader: "url-loader",
                options: {
                  esModule: false, // 这里设置为false
                  outputPath: "images/", // 指定图片输入的文件夹， 打包地址是 “/dist/images/图片名字”
                  publicPath: "/images", // 指定获取图片的路径，即打包结果引入的地址是 "/images/图片名字"
                  // limit  (如果小于 8K ，则转为base64，否则返回一个url地址)
                  limit: 8192,
                  name: "[name].[hash:8].[ext]" // 输入的图片名
                }
              }
            ]
          }
        ]
      },
      plugins: [
        new ExtractTextPlugin('css/[name].css')
      ],
    })
    
  }
}