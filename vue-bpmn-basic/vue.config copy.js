const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
//css各文件分离，生成的文件 不嵌入bundle.js，而是放在单独的文件里。使用Extract Text Plugin插件
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  lintOnSave: false,
  publicPath: '/',
  assetsDir: 'static',
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
              use: ['css-loader', 'sass-loader'],
              options:{ // 这里的options选项参数可以定义多大的图片转换为base64
                name: path.posix.join('static', '[name].[hash].[ext]')
              },
            }),
          },
          {
            test: /\.css$/,
            use:ExtractTextPlugin.extract({
              fallback:"style-loader",
              use: ["css-loader"],
            }),
            generator: {
              filename: 'static/[hash][ext]',
            },
          },
          {
            test:/.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
            use:[{
                loader:'url-loader',
                options:{ // 这里的options选项参数可以定义多大的图片转换为base64
                    limit:50000, // 表示小于50kb的图片转为base64,大于50kb的是路径
                    name: path.posix.join('static', '[name].[hash].[ext]')
              },
            
            }]
        }
        ]
      },
      plugins: [
        new ExtractTextPlugin('css/[name].css')
      ],
    })
    
  }
}