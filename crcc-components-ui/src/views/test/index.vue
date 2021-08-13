<template>
  <div class="dashboard-containers">
    test
  </div>
</template>

<script>

export default {
  name: 'Dashboard'
}
</script>
<style lang="scss" scoped>
  .dashboard-containers{
    height: 100%;
    background-repeat:no-repeat;
    background-size:100% 100%;
    background-origin:content-box;
    .dashboard-container{
      height: 100%;
      position: relative;
      .spirit{
          height: 70px;
          width: 200px;
          text-align: center;
          line-height: 28px;
          box-sizing: border-box;
          padding:5px 20px 10px 20px ;
          background-image: linear-gradient(#2d39bd,#1370c7 );
          position: absolute;
          color: #ffffff;
          left: 50%;
          top:0;
          transform: translate(-50%);
          border-bottom-left-radius: 68px;
          border-bottom-right-radius: 68px;
      .title{
        height: 26px;
        line-height: 26px;
        font-size: 20px;
        font-weight: 400;
        width: 100%;
        text-align: center;
        font-family: 'STCaiyun';
      }
      }
    }
  }
</style>
