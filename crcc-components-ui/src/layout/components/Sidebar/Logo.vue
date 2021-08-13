<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img v-if="titleInfo.logo" :src="titleInfo.logo" class="sidebar-logo">
        <div v-else class="sidebar-title">{{ titleInfo.title }}</div>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="titleInfo.logo" :src="titleInfo.logo" class="sidebar-logo">
        <div class="sidebar-title">{{ titleInfo.title }}</div>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'sidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    },
    titleInfo:{
      type:Object,
      default:()=>{
        return{
            logo:'',
            title:'',
        }
      }
    },
  
  },

}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 61px;
  line-height: 61px;
  background: #1959af;
  // background: url(../../../assets/images/title.jpg) no-repeat;
  /* background: rgb(24,76,169); */
  /* box-shadow:0px 0px 4px 3px #9498a0; */
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 38px;
      height: 38px;
      vertical-align: middle;
      margin-right: 2px;
      /* margin-top: 3px; */
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0 22px 0 0;
      color: #fff;
      font-weight: 600;
      line-height: 61px;
      font-size: 15px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
