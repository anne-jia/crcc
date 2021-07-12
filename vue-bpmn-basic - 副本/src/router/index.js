import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);


const routes = [
  {
      path: '/',
      component: () =>
          import ('@/views/bpmn')
  }
]

  export default () => {
    return new Router({
      // mode: 'history', //后端支持可开
      scrollBehavior: () => ({ y: 0 }),
      routes: routes
    })
  }