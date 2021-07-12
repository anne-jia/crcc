<template>
  <el-dialog
    title="流程日志"
    :visible.sync="showDialog"
    width="650px"
    append-to-body
    v-draggable
    :close-on-click-modal="false"
  >
    <el-table :data="instLog" style="width: 100%;" height="400">
      <el-table-column prop="taskName" label="处理环节" width="150"></el-table-column>
      <el-table-column prop="operator" label="处理人" width="85"></el-table-column>
      <el-table-column prop="operateTime" label="处理时间" width="135"></el-table-column>
      <el-table-column prop="userMsg" label="处理意见"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import TaskProcessService from "@/api/task-process-service";

export default {
  name: "TaskProcessLog",

  data() {
    return {
      showDialog: false,

      instLog: []
    };
  },

  methods: {
    open(instId) {
      this.showDialog = true;
      TaskProcessService.getLogs(instId)
        .then(ret => {
          this.instLog = ret;
        })
        .catch(err => {
          this.error(err.message[0]);
        });
    }
  }
};
</script>

<style>
</style>
