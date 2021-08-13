// import router from './router'
// import store from './store'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import defaultSettings from './settings'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration
// let getRouters = [];

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()
//   // set page title
//   document.title = `${to.meta.title}-${defaultSettings.title}`
//   if (to.path == '/401') {
//     next()
//     return false
//   }
//   //  const hasPermission= await store.dispatch('permission/hasPermission')
//     const hasPermission = true 
//     if (!hasPermission) {
//       next('/401')
//       return false
//     }
//     //开发时不用tomcat启动，需要注释掉此段代码
//     // await store.dispatch('user/getInfo')
    
//     // determine whether the user has logged in
//     if (!getRouters.length) {
//       // 优先从vuex中获取路由状态，不存在则触发获取
//       getRouters = await store.dispatch('permission/generateRoutes')
//       router.addRoutes(getRouters)
//       // 判断当前跳转的路由是否存在，不存在则取路由第一项进行跳转
//       const _pathItem = getRouters.filter(
//         item =>
//           item.path === to.path ||
//           (item.children && item.children.find(citem => citem.path === to.path))
//       )
//       if (!_pathItem) {
//         const nextPath = getRouters[0].children[0].path
//         next(nextPath)
//       } else {
//         next(to.path)
//       }
//     } else {
//       next()
//     }
 

//   NProgress.done()
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
