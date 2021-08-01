import {
  constantRoutes,
  errorRouter,
  asyncRoutes
} from '@/router/index'
import {
  getUserMenus,
  hasPermission
} from '@/api/permission'

/* Layout */
import Layout from '@/layout'
const _import = require('@/router/_import_' + process.env.NODE_ENV) // 获取组件的方法
const files = require.context('@/views', true, /\.vue$/)
var pages = []
files.keys().forEach(key => {
  pages.push(key.replace(/(\.\/|\.vue)/g, ''))
})
const state = {
  // 所有的路由
  routes: [],
  // 添加路由
  addRoutes: [],
  menus: [],
  // 是否有权限
  hasPermission
}

const mutations = {
  // 设置路由
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    // console.log(constantRoutes.concat(routes));
  },
  // 设置菜单
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  SET_HASPERMISSION: (state, hasPermission) => {
    state.hasPermission = hasPermission
  }

}

const actions = {
  generateRoutes({
    commit
  }) {
    let getRouter = []
    return new Promise((resolve, reject) => {
      // 获取后端菜单
      getUserMenus().then(response => {
        if (response.length) {
          getRouter = filterAsyncRouter([...response])
          getRouter = getRouter.concat(errorRouter)
        } else {
          getRouter = errorRouter
        }
        commit('SET_ROUTES', getRouter)
        const accessedMenus = filterMenus([...response])
        commit('SET_MENUS', accessedMenus)
        resolve(getRouter)
      })
        .catch(error => {
          getRouter = asyncRoutes.concat(errorRouter)
          const accessedMenus = filterMenus([...asyncRoutes])
          commit('SET_MENUS', accessedMenus)
          resolve(getRouter)
          // reject(error)
        })
    })
  },

  // 菜单数据 根据接口获取
  generateMenus({
    commit
  }, menu) {
    const menus = [...menu]
    const accessedMenus = filterMenus(menus)
    commit('SET_MENUS', accessedMenus)
    // resolve(routers)
  },
  // 是否有权限
  getHasPermission({ commit }) {
    return new Promise((resolve, reject) => {
      // 是否有授权主体权限
      hasPermission().then(response => {
        if (response !== undefined) {
          commit('SET_HASPERMISSION', response)
          resolve(response)
        }
      }).catch(error => {
        console.error(error)
        reject(error)
      })
    })
  }

}

function filterAsyncRouter(asyncRouterMap) {
  // 遍历后台传来的路由字符串，转换为组件对象

  const accessedRouters = asyncRouterMap.filter(route => {
    if (!route.component) {
      return
    } else {
      if (route.component) {
        if (route.component === 'Layout') {
          // Layout组件特殊处理
          route.component = Layout
        } else {
          const index = pages.findIndex((item) => {
            return item === route.component
          })
          if (index === -1) {
            route.component = _import('error-page/404')
          } else {
            route.component = _import(route.component)
          }
        }
      }
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children)
      }
      return true
    }
  })

  return accessedRouters
}

/**
 * 过滤菜单数据：移除同路由没匹配上的菜单
 * @param {菜单接口获取的原始数据（树形结构）}} menus
 * 菜单过来，左侧的菜单栏不需要显示的部分
 */
function filterMenus(menus) {
  if (menus) {
    for (var i = menus.length - 1; i >= 0; i--) {
      const children = menus[i].items
      if (children && children.length > 0) {
        filterMenus(children)
      } else {
        if (menus[i].isHomePage) {
          menus.splice(i, 1)
        }
      }
    }
  }
  return menus
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
