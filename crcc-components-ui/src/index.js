import '@/styles/index.scss'

import CrccSteps from "@/components/crcc-steps/index.vue"
import Pagination from "@/components/Pagination/index.vue"
import SvgIcon from '@/components/SvgIcon/index.vue'
import page401 from '@/components/error-page/401.vue'
import page404 from '@/components/error-page/404.vue'



import Layout from '@/layout/index.vue'
import appMain from '@/layout/components/AppMain.vue'
import Header from '@/layout/components/Header/Header.vue'

import Sidebar from '@/layout/components/Sidebar/index.vue'
import MenuItem from '@/layout/components/Sidebar/Item.vue'
import MenuLink from '@/layout/components/Sidebar/Link.vue'
import SidebarLogo from '@/layout/components/Sidebar/Logo.vue'
import SidebarItem from '@/layout/components/Sidebar/SidebarItem.vue'

import TagsView from '@/layout/components/TagsView/index.vue'
import CrccTabs from '@/layout/components/TagsView/components/crcc-tabs.vue'



//路由控制

import createRouter from '@/utils/router-method.js'

//store

import permission from '@/store/modules/permission'

//方法

// import forbidBanBackSpace from '@/utils/forbid.js'
import message from '@/utils/message.js'



const components = [
  CrccSteps,
  Pagination,
  SvgIcon,
  Layout,
  appMain,
  Header,
  Sidebar,
  MenuItem,
  MenuLink,
  SidebarLogo,
  SidebarItem,
  TagsView,
  CrccTabs,
  page401,
  page404,


];


const install = function (Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

export default {
  install
}
export {
  CrccSteps,
  Pagination,
  SvgIcon,
  Layout,
  page401,
  page404,
  message,
  createRouter,
  permission
}
