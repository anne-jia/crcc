<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children,item)">
      <app-link v-if="!item.noShowingChildren"  :to="resolvePath(onlyOneChild.path)" >
        <el-menu-item :index="item.label" :class="{'submenu-title-noDropdown':!isNest}">
          <item  :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="meta.title"  ></item>
        </el-menu-item>
      </app-link>
    </template>
     <el-submenu popper-class="side-mune"  v-if="item.items?item.items.length>0:''"  :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
          <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title"   ></item>
      </template>
        <sidebar-item
           v-for="child in item.children"
           :key="child.path"
           :is-nest="true"
           :item="item"
           :base-path="resolvePath(child.path)"
           class="nest-menu"
         />
     </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
     
    },
      isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }

  },

  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild(items = [], parent) {
      const showingChildren = items.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })
      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return false;
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {  
        this.onlyOneChild = { ... parent, noShowingChildren: true }
        return true
      }
      return false
    },

    resolvePath(routePath) {

      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
 
    },
    
  }
}
</script>
