import Vue from 'vue'
import Cookies from 'js-cookie'
import addMessageUtils from '@/utils/message'
import addExceptionUtils from '@/utils/exception'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import ElementUI from 'element-ui'
import './styles/element-variables.scss'
import '@/styles/index.scss' // global css
// import 'crcc-common-style/dist/@crcc/crcc-common-style.css'
import './utils/request'

import './utils/message'
import './utils/exception'
import App from './App'
import store from './store'

// import router from './router'
import './icons' // icon
const asyncRoutes = [
  {
    path: '/',
    redirect: '/stratepurchase/framework',
    hidden: false,
    component: Layout,
    children: [{
      path: '/stratepurchase/framework',
      name: 'framework',
      hidden: false,
      meta: {
        title: 'framework'
      },
      component: () => import('@/views/purplan-framework/Framework')
    },
    {
      path: '/stratepurchase/purchase',
      name: 'purchase',
      hidden: false,
      meta: {
        title: 'purchase'
      },
      component: () => import('@/views/rocess-defenition/index')
    }
    ]
  }
]
import Router from 'vue-router'
Vue.use(Router)
import Layout from '@/layout'
import APP from '@/App'
const files = require.context('@/views', true, /\.vue$/)
const _import = require('@/router/_import_' + process.env.NODE_ENV) // 获取组件的方法

import  createRouter from '@/utils/router-method.js'




import * as filters from './filters' // global filters
import moment from 'moment'



Vue.use(ElementUI, {
  size: Cookies.get('size') || 'mini' // set element-ui default size
})
addMessageUtils(Vue)
addExceptionUtils(Vue)




Vue.prototype.$moment = moment
Vue.prototype.validSpecialChar = function(value) {
  value = value
    .replace(
      /[`～*~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/g,
      ''
    )
    .replace(/\s/g, '')
  return value
}



// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router:createRouter(Layout, _import, files, asyncRoutes),
  store,
  render: h => h(App)
})
