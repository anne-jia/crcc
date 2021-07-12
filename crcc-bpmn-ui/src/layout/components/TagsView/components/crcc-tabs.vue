<template>
  <ul class="tabs-group">
    <li class="tabs-item--btn tabs-item--left" @click="firstMenu">
      <i class="el-icon-arrow-left" />
    </li>
    <li class="tabs-item--btn tabs-item--menu">
      <el-popover placement="top-start" width="150" trigger="hover">
        <el-row class="tabs-edit-group">
          <el-col :span="24">
            <el-button
              class="tabs-edit-btn"
              type="text"
              icon="el-icon-back"
              @click="closeLeft"
            >关闭左侧</el-button>
          </el-col>
          <el-col :span="24">
            <el-button
              class="tabs-edit-btn"
              type="text"
              icon="el-icon-right"
              @click="closeRight"
            >关闭右侧</el-button>
          </el-col>
          <el-col :span="24">
            <el-button
              class="tabs-edit-btn"
              type="text"
              icon="el-icon-close"
              @click="closeOther"
            >关闭其他</el-button>
          </el-col>
          <el-col :span="24">
            <el-button
              type="text"
              class="tabs-edit-btn"
              icon="el-icon-circle-close"
              @click="closeAll"
            >全部关闭</el-button>
          </el-col>
        </el-row>
        <template slot="reference">
          <svg-icon icon-class="more-vertical"></svg-icon>
        </template>
      </el-popover>
    </li>
    <li class="tabs-item--btn tabs-item--right" @click="nextMenu">
      <i class="el-icon-arrow-right" />
    </li>
    <li ref="refContent" class="tabs-item--content">
      <div
        ref="refData"
        class="tabs-item-data--box"
        :style="`transform: translateX(${translateX}px);`"
      >
        <router-link
          v-for="(tag, idx) in selectedList"
          ref="tag"
          :key="tag.path"
          class="tabs-item--data tabs-view-item"
          :class="{ active: tag.path === selectedTag.path }"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          tag="div"
          @contextmenu.prevent.native="openMenu(tag, $event)"
        >
          <span class="tab-title"> {{ tag.title }}</span>
          <i
            v-show="tag.title !== '首页'"
            class="el-icon-close tabs-view-item--close"
            @click.prevent.stop="closeTag(tag, idx)"
          />
        </router-link>
      </div>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      tabList: [],
      translateX: 0,
      selectedTag: null,
      selectedPaths: [],
      selectedList: []
    }
  },
  computed: {
    ...mapGetters({
      routes: 'permission_routes'
    })
  },
  watch: {
    $route() {
      this.addTags()
    }
  },
  mounted() {
    this.initTags()
    this.addTags()
  },
  methods: {
    firstMenu() {
      const _tempX = (this.translateX += 100)
      if (_tempX < 0) {
        this.translateX = _tempX
      } else {
        this.translateX = 0
      }
    },
    nextMenu() {
      const showWidth = this.$refs.refContent.clientWidth
      const dataWidth = this.$refs.refData.clientWidth
      const hideWidth = dataWidth - showWidth
      if (Math.abs(this.translateX) < hideWidth) {
        const _tempX = (this.translateX -= 100)
        if (_tempX > -hideWidth) {
          this.translateX = _tempX
        } else {
          this.translateX = -hideWidth - 20
        }
      }
    },
    // 重新计算tag的X轴宽度
    reComputedX() {
      this.$nextTick(() => {
        const showWidth = this.$refs.refContent.clientWidth
        const dataWidth = this.$refs.refData.clientWidth
        const hideWidth = dataWidth - showWidth
        if (hideWidth > 0) {
          this.translateX = -hideWidth - 20
        } else {
          this.translateX = 0
        }
      })
    },
    /* 关闭tag */
    closeTag(view, idx) {
      if (this.selectedList.length > 1) {
        this.selectedList.splice(idx, 1)
        this.selectedPaths.splice(idx, 1)
        if (idx > 0) {
          this.selectedTag = this.selectedList[idx - 1]
        } else {
          this.selectedTag = this.selectedList[idx]
        }
        // 更新路由
        this.goRouter()
      } else {
        this.closeAll()
      }
      this.reComputedX()
    },
    /* 选中tag */
    openMenu(tag, e) {
      this.selectedTag = tag
    },
    /* 初始化tag */
    initTags() {
      this.routes.forEach((item) => {
        if (item.children && item.children.length) {
          this.tabList = this.tabList.concat(item.children)
        }
      })
      this.tabList = this.tabList.map((item) => {
        item.title = item.meta.title
        return item
      })
    },
    /* 添加tag */
    addTags() {
      // 记录当前选中项
      this.selectedTag = {
        fullPath: this.$route.fullPath,
        path: this.$route.path,
        name: this.$route.name,
        meta: this.$route.meta,
        title: this.$route.meta.title
      }
      // 判断是否当亲啊tag已存在，不存在则新增
      if (!this.selectedPaths.includes(this.selectedTag.path)) {
        this.selectedPaths.push(this.selectedTag.path)
        this.selectedList.push(this.selectedTag)
        this.reComputedX()
      }
    },
    /* 获取当前选中的数据下标 */
    getSelectedIdx() {
      let _idx = 0
      if (this.selectedList.length > 0) {
        this.selectedList.filter((item, idx) => {
          if (
            item.name === this.selectedTag.name &&
            item.path === this.selectedTag.path
          ) {
            _idx = idx
          }
        })
      }
      return _idx
    },
    /* 关闭左边 */
    closeLeft() {
      if (this.selectedList.length > 0) {
        const _idx = this.getSelectedIdx()
        this.selectedList.splice(0, _idx)
        this.selectedPaths.splice(0, _idx)
        // 更新路由
        this.goRouter()
        this.reComputedX()
      }
    },
    /* 关闭右边 */
    closeRight() {
      if (this.selectedList.length > 0) {
        const _idx = this.getSelectedIdx()
        this.selectedList.splice(_idx + 1, this.selectedList.length)
        this.selectedPaths.splice(_idx + 1, this.selectedList.length)
        // 更新路由
        this.goRouter()
        this.reComputedX()
      }
    },
    /* 关闭其他 */
    closeOther() {
      if (this.selectedList.length > 0) {
        this.selectedList = this.selectedList.filter(
          (item) =>
            item.name === this.selectedTag.name &&
            item.path === this.selectedTag.path
        )
        this.selectedPaths = this.selectedPaths.filter(
          (item) => item === this.selectedTag.path
        )
        this.translateX = 0
      }
    },
    /* 关闭全部 */
    closeAll() {
      this.selectedList = []
      this.selectedPaths = []
      this.$router.push({
        path: '/'
      })
      this.translateX = 0
    },
    /* 跳转到指定路由 */
    goRouter() {
      this.$router.push({
        name: this.selectedTag.name
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs-group {
  list-style: none;
  padding: 0 10px;
  margin: 10px 0;
  .tabs-item--btn {
    height: 36px;
    width: 36px;
    line-height: 36px;
    background: #fff;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
  }
  .tabs-item--left {
    float: left;
    margin-right: 6px;
  }
  .tabs-item--right,
  .tabs-item--menu {
    float: right;
  }
  .tabs-item--right {
    margin-right: 10px;
    margin-left: 6px;
  }
  .tabs-item--content {
    overflow: hidden;
    // padding: 0 10px;
    .tabs-item-data--box {
      white-space: nowrap;
      position: relative;
      transition: transform 0.3s;
      float: left;
      z-index: 2;
      .tabs-item--data {
        display: inline-block;
        margin-right: 10px;
        min-width: 100px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        background: #fff;
        border-radius: 4px;
        cursor: pointer;
        padding: 0 16px;
        font-size: 16px;
        &:hover {
          color: #228ef8;
        }
        &:last-child {
          margin-right: 0;
        }
      }
      .tabs-view-item {
        .tabs-view-item--close {
          margin-left: 10px;
          font-size: 14px;
        }
      }
      .tabs-item--data.active {
        color: #228ef8;
      }
    }
  }
}
.tabs-edit-group {
  text-align: center;
  .tabs-edit-btn {
    color: #666;
    &:hover {
      color: #228ef8;
    }
  }
}
</style>
