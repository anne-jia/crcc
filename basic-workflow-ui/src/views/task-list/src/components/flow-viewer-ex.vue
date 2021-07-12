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
          <el-tab-pane label="审批记录" name="jump">
            <el-scrollbar
              style="height:100%"
              wrapStyle="height: calc(100% + 17px);"
              viewStyle="padding-bottom: 5px;"
              :noresize="false"
            >
              <el-table :data="instLog" style="width: 100%;" class="log-detail-form">
                <el-table-column type="expand" width="30">
                  <template slot-scope="{ row }">
                    <el-form label-position="left" label-width="80px" inline>
                      <el-form-item label="开始时间">
                        <span>{{ row.startTime }}</span>
                      </el-form-item>
                      <el-form-item label="结束时间" v-if="!!row.endTime">
                        <span>{{ row.endTime }}</span>
                      </el-form-item>
                      <el-form-item label="处理时长" v-if="!!row.duration">
                        <span>{{ row.duration | milliSecondFommatter }}</span>
                      </el-form-item>
                      <el-form-item label="委托人" v-if="!!row.owner">
                        <span>{{ row.owner }}</span>
                      </el-form-item>
                      <el-form-item label="处理结果" v-if="!!row.operateResult">
                        <span>{{ row.operateResult }}</span>
                      </el-form-item>
                      <el-form-item label="处理意见">
                        <span>{{ row.userMsg }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column prop="taskName" label="环节"></el-table-column>
                <el-table-column prop="operator" label="处理人" width="85"></el-table-column>
                <el-table-column prop="operateTime" label="处理时间" width="145"></el-table-column>
              </el-table>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="附件" name="assign">
            <el-scrollbar
              style="height:100%"
              wrapStyle="height: calc(100% + 17px);"
              viewStyle="padding-right: 4px;padding-bottom: 5px;"
              :noresize="false"
            >
              <el-row>
                <el-col>
                  <el-collapse v-model="activeFileTab">
                    <el-collapse-item
                      v-for="task in flowFiles"
                      v-bind:key="task.id"
                      :title="task.name"
                      :name="task.id"
                    >
                      <el-row
                        class="file-row"
                        style="padding-left: 12px; padding-right: 10px;"
                        v-for="file in task.files"
                        v-bind:key="file.id"
                      >
                        <el-row class="file-upload-info">{{file.uploader}}, {{file.uploadTime}}</el-row>
                        <el-row>
                          <el-col :span="19">{{file.fileName}}</el-col>
                          <el-col :span="5" style="text-align: right;">
                            <i class="el-icon-download" @click="downloadFile(file.id)"></i>
                          </el-col>
                        </el-row>
                      </el-row>
                    </el-collapse-item>
                  </el-collapse>
                </el-col>
              </el-row>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </template>
    </lt-container>
  </el-dialog>
</template>

<script>
import BpmnViewer from "@/views/bpmn-viewer";
import LtContainer from "@/components/lt-container";
import { setTimeout } from "timers";
import TaskProcessService from "@/api/task-process-service";

export default {
  name: "FlowViewer",

  components: {
    BpmnViewer,
    LtContainer
  },

  props: {
    flowJumpEnabled: Boolean
  },

  data() {
    return {
      fullScreen: false,
      showDialog: false,
      instId: "",
      activeTab: "jump",
      instLog: [],
      activeFileTab: [],
      flowFiles: []
    };
  },

  methods: {
    open(instId,businessId) {
      if (!instId) {
        this.warn("不存在此流程");
        return;
      }
      this.instId = instId;
      this.showDialog = true;
      this.loadProcessLog(businessId);
      this.loadFiles(instId);
      setTimeout(() => {
        this.$refs.vwr.showIns(instId);
      });
    },

    loadProcessLog(businessId) {
      TaskProcessService.getLogs(businessId)
        .then(ret => {
          this.instLog = ret;
        })
        .catch(err => {
          this.error(err.message[0]);
        });
    },

    loadFiles(instId) {
      TaskProcessService.loadFlowInstFiles(instId)
        .then(ret => {
          // 处理审批文件
          let temp = [];
          ret.forEach(file => {
            let task = temp.find(t => t.id == file.procTaskDefId);
            if (!task) {
              task = {
                id: file.procTaskDefId,
                name: file.procTaskName,
                files: []
              };
              temp.push(task);
              this.activeFileTab.push(task.id);
            }
            task.files.push(file);
          });
          this.flowFiles = temp;
        })
        .catch(err => {
          this.error(err.message[0]);
        });
    },

    downloadFile(fileId) {
      window.open(window.CAMUNDA_URL + `/tasks/download?fileId=${fileId}`);
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

        .log-detail-form {
          label {
            font-weight: 600;
            color: #909399;
          }

          .el-form-item {
            margin-bottom: 8px;
          }
        }

        .el-collapse {
          border-top-style: dotted;
          border-bottom-style: dotted;
        }

        .el-collapse-item__header {
          padding-left: 12px;
          color: #e87338;
          height: 30px;
        }

        .el-collapse-item__content {
          padding-bottom: 12px;
        }

        .el-collapse-item__wrap {
          border-bottom-style: dotted;
        }

        .file-row {
          padding: 2px 0;

          .file-upload-info {
            font-size: 9px;
            color: #c0c4cc;
            height: 14px;
          }
        }
      }
    }
  }
}
</style>