import router from './router/index'
import { resetRouter } from '@/router/index'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
var getRouteList

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  // const hasPermission = await store.dispatch('permission/getHasPermission')
  // 没有权限的时候跳转401
  const hasPermission = true
  if (!hasPermission) {
    resetRouter()
    to.path !== '/401' ? next('/401') : next()
  } else {
    // 有权限的时候动态加载路由
    // await store.dispatch('user/getInfo')
    if (!getRouteList) {
      getRouteList = await store.dispatch('permission/generateRoutes')
      console.log(getRouteList)
      router.addRoutes(getRouteList)
      next({ ...to, replace: true })
    } else {
      next()
    }
  }
  NProgress.done()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
