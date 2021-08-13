import Vue from 'vue'
import Cookies from 'js-cookie'
import addMessageUtils from '@/utils/message'
import addExceptionUtils from '@/utils/exception'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import ElementUI from 'element-ui'
// import './styles/element-variables.scss'
import '@/styles/index.scss' // global css
// import 'crcc-common-style/dist/@crcc/crcc-common-style.css'
import './utils/request'
// import './utils/forbid'
import './utils/message'
import './utils/exception'
import App from './App'
import store from './store'

// import router from './router'
import './icons' // icon
// improt iconfont file Start
import './icons/iconfont/iconfont.css'



import DlgDraggable from 'vue-element-dialog-draggable'
import * as filters from './filters' // global filters
import moment from 'moment'
import draggable from 'vuedraggable'
import VueUploadComponent from 'vue-upload-component'




import {
  AuthSubjectTable,
  AuthSubjectTableWithOrgTree,
  SystemLogTable,
  SystemLogTableWithTree
} from '@crcc/bootbase-authorization-ui'

Vue.component('AuthSubjectTable', AuthSubjectTable)
Vue.component('AuthSubjectTableWithOrgTree', AuthSubjectTableWithOrgTree)
Vue.component('SystemLogTable', SystemLogTable)
Vue.component('SystemLogTableWithTree', SystemLogTableWithTree)
Vue.use(AuthSubjectTable)
Vue.use(AuthSubjectTableWithOrgTree)
Vue.use(SystemLogTable)
Vue.use(SystemLogTableWithTree)

import {
  crccMatCodeHelpDialog,
  crccMatSortHelpDialog,
  crccOrgTreeHelpDialog
} from '@crcc/crcc-tender-basic-ui'
Vue.component('crccMatCodeHelpDialog', crccMatCodeHelpDialog)
Vue.use(crccMatCodeHelpDialog)
Vue.component('crccMatSortHelpDialog', crccMatSortHelpDialog)
Vue.use(crccMatSortHelpDialog)
Vue.component('crccOrgTreeHelpDialog', crccOrgTreeHelpDialog)
Vue.use(crccOrgTreeHelpDialog)



Vue.component('file-upload', VueUploadComponent)
Vue.use(ElementUI, {
  size: Cookies.get('size') || 'mini' // set element-ui default size
})
Vue.component('draggable', draggable)
addMessageUtils(Vue)
addExceptionUtils(Vue)

// Vue.use(HelpDialog)

Vue.use(DlgDraggable)
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
// baseComponent,components, files,staticRoutes=[],env
import Router from 'vue-router'
Vue.use(Router)

import Layout from '@/layout'
import APP from '@/App'
const files = require.context('@/views', true, /\.vue$/)
const _import = require('@/router/_import_' + process.env.NODE_ENV) // 获取组件的方法
 import '@crcc/crcc_commmon_ui/dist/crcc_commmon_ui.css'
import commmonUi,{router} from  '@crcc/crcc_commmon_ui'
Vue.use(commmonUi)





// Vue.use(router)


 
 
  // router,
 
 
new Vue({
  el: '#app',
  router:router(Layout, _import, files),
  store,
  render: h => h(App)
})
