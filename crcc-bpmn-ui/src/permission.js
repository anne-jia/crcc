import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import defaultSettings from './settings'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
// let getRouters = []

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = `${to.meta.title}-${defaultSettings.title}`
  // 优先从vuex中获取路由状态，不存在则触发获取
  let getRouters = store.getters.permission_routes
  // determine whether the user has logged in
  if (!getRouters.length) {
    getRouters = await store.dispatch('permission/generateRoutes')
    router.addRoutes(getRouters)
    next({...to,replace:true});
  } else {
    next()
  }
  NProgress.done()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
