import Vue from 'vue'

import Cookies from 'js-cookie'
import addMessageUtils from '@/utils/message'
import addExceptionUtils from '@/utils/exception'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import ElementUI from 'element-ui'
import './styles/element-variables.scss'
import '@/styles/index.scss' // global css
// improt iconfont file Start
import './icons/iconfont/iconfont.css'
// import iconfont file End
import './utils/request'
import './utils/forbid'
import './utils/message'
import './utils/exception'
import App from './App'
import store from './store'

import router from './router/index'
import './icons' // icon
import './permission' // permission control
import DlgDraggable from 'vue-element-dialog-draggable'
import elDragDialog from  '@/directive/el-drag-dialog/index'

import * as filters from './filters' // global filters
import moment from 'moment'
import AuthorizationUI from '@crcc/bootbase-authorization-ui'
import draggable from 'vuedraggable'
import Pagination from '@/components/Pagination'
import VueUploadComponent from 'vue-upload-component'
Vue.component('file-upload', VueUploadComponent)
Vue.component('el-drag-dialog', elDragDialog)

Vue.component('pagination', Pagination)

Vue.use(ElementUI, {
  size: Cookies.get('size') || 'mini' // set element-ui default size
})
Vue.component('draggable', draggable)
addMessageUtils(Vue)
addExceptionUtils(Vue)
Vue.use(DlgDraggable)
Vue.use(elDragDialog)
Vue.use(AuthorizationUI)
Vue.prototype.$moment = moment
Vue.prototype.validSpecialChar = function(value) {
  value = value.replace(/[`～*~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/g, '').replace(/\s/g, '')
  return value
}
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  // const { mockXHR } = require('../mock')
  // mockXHR()
}

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

Vue.filter('filterCapital', function(capi) {
  if (!capi) return '-'
  // 添加千位符
  var res = capi.toString().replace(/\d+/, function(n) { // 先提取整数部分
    return n.replace(/(\d)(?=(\d{3})+$)/g, function($1) {
      return $1 + ','
    })
  })
  return res
})
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
