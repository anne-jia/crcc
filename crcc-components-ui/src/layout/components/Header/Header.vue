<template>
  <div class="headers">
    <div class="header-big clearfix">
      <el-tooltip
        class="item"
        effect="light"
        :open-delay="100"
        placement="right"
      >
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
          clearable
          size="small"
          :filter-method="menuFilter"
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
              :value="item.name"
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
             v-show="position"
          />
          <span class="company-title" v-show="position"> 公司名称：{{ userInfo.position}} </span>
          <slot>
          </slot>
        </div>
        <div class="layout-message">
          <el-badge :value="userInfo.msgNum" :hidden="userInfo.msgNum < 1" class="item">
            <i class="el-icon-message-solid" />
          </el-badge>
        </div>
        <div class="title-box">
          <i class="el-icon-s-custom" />
          <span class="user-title"> {{ userInfo.name }}</span>
        </div>
        <div class="title-box exit-box">
          <svg-icon icon-class="tuichu" class="tuichu-avatar" />
          <span class="exit" @click="exit"> 退出</span>
        </div>
      </div>
    </div>

    <div class="clearfix header-small">
      <div class="sys-title"><span>{{userInfo.title}}</span></div>

      <!-- 右侧内容区域 -->
      <div class="header-right">
        <div class="title-box exit-box">
          <svg-icon icon-class="tuichu" class="tuichu-avatar" />
          <span class="exit" @click="exit"> 退出</span>
        </div>
        <el-button
          @click="drawer = true"
          style="margin-left: 8px;color:#004098"
        >
          <i :class="drawer ? 'el-icon-close' : 'el-icon-s-fold'"></i>
        </el-button>
      </div>

      <el-drawer
        :visible.sync="drawer"
        :with-header="false"
        direction="ltr"
        :append-to-body="false"
        size="100%"
        ref="drawer"
      >
        <el-collapse accordion>
          <el-collapse-item
            v-for="menulist in userInfo.routes"
            :key="menulist.id"
          >
            <template slot="title">
              {{ menulist.label }}
            </template>
            <div v-for="menu in menulist.items" :key="menu.label">
              <router-link
                tag="a"
                :to="menu.routerLink"
                @click.native="$refs.drawer.closeDrawer()"
                >{{ menu.label }}</router-link
              >
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-drawer>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import  defaultSettings from '@/settings'

export default {
  name: "layoutHeader",
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
    }
  },

  data() {
    return {
      searchMenu: "",
      title:defaultSettings.title,
      logo: require("@/assets/images/logos.png"),
      menuList: [],
      drawer: false
    };
  },
  computed: {
    ...mapGetters([
      "sidebar",
    ])
  },
  mounted(){
    if(Array.isArray(this.userInfo.routes)){
        this.init(this.userInfo.routes)
    }
  },
  methods: {
    init(val) {
      this.menuList = val.filter(
        item => item.children && item.meta
      );
      this.menuListCopy = JSON.parse(JSON.stringify(this.menuList));
    },
    ChangeShow() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async closeDrawer() {
      this.dialog = false;
      console.log("tag", this.dialog);
      //  debugger
    },

    OnMouseEnter(e) {
      this.$store.dispatch("app/openSideBar");
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (e.clientY > 33 && e.clientY < 70) {
          return;
        } else {
          this.$store.dispatch("app/openSideBar");
        }
      }, 400);
    },

    OnMouseLeave(e) {
      clearTimeout(this.timer);
      const _this = this;
      this.timer = setTimeout(() => {
        if (e.clientY > 33 && e.clientY < 70) {
          return;
        } else {
          _this.$store.dispatch("app/closeSideBar");
        }
      }, 500);
    },

    // 退出登录
    async exit() {
      window.location.href = "/logout";
    },
    // 过滤菜单信息
    menuFilter(value) {
      console.info(value);
      const val = value.trim();
      this.menuList = this.menuListCopy
        .filter(item => item.children && item.meta)
        .map(element => {
          const el = { ...element };
          console.log("element", el);
          el.children = element.children.filter(item => {
            return item.meta.title.includes(value.trim());
          });
          return el;
        })
        .filter(item => {
          return item.children && item.children.length > 0 && item.meta;
        });
      console.log("menuList", this.menuList);
      if (val && this.menuList && this.menuList.length > 0) {
        this.searchMenu = this.menuList[0].children[0].name;
      }
    },
    goRouter() {
      this.$router.push({
        name: this.searchMenu
      });
      this.searchMenu = "";
      this.menuList = JSON.parse(JSON.stringify(this.menuListCopy));
    }
  }
};
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
      background: rgb(255 255 255 / 13%);
      border-color: rgb(255 255 255 / 13%);
      color: #fff;
      font-size: 14px;
      height: 28px;
      line-height: 28px;
    }
    // .el-input.is-focus .el-input__inner {
    //   border-color: #ffffff22;
    // }
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
      background: rgb(255 255 255 / 20%);
      border-color: rgb(255 255 255 / 20%);
      &:hover {
        background: rgb(255 255 255 / 40%);
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
    .el-icon-circle-close {
      font-size: 20px;
    }
  }
}
.headers {
  height: 61px;
  min-width: 296px;
  background: #1d69ce;
  background-size: 100% 106%;
  background-position: 0 0;
  padding: 0 28px 0 20px;
  overflow: hidden;
  .header-big {
    display: block;
  }
  .header-small {
    display: none;
    z-index: 2008;
    .sys-title {
      position: absolute;
      left: 16px;
      top: 12px;
      height: 25px;
      font-size: 14px;
      white-space: nowrap;
      font-weight: 600;
      color: #fff;
      line-height: 25px;
    }
    .header-right {
      float: right;

      height: 48px;
      line-height: 48px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .title-box {
        overflow: hidden;
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
      .el-button {
        height: 44px;
        background: transparent;
        border: none;
        font-size: 18px;
      }
      .setting-box,
      .exit-box {
        cursor: pointer;
      }
    }

    ::v-deep .el-drawer__open .el-drawer.ltr,
    .el-drawer.rtl {
      top: 48px;
      height: 93%;

      .el-collapse-item__header {
        padding-left: 18px;
      }
      .el-collapse-item__content {
        padding-left: 18px;
      }
      .el-collapse-item__content > div {
        padding-top: 8px;
      }
      .el-collapse-item__header.is-active {
        color: #409eff;
      }
    }
  }
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

@media screen and(max-width: 620px) {
  .headers .header-big {
    display: none;
  }
  .headers .header-small {
    display: block;
  }
}
</style>
