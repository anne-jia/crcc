<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" :titleInfo="titleInfo"/>
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <layout-header :userInfo="userInfo">
          <slot name="header">
              
          </slot>
        </layout-header>

        <tags-view v-if="needTagsView" />
      </div>
        <section class="app-main">
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="cachedViews">
            <!-- <router-view :key="key" /> -->
            <slot></slot>
          </keep-alive>
        </transition>
      </section>
    </div>
  </div>
</template>
<script>

import { Sidebar, TagsView, layoutHeader } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
export default {
  name: 'layout',
  props:{
    userInfo:{
      type:Object,
      default:function(){
        return{
          position:'',
          name:'',
          routes:[],
          msgNum:0,
        }
      }
    },
    titleInfo:{
        type:Object,
        default:()=>{
          return{
              logo:require('@/assets/images/logos.png'),
              title:"",
          }
        }
      },
  },
  components: {
    Sidebar,
    TagsView,
    layoutHeader
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device,
      showSettings: (state) => state.settings.showSettings,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },

  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>


.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  background: #eef0f3;
  &:after {
    content: "";
    display: table;
    clear: both;
  }
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - 228px);
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}

.app-main {
  margin: 0 8px;
  position: relative;
  overflow: hidden;
  height: calc(100vh - 115px);
  background: #fff;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    
      height: calc(100vh - 115px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>