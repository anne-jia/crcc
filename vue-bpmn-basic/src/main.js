import Vue from 'vue'
import App from './App.vue'
import createRouter from './router'
import './package'
import bpmnBasic from './index'
Vue.use(bpmnBasic)

Vue.config.productionTip = false
const router = createRouter();
Vue.$appRouter = router

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
