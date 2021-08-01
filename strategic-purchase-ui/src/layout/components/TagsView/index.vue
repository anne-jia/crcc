<template>
  <div id="tags-view-container" class="tags-view-container">
    <crcc-tabs />
    <!-- <scroll-pane
      ref="scrollPane"
      class="tags-view-wrapper"
      @scroll="handleScroll"
    >
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="div"
        class="tags-view-item"
        @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent.native="openMenu(tag, $event)"
      >
        <i
          v-show="tag.title === '首页'"
          class="el-icon-s-home"
          style="margin-right: 4px"
        />

        <span class="tab-title"> {{ tag.title }}</span>
        <i
          v-show="tag.title !== '首页'"
          class="el-icon-circle-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </router-link>
    </scroll-pane> -->
    <!-- <el-tag   effect="plain" type="info" @click="returnBack">返回</el-tag> -->
  </div>
</template>

<script>
// import ScrollPane from './ScrollPane'
// import path from 'path'
import crccTabs from "./components/crcc-tabs.vue"
export default {
  components: {
    // ScrollPane,
    // crccTabs: () => import('./components/crcc-tabs.vue')
    crccTabs
  },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: []
    }
  },
  computed: {
    // visitedViews() {
    //   return this.$store.state.tagsView.visitedViews
    // },
    // routes() {
    //   return this.$store.state.permission.routes
    // }
  },
  watch: {
    // $route() {
    //   this.addTags()
    //   this.moveToCurrentTag()
    // },
    // visible(value) {
    //   if (value) {
    //     document.body.addEventListener('click', this.closeMenu)
    //   } else {
    //     document.body.removeEventListener('click', this.closeMenu)
    //   }
    // }
  },
  mounted() {
    // this.initTags()
    // this.addTags()
  },
  methods: {
    // // 返回上一级
    // returnBack() {
    //   this.$router.go(-1)
    // },
    // isActive(route) {
    //   return route.path === this.$route.path
    // },
    // isAffix(tag) {
    //   return tag.meta && tag.meta.affix
    // },
    // filterAffixTags(routes, basePath = '/') {
    //   let tags = []
    //   routes.forEach((route) => {
    //     if (route.meta && route.meta.affix) {
    //       const tagPath = path.resolve(basePath, route.path)
    //       tags.push({
    //         fullPath: tagPath,
    //         path: tagPath,
    //         name: route.name,
    //         meta: { ...route.meta }
    //       })
    //     }
    //     if (route.children) {
    //       const tempTags = this.filterAffixTags(route.children, route.path)
    //       if (tempTags.length >= 1) {
    //         tags = [...tags, ...tempTags]
    //       }
    //     }
    //   })
    //   return tags
    // },
    // initTags() {
    //   const affixTags = (this.affixTags = this.filterAffixTags(this.routes))
    //   for (const tag of affixTags) {
    //     // Must have tag name
    //     if (tag.name) {
    //       this.$store.dispatch('tagsView/addVisitedView', tag)
    //     }
    //   }
    // },
    // addTags() {
    //   const { name } = this.$route
    //   if (name) {
    //     this.$store.dispatch('tagsView/addView', this.$route)
    //   }
    //   return false
    // },

    // moveToCurrentTag() {
    //   const tags = this.$refs.tag
    //   this.$nextTick(() => {
    //     for (const tag of tags) {
    //       if (tag.to.path === this.$route.path) {
    //         this.$refs.scrollPane.moveToTarget(tag)
    //         // when query is different then update
    //         if (tag.to.fullPath !== this.$route.fullPath) {
    //           this.$store.dispatch('tagsView/updateVisitedView', this.$route)
    //         }
    //         break
    //       }
    //     }
    //   })
    // },
    // 刷新
    // refreshSelectedTag(view) {
    //   this.$store.dispatch('tagsView/delCachedView', view).then(() => {
    //     const { fullPath } = view
    //     this.$nextTick(() => {
    //       this.$router.replace({
    //         path: '/redirect' + fullPath
    //       })
    //     })
    //   })
    // },

    // // 关闭所选中
    // closeSelectedTag(view) {
    //   this.$store
    //     .dispatch('tagsView/delView', view)
    //     .then(({ visitedViews }) => {
    //       if (this.isActive(view)) {
    //         this.toLastView(visitedViews, view)
    //       }
    //     })
    // },
    // 关闭标签
    // closeOthersTags() {
    //   this.$router.push(this.selectedTag)
    //   this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(() => {
    //     this.moveToCurrentTag()
    //   })
    // },
    // closeAllTags(view) {
    //   this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
    //     if (this.affixTags.some(tag => tag.path === view.path)) {
    //       return
    //     }
    //     this.toLastView(visitedViews, view)
    //   })
    // },

    // toLastView(visitedViews, view) {
    //   const latestView = visitedViews.slice(-1)[0]
    //   if (latestView) {
    //     this.$router.push(latestView.fullPath)
    //   } else {
    //     // now the default is to redirect to the home page if there is no tags-view,
    //     // you can adjust it according to your needs.
    //     if (view.name === 'Dashboard') {
    //       // to reload home page
    //       this.$router.replace({ path: '/redirect' + view.fullPath })
    //     } else {
    //       this.$router.push('/')
    //     }
    //   }
    // },
    // openMenu(tag, e) {
    //   const menuMinWidth = 105
    //   const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
    //   const offsetWidth = this.$el.offsetWidth // container width
    //   const maxLeft = offsetWidth - menuMinWidth // left boundary
    //   const left = e.clientX - offsetLeft + 15 // 15: margin right

    //   if (left > maxLeft) {
    //     this.left = maxLeft
    //   } else {
    //     this.left = left
    //   }

    //   this.top = e.clientY
    //   this.visible = true
    //   this.selectedTag = tag
    // },
    // closeMenu() {
    //   this.visible = false
    // },
    // handleScroll() {
    //   this.closeMenu()
    // }
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  /* width: 100%; */
  // background: #FFFFFF;
  // border-bottom: 1px solid #eee;
  // border-left: 8px solid #ebf2f6;
  // margin: 8px 8px 0px 0px;
  // height: 40px;
  // padding-right: 19px;
  // text-align: center;
  // overflow: hidden;
  .tags-view-wrapper {
    float: left;
    .tags-view-item {
      float: left;
      position: relative;
      cursor: pointer;
      height: 40px;
      width: 600px;
      line-height: 40px;
      background: #ffffff;
      color: #303133;
      padding-right: 12px;
      padding-left: 10px;
      margin-left: 8px;
      .el-icon-circle-close {
        display: inline-block;
        color: rgba(163, 162, 162, 0.6);
        height: 9px;
        width: 9px;
        margin-right: 3px;
        padding-left: 3px;
      }

      .tab-title {
        display: inline-block;
        height: 22px;
        line-height: 22px;
        font-size: 14px;
        font-weight: 400;
        text-align: center;
      }
      &.active {
        background: rgba(239, 243, 250, 0.8);
        color: #004098;
        &::before {
          content: "";
          background: #004098;
          display: inline-block;
          width: 100%;
          height: 3px;
          position: absolute;
          bottom: 0;
          left: 0;
          margin-right: 2px;
        }
      }
      /* &:nth-of-type(1) .el-icon-circle-close{
        display: none;
      } */
    }
  }

  .el-tag {
    float: right;
    margin: 5px 0;
    width: 50px;
    height: 30px;
    font-weight: 400;
    color: #303133;
    text-align: center;
    line-height: 30px;
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
.tags-view-container:after {
  content: "";
  height: 0;
  display: block;
  clear: both;
  visibility: hidden;
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
