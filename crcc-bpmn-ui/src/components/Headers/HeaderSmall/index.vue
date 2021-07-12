<template>
  <div class="clearfix">
    <div class="sys-title"><span>物资编码管理子系统V2.0</span></div>

    <!-- 右侧内容区域 -->
    <div class="header-right">

      <div class="title-box exit-box">
        <svg-icon icon-class="tuichu" class="tuichu-avatar" />
        <span class="exit" @click="exit"> 退出</span>
      </div>
      <el-button @click="drawer = true"  style="margin-left: 8px;color:#004098">
        <i :class="drawer?'el-icon-close':'el-icon-s-fold'"></i>
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
        <el-collapse-item v-for=" menulist in permission_menus" :key="menulist.id">
          <template slot="title">
            {{menulist.label}}
          </template>
          <div v-for="menu in menulist.items" :key="menu.label">
            <router-link tag="a" :to="menu.routerLink" @click.native="$refs.drawer.closeDrawer()">{{menu.label}}</router-link>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-drawer>
  
    
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    ...mapGetters(["name", "positions", "mainPosition","permission_menus"]),
  },
  methods: {
    // 退出登录
    async exit() {
      window.location.href = "/logout";
    },
   async closeDrawer(){
       this.dialog = false;
      //  debugger
    },
  },
};
</script>

<style lang="scss" scoped>
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
}

::v-deep .el-collapse-item__header{
  padding-left: 18px;
}
::v-deep .el-collapse-item__content{
   padding-left: 18px;
}
::v-deep .el-collapse-item__content>div{
   padding-top: 8px;
}
::v-deep .el-collapse-item__header.is-active{
  color:#409EFF
}
</style>