<template>
  <div class="headers">
   <HeaderBig class="header-big clearfix" :showLogin="showLogin"/>
   <HeaderSmall class="header-small"/>
  </div>
</template>

<script>
import HeaderBig from '@/components/Headers/HeaderBig'
import HeaderSmall from '@/components/Headers/HeaderSmall'
export default {
    components:{
       HeaderBig,
       HeaderSmall
    },
    props:{
      showLogin:Boolean
    }

};
</script>

<style lang="scss" scoped>
.headers {
  height: 61px;
  min-width: 296px;
  background: #1d69ce;
  /* height: 68px; */
  // background: url(../../../assets/images/title.jpg) no-repeat;
  /* background: rgb(24,76,169); */
  /* box-shadow:0px 0px 4px 3px #9498a0; */
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