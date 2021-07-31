<<<<<<< HEAD
<template>
  <div class="crcc-layout">
    <div class="crcc-main scrollBar">
      <div :class="active ? 'toggle active' : 'toggle'" @click="changeActive">
        <slot name="main"></slot>
        <i
          :class="active ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'"
        ></i>
      </div>
    </div>
    <div
      :class="active ? 'crcc-aside show' : 'crcc-aside hide'"
      :style="getWidth"
      ref="aside"
    >
      <slot name="aside"></slot>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: true,
    };
  },
  components: {},
  props: {
    width: {
      type: String,
      default: "260px",
    },
  },
  methods: {
    changeActive() {
      this.active = !this.active;
    },
  },
  computed: {
    getWidth() {
      console.log(this.width);
      if (this.active) {
        return {
          transform: "translateX(0)",
          width: this.width,
        };
      } else {
        return {
          transform: "translateX(100%)",
          width: "0px",
        };
      }
    },
  },
  mounted() {},
  updated() {},
};
</script>
<style lang="scss" scoped>
$borderColor: #dcdfe6;

.crcc-layout {
  height: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;
  overflow: hidden;
  align-items: center;
  .crcc-main {
    border: 1px solid $borderColor;
    position: relative;
    height: 100%;
    flex: 1;
    overflow: scroll;
    .toggle {
      width: 34px;
      height: 52px;
      border: 1px solid $borderColor;
      color: #909091;
      text-align: center;
      line-height: 52px;
      position: absolute;
      right: 0px;
      top: 50%;
      /* bottom: 0px; */
      transform: translateY(-26px);
      border-radius: 4px;
      border-right: none;
    }
  }
  .crcc-aside {
    margin-bottom: 0px;
    height: 100%;
    transition: width 0.2s;
  }
  .crcc-aside.show {
    border: 1px solid $borderColor;
    border-left: none;
  }
  .crcc-aside.hide {
    border: none;
  }
}
=======
<template>
  <div class="crcc-layout">
     
    <div :class="getClassName">
      <slot name="main"></slot>

     <div v-if="showAside" :class="active ? 'toggle active' : 'toggle'" @click="changeActive"  :style="getRight">
        <i
          :class="active ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'"
        ></i>
      </div>
    </div>
    <div
      v-if="showAside"
      :class="active ? 'crcc-aside show' : 'crcc-aside hide'"
      :style="getWidth"
      ref="aside"
    >
      <slot name="aside"></slot>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: true,
    };
  },
  components: {},
  props: {
    width: {
      type: String,
      default: "260px",
    },
    showAside:{
      type:Boolean,
      default:true,
    },
  scroll:{
      type:Boolean,
      default:true
  },
  },
  methods: {
    changeActive() {
      this.active = !this.active;
    },
  },
  computed: {
    getWidth() {
      if (this.active) {
        return {
          transform: "translateX(0)",
          width: this.width,
        };
      } else {
        return {
          transform: "translateX(100%)",
          width: "0px",
        };
      }
    },
  getRight(){
     if (this.active){
     let right =  (this.width.replace('px','')-0+10)+'px'
       return {
         right:right
       }
     }else{
        return {
         right: '10px'
       }
     }
  },
    getClassName(){
            if(this.scroll){
             return 'crcc-main scrollBar ';
            }else{
                return 'crcc-main';
            }
        },
  },
  mounted() {},
  updated() {},
};
</script>
<style lang="scss" scoped>
$borderColor: #dcdfe6;

.crcc-layout {
  height: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;
  overflow: hidden;
  align-items: center;
  .toggle {
      background: #fff;
      width: 34px;
      height: 52px;
      border: 1px solid $borderColor;
      color: #909091;
      text-align: center;
      line-height: 52px;
      position: absolute;
      top: 50%;
      /* bottom: 0px; */
      transform: translateY(-26px);
      border-radius: 4px;
      border-right: none;
          z-index: 9999;
    transition:  0.2s;

    }
  .crcc-main {
    border: 1px solid $borderColor;
    // position: relative;
    height: 100%;
    flex: 1;
    overflow: hidden;
  }
   .crcc-main.scrollBar{
    overflow: scroll;

  }
  .crcc-aside {
    margin-bottom: 0px;
    height: 100%;
    transition: width 0.2s;
  }
  .crcc-aside.show {
    border: 1px solid $borderColor;
    border-left: none;
  }
  .crcc-aside.hide {
    border: none;
  }
}
>>>>>>> 12b148362cc7bfddd228cefba4549bc960391132
</style>