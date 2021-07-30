import Vue from 'vue'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import ElementUI from 'element-ui'
// import bpmnBasic from "@crcc/bpmn-basic"
import './styles/element-variables.scss'
import '@/styles/index.scss' // global css
import './icons' // icon
//bpmn style
import 'normalize.css/normalize.css'


import './permission' // permission control
import '@crcc/bpmn-basic/dist/bpmn-basic.css'

import Cookies from 'js-cookie'
import addMessageUtils from '@/utils/message'
import addExceptionUtils from '@/utils/exception'
import './utils/request'
import './utils/forbid'
import './utils/message'
import './utils/exception'
import * as filters from './filters' // global filters

import DlgDraggable from 'vue-element-dialog-draggable'
import draggable from 'vuedraggable'
import elDragDialog from '@/directive/el-drag-dialog/index'
// import WorkflowModeler from '@/vue-bpmn-basic'

import moment from 'moment'

import Pagination from '@/components/Pagination'
import crccMain from '@/components/crcc-main'
import VueUploadComponent from 'vue-upload-component'

Vue.component('file-upload', VueUploadComponent)
Vue.component('pagination', Pagination)
Vue.component('crcc-main', crccMain)


Vue.component('draggable', draggable)
Vue.component('el-drag-dialog', elDragDialog)
addMessageUtils(Vue)
addExceptionUtils(Vue)


Vue.use(ElementUI, {
  size: Cookies.get('size') || 'mini' // set element-ui default size
})

Vue.use(DlgDraggable)
// Vue.use(bpmnBasic)
Vue.use(elDragDialog)
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