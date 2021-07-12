<template>
  <el-dialog
    title="选择变量"
    :visible.sync="showDialog"
    width="350px"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-table
      ref="varlist"
      :show-header="false"
      :data="paramList"
      height="200"
      highlight-current-row
    >
      <el-table-column type="index" width="30"></el-table-column>
      <el-table-column prop="label"></el-table-column>
    </el-table>
    <el-footer>
      <el-row style="padding-top:8px;text-align: center;">
        <el-button plain @click="showDialog = false">取消</el-button>
        <el-button type="primary" plain @click="confirm">确认</el-button>
      </el-row>
    </el-footer>
  </el-dialog>
</template>

<script>
import ParamList from "./inner-params";

export default {
  name: "VariableSelect",

  data() {
    return {
      showDialog: false,
      paramList: ParamList,
      confirmCallBack: null
    };
  },

  methods: {
    open(callback) {
      this.confirmCallBack = callback;
      this.showDialog = true;
    },

    confirm() {
      if (!this.selectedVar) {
        this.warn("请选择变量");
        return;
      }
      if (typeof this.confirmCallBack == "function") {
        this.confirmCallBack(this.selectedVar);
        this.showDialog = false;
      }
    }
  },

  computed: {
    selectedVar() {
      return this.$refs.varlist.store.states.currentRow;
    }
  }
};
</script>

<style>
</style>
