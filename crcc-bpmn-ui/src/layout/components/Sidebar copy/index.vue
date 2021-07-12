<template>
  <div :class="{'has-logo':showLogo}"  >
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!-- <menu-type v-if="!isCollapse" ></menu-type> -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="false"
        :active-text-color="variables.subMenuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item  v-for="item in permission_menus" :key="item.id" :item="item" basePath='item.routerLink'/>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import menuType from './menuType'

import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo,menuType },
   data() {
      return {
        menuBg:require("@/assets/images/title.jpg")
      }
    },

  computed: {
    ...mapGetters([
      'permission_menus',
      "permission_routes",
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
  
      if (meta.title) {
        return meta.title
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },

}
</script>
