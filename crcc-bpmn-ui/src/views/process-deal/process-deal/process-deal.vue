<!--  view-process-->
<template>
  <el-dialog
    @open="opened"
    @close="close"
    append-to-body
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="860px"
  >
    <template slot="title">
      <span class="el-dialog__title" style="user-select: none; cursor: default"
        >流程处理</span
      >
      <button
        type="button"
        aria-label="FullScreen"
        class="el-dialog__headerbtn"
        style="right: 40px; color: #909399"
      >
        <span
          class="dialog-full-screen"
          v-if="fullScreen"
          @click="fullScreen = false"
        >
          <svg-icon icon-class="recover-screen" />
        </span>
        <span class="dialog-full-screen" v-else @click="fullScreen = true">
          <svg-icon icon-class="fullscreen" />
        </span>
      </button>
    </template>
    <processLayout></processLayout>
  </el-dialog>
</template>

<script>
import processLayout from "./components/process-layout.vue";
export default {
  props: {},
  components: {
    processLayout,
  },
  data() {
    return {
      dialogVisible: false,
      fullScreen: false,
    };
  },
  computed: {},
  methods: {
    opened() {},
    close() {
      this.dialogVisible = false;
    },
  },
  mounted() {},
};
</script>

<style lang='scss' scoped>
</style>
