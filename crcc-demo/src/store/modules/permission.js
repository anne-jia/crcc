
// import {  constantRoutes,asyncRoutes,commitRouter} from '@crcc/crcc_commmon_ui'
import { getUserMenus, hasPermission } from '@/api/permission'

/* Layout */

// var pages = []
// files.keys().forEach(key => {
//   pages.push(key.replace(/(\.\/|\.vue)/g, ''))
// })
import Layout from '@/layout'
import APP from '@/App'
const files = require.context('@/views', true, /\.vue$/)
const _import = require('@/router/_import_' + process.env.NODE_ENV) // 获取组件的方法
import list from './router.json'
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
   SET_ADDROUTES: (state, routes) => {
    state.addRoutes = routes
  },
  //添加路由
  SET_ROUTES: (state, routes) => {
    state.routes = routes
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
  generateRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      // 获取后端菜单
      getUserMenus()
        .then(response => {
          // let getRouter = commitRouter(commit, Layout, APP, _import, files, response, constantRoutes);
          
          resolve(getRouter)
        })
        .catch(error => {
          const routerList = list.list
        //  let getRouter = commitRouter(commit, Layout, APP, _import, files,routerList, constantRoutes);
          resolve(getRouter)
          // reject(error);
        })
    })
  },


  // 菜单数据 根据接口获取
  generateMenus({ commit }, menu) {
    const menus = [...menu]
    const accessedMenus = filterMenus(menus)
    commit('SET_MENUS', accessedMenus)
    // resolve(routers)
  },
  // 是否有权限
  getHasPermission({ commit }) {
    return new Promise((resolve, reject) => {
      // 是否有授权主体权限
      hasPermission()
        .then(response => {
          if (response !== undefined) {
            commit('SET_HASPERMISSION', response)
            resolve(response)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}



export default {
  namespaced: true,
  state,
  mutations,
  actions
}
