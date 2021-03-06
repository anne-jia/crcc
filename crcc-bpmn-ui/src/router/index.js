import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'


Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/401',
    name: 'Forbidden',
    component: () => import('@/views/error-page/401'),
    hidden: true
  }
]
export const errorRouter = [
  {
    path: '*',
    redirect: '/404',
    hidden: true,
    component: () => import('@/views/error-page/404.vue'),
    children: [
      {
        path: '/404',
        name: '404',
        hidden: true,
        meta: {
          title: '404'
        },
        component: () => import('@/views/error-page/404.vue')
      }
    ]
  }
]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [{
  "path": "/",
  "component": Layout,
  "isHomePage": false,
  "name": "invoice",
  "redirect": "/WorkFlow",
  "meta": {
    "title": "??????",
    "icon": "fold2",
    "affix": true
  },
  "children": [
    {
      "path": "/home",
      "component": () => import('@/views/home/index'),
      "name": "home",
      "meta": {
        "title": "??????",
        "icon": "0",
        "affix": true
      }
    },
    {
      "path": "/icons",
      "component": () => import('@/views/demo/icons/index'),
      "name": "icons",
      "meta": {
        "title": "??????",
        "icon": "0",
        "affix": true
      }
    },{
      "path": "/demo",
      "component": () => import('@/views/demo/use-bpmn/index.vue'),
      "name": "demo",
      "meta": {
        "title": "demo",
        "icon": "0",
        "affix": true
      }
    },{
      "path": "/demoView",
      "component": () => import('@/views/demo/bpmn-view/index.vue'),
      "name": "demoView",
      "meta": {
        "title": "demoView",
        "icon": "0",
        "affix": true
      }
    }
  ]
},{
  "path": "/WorkFlow",
  "component": Layout,
  "isHomePage": false,
  "name": "WorkFlow",
  "redirect": "/WorkFlow/ProcessTypes",
  "meta": {
    "title": "????????????",
    "icon": "fold2",
    "affix": true
  },
  "children": [
    {
      "path": "/WorkFlow/ProcessTypes",
      "component": () => import('@/views/process-types/index'),
      "name": "ProcessTypes",
      "meta": {
        "title": "????????????",
        "icon": "0",
        "affix": true
      }
    },
    {
      "path": "/WorkFlow/ProcessDefinition",
      "component": () => import('@/views/process-definition/index'),
      "name": "ProcessDefinition",
      "meta": {
        "title": "????????????",
        "icon": "0",
        "affix": true
      }
    },
    {
      "path": "/WorkFlow/processPermissions",
      "component": () => import('@/views/process-permissions/index'),
      "name": "processPermissions",
      "meta": {
        "title": "????????????",
        "icon": "0",
        "affix": true
      }
    },
    {
      "path": "/WorkFlow/ProcessTaskList",
      "component": () => import('@/views/process-task-list/index'),
      "name": "ProcessTaskList",
      "meta": {
        "title": "????????????",
        "icon": "0",
        "affix": true
      }
    },
    {
      "path": "/WorkFlow/ProcessInstanceList",
      "component": () => import('@/views/process-instance-list/index'),
      "name": "ProcessInstanceList",
      "meta": {
        "title": "????????????",
        "icon": "0",
        "affix": true
      }
    }
    
  ]
},]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
