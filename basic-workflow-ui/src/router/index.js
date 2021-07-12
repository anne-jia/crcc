import Vue from 'vue'
import Router from 'vue-router'
import { Login, Layout, Error401, Error404 } from '@linto/basic-framework'
import { linto } from '@linto/basic-framework'

linto.whiteRoutes = ['/test-page']

Vue.use(Router)

/**
* 路由定义
**/
const constantRouterMap = [
  { path: '/login', component: Login },
  { path: '/404', component: Error404 },
  { path: '/401', component: Error401 },
  {
    path: '/',
    component: Layout,
    name: 'HomePage',
    children: [
      {
        path: 'test-page',
        component: () => import(/* webpackChunkName: "homepage-view" */'@/views/dashboard')
      }, {
        path: 'viewer',
        component: () => import(/* webpackChunkName: "bpmn-viewer" */'@/views/bpmn-viewer'),
      }, {
        path: 'modeler',
        component: () => import(/* webpackChunkName: "flow-mgr" */'@/views/flow-mgr')
      }, {
        path: 'company-flow',
        component: () => import(/* webpackChunkName: "company-flow" */'@/views/company-flow')
      }, {
        path: 'task-process',
        component: () => import(/* webpackChunkName: "task-process" */'@/views/task-process')
      }, {
        path: 'task-list',
        component: () => import(/* webpackChunkName: "task-list" */'@/views/task-list')
      }, {
        path: 'flow-type',
        component: () => import(/* webpackChunkName: "flow-type" */'@/views/flow-type')
      }, {
        path: 'proc-inst-list',
        component: () => import(/* webpackChunkName: "proc-inst-list" */'@/views/proc-insts')
      }, {
        path: 'right-side',
        component: () => import(/* webpackChunkName: "right" */'@/components/lt-container')
      }, {
        path: 'pt',
        component: () => import(/* webpackChunkName: "right" */'@/views/participant/src')
      }]
  },
  { path: '*', redirect: '/404' }
]

export default () => {
  return new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
  })
}
