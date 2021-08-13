<template>
  <div class="err-page-main">
    <div class="errPage-container">
      <el-row>
        <el-col :span="12">
          <h1 class="text-jumbo text-ginormous">对不起！</h1>
          <h2>你没有权限访问该系统</h2>
        </el-col>
        <el-col :span="12">
       
          <div class="err-img">

          </div>
        </el-col>
      </el-row>
 
    </div>
  </div>
</template>

<script>

export default {
  name: 'page401',
}
</script>

<style lang="scss" scoped>
$toggleColor:url(./../../assets/401_images/401.gif);
.err-page-main {
  position: fixed;
  height: 100%;
  width: 100%;
  background: #fff;
}
.errPage-container {
  width: 800px;
  max-width: 100%;
  margin: 0 auto;
  padding: 100px 0;

 
  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }
  .err-img{
    height: 428px;
    width: 313px;
    background: $toggleColor no-repeat ;
  }
}
</style>
