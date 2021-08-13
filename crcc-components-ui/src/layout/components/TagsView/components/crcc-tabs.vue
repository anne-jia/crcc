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
        <span slot="reference">
          <i class="iconfont icon-more-vertical-copy" />
        </span>
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
  name:"crccTabs",
  data() {
    return {
      translateX: 0,
      selectedTag: null,
      selectedPaths: [],
      selectedList: []
    }
  },

  watch: {
    $route() {
      this.addTags()
    }
  },
  mounted() {
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
        // 当前tab可视区域宽度
        const showWidth = this.$refs.refContent.clientWidth
        // 获取数据视口信息
        const dataPosition = this.$refs.refData.getBoundingClientRect()
        // 获取当前选中数据视口信息
        const activeDatePosition = this.$refs.refData
          .querySelector('.active')
          .getBoundingClientRect()
        // 计算当前选中区域位置
        const currentPosition = dataPosition.left - activeDatePosition.left
        if (Math.abs(currentPosition) + activeDatePosition.width > showWidth) {
          // 存在遮挡部分
          this.translateX =
            showWidth - (Math.abs(currentPosition) + activeDatePosition.width)
        } else {
          if (Math.abs(currentPosition) <= showWidth) {
            this.translateX = 0
          } else {
            this.translateX = currentPosition
          }
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
      }
      this.reComputedX()
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
      console.log(this.$route.name,'this.$route.name');
      if (
        this.$route.path === '/' ||
        this.$route.name.toLowerCase() === 'home' ||
        this.$route.path.toLowerCase() === '/home'
      ) {
        this.addTags()
      }
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
  padding: 0 8px;
  margin: 8px 0;
  .tabs-item--btn {
    height: 30px;
    width: 30px;
    line-height: 30px;
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
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: #fff;
        border-radius: 4px;
        cursor: pointer;
        padding: 0 16px;
        font-size: 14px;
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
