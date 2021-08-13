
import {
  getUserMenus,
  hasPermission
} from "@/api/permission";

const errorRouter = [
  {
    path: '*',
    redirect: '/404',
    hidden: true,
    component: () => import('@/components/error-page/404.vue'),
    children: [
      {
        path: '/404',
        name: '404',
        hidden: true,
        meta: {
          title: '404'
        },
        component: () => import('@/components/error-page/404.vue')
      }
    ]
  }
 ]


const state = {
  // 所有的路由
  routes: [],
  // 添加路由
  addRoutes: [],
  menus: [],
  // 是否有权限
  hasPermission
};

const mutations = {
  //添加路由
  SET_ROUTES: (state, routes) => {
    state.routes = routes;
  },
  // 设置菜单
  SET_MENUS: (state, menus) => {
    state.menus = menus;
  },
  SET_HASPERMISSION: (state, hasPermission) => {
    state.hasPermission = hasPermission;
  }
};

const actions = {
  generateRoutes({
    commit
  }, options) {
    return new Promise((resolve, reject) => {
      // 获取后端菜单
      getUserMenus()
        .then(response => {

          var pages = [];
          options.files.keys().forEach(key => {
            
            pages.push(key.replace(/(\.\/|\.vue)/g, ""));
          });
          let getRouter = [];
          if (response.length) {

            getRouter = options.staticRoutes.concat(filterAsyncRouter(  [...response],  options.baseComponent,  options.components,  pages)).concat(errorRouter);
            commit("SET_ROUTES", getRouter);
            const accessedMenus = filterMenus([...options.staticRoutes,...response]);
            commit("SET_MENUS", accessedMenus);


          } else {
            getRouter = errorRouter;
          }
          resolve(getRouter);


        })
        .catch(error => {

          // let getRouter = [];
          // if (options.staticRoutes.length) {
          //   //设置的路由&请求接口的路由
          //   getRouter = (options.staticRoutes).concat(errorRouter);
          //   commit("SET_ROUTES", getRouter);
          //   const accessedMenus = filterMenus([...options.staticRoutes,]);
          //   commit("SET_MENUS", accessedMenus);
          // } else {
          //   getRouter = errorRouter;
          // }
          // resolve(getRouter);

          reject(error);
        });
    });
  },

  // 是否有权限
  getHasPermission({
    commit
  }) {
    return new Promise((resolve, reject) => {
      // 是否有授权主体权限
      hasPermission()
        .then(response => {
          if (response !== undefined) {
            commit("SET_HASPERMISSION", response);
            resolve(response);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

//baseComponent,components, files
export function filterAsyncRouter(
  asyncRouterMap,
  baseComponent,
  components,
  pages
) {
  // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRouterMap.filter(route => {
    if (!route.component) {
      return;
    } else {
      if (route.component) {
        if (route.component === "Layout") {
          // Layout组件特殊处理
          route.component = baseComponent;
        } else {
          const index = pages.findIndex(item => {
            return item === route.component;
          });
          if (index === -1) {
            route.component = () => import("@/components/error-page/404.vue");
          } else {
            route.component = components(route.component);
          }
        }
      }
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(
          route.children,
          baseComponent,
          components,
          pages
        );
      }
      return true;
    }
  });
  return accessedRouters;
}

/**
 * 过滤菜单数据：移除同路由没匹配上的菜单
 * @param {菜单接口获取的原始数据（树形结构）}} menus
 * 菜单过来，左侧的菜单栏不需要显示的部分
 */
export function filterMenus(menus) {
  if (menus) {
    for (var i = menus.length - 1; i >= 0; i--) {
      const children = menus[i].items;
      if (children && children.length > 0) {
        filterMenus(children);
      } else {
        if (menus[i].isHomePage) {
          menus.splice(i, 1);
        }
      }
    }
  }
  return menus;
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
