const path = require('path')

const resolve = dir => path.join(__dirname, dir)

module.exports = {
    lintOnSave:false,
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('styles', resolve('src/styles'))
            .end()
        config.module
            .rule('raw-loader')
            .test(/.(bpmn|xml)$/)
            .use('raw-loader')
            .loader('raw-loader')
            // .options({
            //     esModule: true
            // })
            .end()
        
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
      
       
    }
}