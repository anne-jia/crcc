
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  title: 'vue-base模板工程使用说明',
  description: 'vue-base模板工程使用说明',
  themeConfig: {
    sidebarDepth: 2,
    nav: [
      { text: '首页', link: '/' },
    ],
    sidebar: [
      ['/模板基本介绍', '快速上手'],
      ['/框架使用注意要点说明', '框架使用注意要点说明'],
      ['/axios的http请求使用说明', 'axios的http请求使用说明'],
      ['/自定义组件使用说明', '自定义组件使用说明'],
      ['/基于session认证方式使用说明', '基于session认证方式使用说明'],
      ['/基于Token的认证方式使用说明', '基于Token的认证方式使用说明']
    ],
    repo: 'https://gitee.com/',
    repoLabel: '码云仓库'
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@docs': resolve('docs')
      }
    }
  }
}
