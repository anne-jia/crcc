<template>
  <el-dialog
    title="错误"
    :visible.sync="showDialog"
    width="550px"
    append-to-body
    v-draggable
    :close-on-click-modal="false"
  >
    <el-table :data="errorList" border height="350">
      <el-table-column label="信息" prop="message" show-overflow-tooltip></el-table-column>
      <el-table-column label="元素" prop="element" width="220"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  name: "ErrorDialog",

  data() {
    return {
      errorList: [],
      showDialog: false
    };
  },

  methods: {
    showErrors(errors) {
      this.errorList = errors;
      this.showDialog = true;
    }
  }
};
</script>