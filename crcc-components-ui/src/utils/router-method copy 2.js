// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// NProgress.configure({ showSpinner: false }) // NProgress Configuration
// import store from '@/store'
// import Vue from 'vue'
// import Router from 'vue-router'
// Vue.use(Router)

// const createRouter =()=> new Router({
//    // mode: 'history', // require service support
//    scrollBehavior: () => ({ y: 0 }),
//    routes:  [{
//      path: '/401',
//      name: 'Forbidden',
//      component: () => import('@/components/error-page/401.vue'),
//      hidden: true
//    }]
// })

//  export  async function routerBeforeEach(baseComponent,components, files,staticRoutes=[],env) {
//    let getRouters = [];
//     router.beforeEach(async (to, from, next) => {
//       if (!getRouters.length) {
//             // await store.dispatch('user/getInfo');
//          getRouters = await store.dispatch('permission/generateRoutes', { baseComponent, components, files, staticRoutes, env });
//             router.addRoutes(getRouters);
//             const _pathItem = getRouters.filter(
//                item =>
//                  item.path === to.path ||
//                  (item.children && item.children.find(citem => citem.path === to.path))
//              )
//              if (!_pathItem) {
//                const nextPath = getRouters[0].children[0].path
//                next(nextPath)
//              } else {
//                next(to.path)
//              }
//        }
//        else {
//          next()
//        }
//     })
// }




// // 重置路由
// export function resetRouter(router) {
//   const newRouter = createRouter()
//   router.matcher = newRouter.matcher // reset router
// }
// const router = createRouter()

// export default router 



