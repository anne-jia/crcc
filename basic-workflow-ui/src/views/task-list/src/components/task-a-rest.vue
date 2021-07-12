<template>
  <div
    class="take-a-rest"
    style="height: calc(100vh - 120px); display:flex; flex-direction: row; justify-content: center; align-items: center;"
    v-loading="loading"
  >
    <div
      class="middle-area"
      :style="{ 'background-image':'url('+ imgSrc+')', 'background-size':'180px', 'background-repeat': 'no-repeat', 'background-position': '16px 0px' }"
    ></div>
    <div
      class="middle-area"
      style="display:flex; flex-direction:column; justify-content:center; width:400px;"
    >
      <p
        style="font-weight:600; font-size:18px; margin:0; margin-bottom:18px; padding-top:60px; color:rgb(66, 66, 66);"
      >活干完了，休息一下吧~</p>
      <el-button
        @click="refresh"
        plain
        style="width:100px; border-color:rgb(67,152,255); color:rgb(67,152,255); font-size:14px; padding-top:6px; padding-bottom:5px;"
      >刷&nbsp;&nbsp;新</el-button>
    </div>
  </div>
</template>

<script>
import ZeroPng from "@/assets/zero.png";

export default {
  name: "TaskARest",

  data() {
    return {
      imgSrc: ZeroPng,
      loading: false
    };
  },

  methods: {
    refresh() {
      this.loading = true;
      this.$emit("on-refresh");
      setTimeout(() => {
        this.loading = false;
      }, 500);
    }
  }
};
</script>

<style lang="scss">
.take-a-rest {
  .middle-area {
    height: 250px;
    width: 200px;
  }
}
</style>
