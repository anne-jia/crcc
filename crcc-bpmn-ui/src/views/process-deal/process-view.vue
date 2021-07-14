<!--  view-process-->
<template>
  <el-dialog
    @open="opened"
    @close="close"
    append-to-body
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="960px"
  >
    <template slot="title">
      <span class="el-dialog__title" style="user-select: none; cursor: default"
        >流程进度</span
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
    <processLayout>
      <template slot="aside">
        <el-tabs v-model="activeTab" type="card" style="height: 100%">
          <el-tab-pane
            label="自由流跳转"
            name="jump"
            v-if="showFlowJump"
            class="free-jump"
          >
            <div
              style="
                padding: 0px 8px 8px 8px;
                border-bottom: 1px solid #dcdfe6;
                font-weight: 300;
                line-height: 36px;
                padding: 0px 8px;
              "
            >
              请勾选目标任务进行自由流跳转
            </div>
            <div class="table-box">
              <el-table
                ref="nodeTable"
                :data="flowNodes"
                :show-header="false"
                stripe
                highlight-current-row
              >
                <el-table-column type="selection"></el-table-column>
                <el-table-column
                  prop="name"
                  label="勾选任务进行自由流跳转"
                  show-overflow-tooltip
                ></el-table-column>
              </el-table>
            </div>

            <div style="padding: 8px 8px 0; text-align: right">
              <el-button type="primary" plain @click="jump">跳转</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="自由流指派" name="assign" v-if="showTaskAssign">
            <el-table
              ref="taskTable"
              :data="taskList"
              height="100%"
              stripe
              highlight-current-row
            >
              <el-table-column
                prop="taskName"
                label="运行中的任务"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="assignee"
                label="办理人"
                width="90"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                label="操作"
                header-align="center"
                align="center"
                width="50"
              >
                <template slot-scope="{}">
                  <el-button type="text" @click="assign">指派</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </template>
    </processLayout>
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
      showFlowJump: true,
      showTaskAssign: true,
      flowNodes: [],
      instId: "",
      activeTab: "jump",
      taskList: []
    };
  },
  computed: {},
  methods: {
    opened() {},
    close() {
      this.dialogVisible = false;
    },
    jump() {},
  },
  mounted() {},
};
</script>

<style lang='scss' scoped>
::v-deep .el-dialog__body {
  padding: 8px;
  height: 480px;
  .el-tabs {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .el-tabs__header{
    margin: 0px;
  }
  .el-tabs__content {
    flex: 1;
  }
  .free-jump {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 8px;
    .table-box {
      flex: 1;
      padding: 8px 0px;
    }
  }
  .el-table::before {
    height: 0px;
  }
  .el-table__empty-block {
    border-right: none;
  }
}
</style>
