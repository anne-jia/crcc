import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import Framework from '@linto/basic-framework' // 基础框架组件
import App from './App'
import createRouter from './router'
import createStore from './store'
import '@/icons' // icon
import { permissionRegistry } from '@linto/basic-framework' // 权限
import '@/styles/index.scss' // global css
import BaseComponent from '@linto/basic-components'

Vue.use(ElementUI, { size: 'mini', locale })
Vue.use(Framework)
Vue.use(BaseComponent)
Vue.config.productionTip = false

export default () => {
  const router = createRouter()
  const store = createStore()
  permissionRegistry(router, store, 'WorkFlow')
  Vue.$appStore = store
  Vue.$appRouter = router
  const app = new Vue({
    router,
    store,
    render: h => h(App),
    created() {
      // 自定义公司名称，默认 '凌韬（济南）信息科技有限责任公司'
      // this.$store.dispatch('SetCompany', '') // 清空
      // this.$store.dispatch('SetCompany', '阿里巴巴') // 自定义

      // fix bug: IE 下手工修改或通过 href 修改hash，未触发路由跳转
      if ('-ms-scroll-limit' in document.documentElement.style
        && '-ms-ime-align' in document.documentElement.style) { // detect it's IE11
        window.addEventListener("hashchange", () => {
          var currentPath = window.location.hash.slice(1);
          if (this.$route.path !== currentPath) {
            this.$router.push(currentPath)
          }
        }, false)
      }
    }
  })

  return { app, router, store }
}
