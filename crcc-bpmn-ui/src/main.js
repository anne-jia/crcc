import Vue from 'vue'
import './package'
import bpmnComponents from './index'
console.log(bpmnComponents,'bpmnComponents')

Vue.config.productionTip = false
import App from './App'
import store from './store'
import router from './router'
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
