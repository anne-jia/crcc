<template>
  <div>
    <el-tooltip class="item" effect="light" :open-delay="100" placement="right">
      <template slot="content">
        {{ sidebar.opened ? "折叠菜单" : "显示菜单" }}
      </template>
      <div class="fl" style="line-height: 61px" @click="ChangeShow">
        <!-- <span  :class="{'is-active':sidebar.opened}" class="hamburger el-icon-s-unfold"    /> -->
        <svg-icon
          :class="{ 'is-active': !sidebar.opened }"
          class="hamburger"
          icon-class="fold2"
        />
      </div>
    </el-tooltip>
    <div class="layout-top-search">
      <el-select
        v-model="searchMenu"
        filterable
        remote
        placeholder="菜单查询"
        style="width: 214px"
      >
        <el-option-group
          v-for="(group, idx) in menuList"
          :key="idx"
          :label="group.meta.title"
        >
          <el-option
            v-for="item in group.children"
            :key="item.name"
            :label="item.meta.title"
            :value="item.meta.title"
          />
        </el-option-group>
      </el-select>
      <el-button
        icon="el-icon-search layout-top-search--btn"
        @click="goRouter"
      />
    </div>
    <!-- 右侧内容区域 -->
    <div class="header-right">
      <div class="title-box company">
        <svg-icon
          icon-class="gangweimingcheng"
          class="gangweimingcheng-avatar"
        />
        <span class="company-title"> 公司名称：{{ mainPosition.name }} </span>
      </div>
      <div class="layout-message">
        <el-badge :value="msgNum" :hidden="msgNum < 1" class="item">
          <i class="el-icon-message-solid" />
        </el-badge>
      </div>
      <div class="title-box">
        <i class="el-icon-s-custom" />
        <span class="user-title"> {{ name }}</span>
      </div>
      <div class="title-box exit-box">
        <svg-icon icon-class="tuichu" class="tuichu-avatar" />
        <span class="exit" @click="exit"> 退出</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      msgNum: 0,
      searchMenu: '',
      logo: require('@/assets/images/logos.png')
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'positions',
      'mainPosition',
      'permission_routes'
    ]),
    menuList() {
      return this.permission_routes.filter(
        (item) => item.children && item.meta
      )
    }
  },
  methods: {
    ChangeShow() {
      this.$store.dispatch('app/toggleSideBar')
    },
    OnMouseEnter(e) {
      this.$store.dispatch('app/openSideBar')
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (e.clientY > 33 && e.clientY < 70) {
          return
        } else {
          this.$store.dispatch('app/openSideBar')
        }
      }, 400)
    },

    OnMouseLeave(e) {
      clearTimeout(this.timer)
      const _this = this
      this.timer = setTimeout(() => {
        if (e.clientY > 33 && e.clientY < 70) {
          return
        } else {
          _this.$store.dispatch('app/closeSideBar')
        }
      }, 500)
    },

    // 退出登录
    async exit() {
      window.location.href = '/logout'
    },
    goRouter() {
      this.$router.push({
        name: this.searchMenu
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  line-height: 48px;
  color: #fff;
  font-size: 20px;
  font-weight: lighter;
}
.hamburger.is-active {
  transform: rotate(180deg);
}
.layout-top-search {
  position: relative;
  float: left;
  height: 61px;
  line-height: 61px;
  margin-left: 14px;
  ::v-deep {
    .el-input__inner {
      border-radius: 4px 0 0 4px;
      background: #ffffff22;
      border-color: #ffffff22;
      color: #fff;
      font-size: 14px;
    }
    .el-input.is-focus .el-input__inner {
      border-color: #ffffff22;
    }
    .el-button--default {
      padding: 0;
      border-radius: 0 4px 4px 0;
      text-align: center;
      width: 32px;
      height: 28px;
      position: absolute;
      top: 16px;
      right: -32px;
      border-left: none;
      color: #fff;
      background: #ffffff33;
      border-color: #ffffff33;
      &:hover {
        background: #ffffff66;
      }
    }
  }
}
.header-right {
  height: 61px;
  line-height: 61px;
  float: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .title-box {
    overflow: hidden;
    color: #fff;

    .gangweimingcheng-avatar {
      height: 14px;
      width: 16px;
    }
    .ren-avatar {
      width: 15px;
      height: 15px;
    }
    .tuichu-avatar,
    .shezhi-avatar {
      width: 14px;
      height: 14px;
    }
    .company-title,
    .user-title {
      display: inline-block;
      padding: 0 21px 0 5px;
    }
    .company-title,
    .user-title,
    .exit {
      color: #fff;
      font-size: 14px;
    }
  }
  .setting-box,
  .exit-box {
    cursor: pointer;
  }
}
@media screen and(max-width: 835px) {
  .company {
    display: none;
  }
}
.layout-message {
  font-size: 20px;
  color: #fff;
  height: 61px;
  width: 61px;
  line-height: 61px;
  text-align: center;
  cursor: pointer;
  margin-right: 10px;
  &:hover {
    background: #3378d3;
  }
  ::v-deep {
    .el-badge__content.is-fixed {
      top: 18px;
      right: 12px;
    }
    .el-badge__content {
      height: 14px;
      line-height: 14px;
      border: none;
    }
  }
}
</style>
