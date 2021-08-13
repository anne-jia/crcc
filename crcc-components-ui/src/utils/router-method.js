import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({ showSpinner: false }) // NProgress Configuration
import store from '@/store'
import Router from 'vue-router'



export default  function createRouter(baseComponent, components, files, promise, staticRoutes = [], env) {
    let  router = new Router({
      // mode: 'history', // require service support
      scrollBehavior: () => ({ y: 0 }),
      routes:  [{
        path: '/401',
        name: 'Forbidden',
        component: () => import('@/components/error-page/401.vue'),
        hidden: true
      }]
    });
  store.dispatch('user/getInfo')
  if (promise && promise instanceof Promise) {
    promise.then(() => {
      addRemoteRouters(router,baseComponent, components, files,staticRoutes, env )
    })
  }
  else {
    addRemoteRouters(router,baseComponent, components, files,staticRoutes, env)
  }
  
  return router;
}

function addRemoteRouters(router,baseComponent, components, files,staticRoutes, env) {
  store.dispatch('permission/generateRoutes', { router, baseComponent, components, files, staticRoutes, env }).then(results => {
    router.addRoutes(results);
  })
}



//重置路由
// export function resetRouter(router) {
//   const newRouter = createRouter()
//   router.matcher = newRouter.matcher // reset router
// }




