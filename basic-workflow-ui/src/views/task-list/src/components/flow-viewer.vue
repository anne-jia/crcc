<template>
  <el-dialog
    :visible.sync="showDialog"
    width="1000px"
    append-to-body
    :close-on-click-modal="false"
    :fullscreen="fullScreen"
    class="flow-viewer"
  >
    <template slot="title">
      <span class="el-dialog__title" style="user-select: none; cursor: default;">流程进度</span>
      <button
        type="button"
        aria-label="FullScreen"
        class="el-dialog__headerbtn"
        style="right:40px;color: #909399"
      >
        <span class="dialog-full-screen" v-if="fullScreen" @click="fullScreen=false">
          <svg-icon icon-class="recover-screen" />
        </span>
        <span class="dialog-full-screen" v-else @click="fullScreen=true">
          <svg-icon icon-class="fullscreen" />
        </span>
      </button>
    </template>
    <lt-container
      :right-style="{ 'border': 'none' }"
      :showToggle="flowJumpEnabled && (showFlowJump || showTaskAssign)"
      toggleWidth="300px"
      :style="{ 'height': fullScreen ? 'calc(100vh - 56px)': '70vh' }"
      class="right-content"
    >
      <template slot="main">
        <el-scrollbar
          style="height:100%;width:100%;"
          wrapStyle="height: calc(100% + 17px);"
          viewStyle="padding-right: 4px;padding-bottom: 5px;"
          :noresize="false"
        >
          <bpmn-viewer ref="vwr"></bpmn-viewer>
        </el-scrollbar>
      </template>
      <template slot="right">
        <el-tabs v-model="activeTab" type="border-card" style="height: 100%;">
          <el-tab-pane label="自由流跳转" name="jump" v-if="showFlowJump">
            <el-row
              style="color:#606266;line-height:40px;padding-left:16px;border-bottom:1px solid #ebeef5;"
            >勾选目标任务进行自由流跳转</el-row>
            <el-table
              ref="nodeTable"
              :data="flowNodes"
              :show-header="false"
              height="calc(100% - 90px)"
              stripe
              highlight-current-row
            >
              <el-table-column type="selection"></el-table-column>
              <el-table-column prop="name" label="勾选任务进行自由流跳转" show-overflow-tooltip></el-table-column>
            </el-table>
            <el-row style="padding:8px 8px 0; text-align:right;">
              <el-button type="primary" plain @click="jump">跳转</el-button>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="自由流指派" name="assign" v-if="showTaskAssign">
            <el-table ref="taskTable" :data="taskList" height="100%" stripe highlight-current-row>
              <el-table-column prop="taskName" label="运行中的任务" show-overflow-tooltip></el-table-column>
              <el-table-column prop="assignee" label="办理人" width="90" show-overflow-tooltip></el-table-column>
              <el-table-column label="操作" header-align="center" align="center" width="50">
                <template slot-scope="{}">
                  <el-button type="text" @click="assign">指派</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </template>
    </lt-container>
    <user-help
      ref="userHelp"
      :multiSelect="false"
      :dataAuth="false"
      @on-user-selected="onUserSelected"
    ></user-help>
  </el-dialog>
</template>

<script>
import BpmnViewer from "@/views/bpmn-viewer";
import LtContainer from "@/components/lt-container";
import { setTimeout } from "timers";
import InstMgrService from "@/api/inst-mgr-service";
import UserHelp from "@/views/participant/src/components/user-help-dialog";

export default {
  name: "FlowViewer",

  components: {
    BpmnViewer,
    LtContainer,
    UserHelp
  },

  props: {
    flowJumpEnabled: Boolean
  },

  data() {
    return {
      showFlowJump: false,
      showTaskAssign: false,
      fullScreen: false,
      flowNodes: [],
      showDialog: false,
      instId: "",
      activeTab: "jump",
      taskList: []
    };
  },

  methods: {
    open(instId) {
      if (!instId) {
        this.warn("不存在此流程");
        return;
      }
      this.instId = instId;
      this.showDialog = true;
      this.handleFlowJump();
      setTimeout(() => {
        this.$refs.vwr.showIns(instId);
      });
    },

    handleFlowJump() {
      if (this.flowJumpEnabled) {
        InstMgrService.getAuths().then(ret => {
          if (ret["FreeFlowSet"]) {
            this.showFlowJump = true;
            this.loadFlowNodes(this.instId);
            this.activeTab = "jump";
          } else {
            this.showFlowJump = false;
            this.activeTab = "assign";
          }

          this.showTaskAssign = ret["FreeFlowAssign"];
          this.loadRunning(this.instId);
        });
      }
    },

    loadFlowNodes(instId) {
      this.flowNodes = [];
      if (this.showFlowJump) {
        InstMgrService.getFreeNodes(instId).then(ret => {
          this.flowNodes = ret;
        });
      }
    },

    jump() {
      let selected = this.$refs.nodeTable.selection;
      if (!selected || selected.length == 0) {
        this.warn("请选择要跳转的任务");
        return;
      }
      let jumpInfo = {
        instId: this.instId,
        taskIds: selected.map(s => s.id).join(",")
      };
      InstMgrService.jump(jumpInfo)
        .then(() => {
          this.info("执行成功");
          this.$refs.vwr.showIns(this.instId);
          this.$refs.nodeTable.clearSelection();
          this.loadRunning(this.instId);
        })
        .catch(err => this.error(err.message[0]));
    },

    loadRunning(instId) {
      this.taskList = [];
      if (this.showTaskAssign) {
        InstMgrService.running(instId)
          .then(ret => {
            this.taskList = ret;
          })
          .catch(err => this.error(err.message[0]));
      }
    },

    assign() {
      this.$refs.userHelp.showHelp([]);
    },

    onUserSelected(user) {
      if (!user) {
        this.warn("未选中办理人，无法进行指派");
        return;
      }
      let selectedTask = this.$refs.taskTable.store.states.currentRow;
      InstMgrService.assign({
        taskId: selectedTask.taskId,
        assignee: user.userCode
      })
        .then(() => {
          this.info("执行完毕");
          this.loadRunning(this.instId);
        })
        .catch(err => this.error(err.message[0]));
    }
  }
};
</script>

<style lang="scss">
.flow-viewer {
  .el-dialog__headerbtn {
    top: 16px;

    &:hover {
      .dialog-full-screen {
        color: #409eff;
      }
    }
  }

  .right-content {
    .el-tabs__content {
      height: calc(100% - 40px);

      .el-tab-pane {
        height: 100%;
      }
    }
  }
}
</style>