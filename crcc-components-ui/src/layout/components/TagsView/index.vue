<template>
  <div id="tags-view-container" class="tags-view-container">
    <crcc-tabs />
  
  </div>
</template>

<script>

export default {
  name:"tagsView",
  components: {
    // ScrollPane,
    crccTabs: () => import('./components/crcc-tabs.vue')
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
   
  },
  watch: {
    
  },
  mounted() {
    
  },
  methods: {
   
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
