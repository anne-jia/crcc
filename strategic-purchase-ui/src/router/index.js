import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import Layout from '@/layout'

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
export const constantRoutes = [{
  path: '/401',
  name: 'Forbidden',
  meta: {
    title: '401'
  },
  hidden: true,
  component: () => import('@/views/error-page/401.vue')
}]
export const errorRouter = [{
  path: '*',
  redirect: '/404',
  hidden: true,
  component: () => import('@/views/error-page/404.vue'),
  children: [{
    path: '/404',
    name: '404',
    hidden: true,
    meta: {
      title: '404'
    },
    component: () => import('@/views/error-page/404.vue')
  }]
}]
// export const signUpRouter = [{
//     path: '/',
//     redirect: '/signup',
//     component: () => import('@/views/signUp'),
//     hidden: true,
//     children: [{
//       path: '/signup',
//       name: 'signUp',
//       component: () => import('@/views/signUp'),
//       meta: {
//         title: '登记',
//         icon: 'home'
//       }
//     }]
//   }

// ]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/',
    redirect: '/stratepurchase/framework',
    hidden: false,
    component: Layout,
    name: 'frameworkName',
    meta: {
      title: '框架协议'
    },
    children: [{
      path: '/stratepurchase/framework',
      name: 'framework',
      hidden: false,
      meta: {
        title: 'framework'
      },
      component: () => import('@/views/purplan-framework/Framework')
    }]
  }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
