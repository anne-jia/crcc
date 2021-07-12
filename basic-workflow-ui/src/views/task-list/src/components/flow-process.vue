<template>
  <el-dialog
    :visible.sync="showDialog"
    width="1000px"
    :fullscreen="fullScreen"
    append-to-body
    :close-on-click-modal="false"
    class="task-proc"
  >
    <template slot="title">
      <span class="el-dialog__title" style="user-select: none; cursor: default;">流程处理</span>
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
      class="task-process"
      :style="{ 'height': fullScreen ? 'calc(100vh - 56px)': '70vh' }"
    >
      <template slot="main">
        <iframe style="width:100%;height:100%;border:none;" :src="fullPageUrl"></iframe>
      </template>
      <template slot="right">
        <el-tabs v-model="selectedTab" type="border-card" style="height: 100%;">
          <el-tab-pane label="处理" name="todo">
            <el-scrollbar
              style="height:100%"
              wrapStyle="height: calc(100% + 17px);"
              viewStyle="padding-right: 4px;padding-bottom: 5px;"
              :noresize="false"
            >
              <el-input
                v-model="userMsg"
                maxlength="100"
                type="textarea"
                :rows="6"
                placeholder="请输入审批意见, 少于100字"
              ></el-input>
              <el-row style="padding:8px 0;">
                <el-col :span="19">
                  <el-select
                    v-show="processOptions.length > 1"
                    v-model="processResult"
                    style="width:100%;"
                    placeholder="请选择"
                    value-key="id"
                  >
                    <el-option
                      v-for="item in processOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item"
                    ></el-option>
                  </el-select>
                  <span style="opacity:0">space</span>
                </el-col>
                <el-col :span="5" style="text-align: right;">
                  <el-button type="primary" plain @click="completeTask">处理</el-button>
                </el-col>
              </el-row>
              <el-row style="padding:8px 0;">
                <el-col :span="18" style="line-height:28px; padding-left:14px;">
                  <span style="color:red;">注意：文件大小应小于10M</span>
                </el-col>
                <el-col :span="6" style="text-align: right;">
                  <el-upload
                    :action="uploadUrl"
                    :data="uploadData"
                    :show-file-list="false"
                    :multiple="false"
                    :on-success="onUploadSuccess"
                    :before-upload="onBeforeUpload"
                  >
                    <el-button type="primary" plain v-if="canUpload">上传</el-button>
                  </el-upload>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-collapse v-model="activeFileTab" accordion>
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
                            <i
                              v-if="file.procTaskDefId == currentTask.taskDefKey"
                              class="el-icon-delete"
                              style="margin-left: 10px;"
                              @click="deleteFile(file.id)"
                            ></i>
                          </el-col>
                        </el-row>
                      </el-row>
                    </el-collapse-item>
                  </el-collapse>
                </el-col>
              </el-row>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="记录" name="done">
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
                <el-table-column prop="operateTime" label="处理时间" width="150"></el-table-column>
              </el-table>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </template>
    </lt-container>
  </el-dialog>
</template>

<script>
import TaskProcessService from "@/api/task-process-service";
import LtContainer from "@/components/lt-container";
import { setTimeout } from "timers";
import { Promise } from "q";

export default {
  name: "FlowProcess",

  components: {
    LtContainer
  },

  data() {
    return {
      showDialog: false,
      fullScreen: false,
      currentTask: {},
      processOptions: [],
      processResult: null,
      isMustComment: true,
      canUpload: true,
      userMsg: "",
      activeFileTab: "",
      flowFiles: [],
      uploadUrl: window.CAMUNDA_UPLOAD_URL + "/tasks/upload",
      selectedTab: "todo",
      instLog: [],
      fullPageUrl: "",
      isProcessingTask: false
    };
  },

  computed: {
    taskParam() {
      return { seq: this.processResult ? this.processResult.id : "" };
    },

    uploadData() {
      return {
        taskId: this.currentTask.id
      };
    }
  },

  filters: {
    milliSecondFommatter(value) {
      if (!value) return "";
      let result = [];
      let seconds = Math.round(parseInt(value) / 1000);
      let remainder = seconds;
      if (remainder >= 86400) {
        remainder = seconds % 86400;
        result.push((seconds - remainder) / 86400 + "天");
      }
      if (remainder >= 3600) {
        seconds = remainder;
        remainder = seconds % 3600;
        result.push((seconds - remainder) / 3600 + "小时");
      }
      if (remainder >= 60) {
        seconds = remainder;
        remainder = seconds % 60;
        result.push((seconds - remainder) / 60 + "分钟");
      }
      if (remainder > 0) {
        result.push(remainder + "秒");
      }
      return result.join("");
    }
  },

  methods: {
    open(task) {
      this.currentTask = task;
      this.userMsg = "";
      this.loadTaskProcessor(this.currentTask.id);
      this.loadFiles(this.currentTask.id);
      this.loadProcessLog(this.currentTask.procInstId);
      this.selectedTab = "todo";
    },

    loadTaskProcessor(taskId) {
      TaskProcessService.getTaskProcessor(taskId)
        .then(ret => {
          this.showDialog = true;
          this.fullPageUrl = ret.bizPageUrl;
          setTimeout(() => {
            this.processOptions = ret.options;
            this.processResult = null;
            if (this.processOptions && this.processOptions.length == 1) {
              this.processResult = this.processOptions[0];
            }
            this.isMustComment = ret.isMustComment;
            this.canUpload = ret.canUpload;
          });
        })
        .catch(err => {
          this.error(err.message[0]);
        });
    },

    completeTask() {
      if (this.isMustComment) {
        if (!this.userMsg || this.userMsg.trim() == "") {
          this.warn("请填写处理意见");
          return;
        }
      }

      if (!this.processResult) {
        this.warn("请选择处理结果");
        return;
      }

      let param = {
        tid: this.currentTask.id,
        msg: this.userMsg.trim(),
        result: this.processResult.name ? this.processResult.name : ""
      };
      if (this.processOptions.length > 0) {
        param.var = this.taskParam;
      }
      if (!this.isProcessingTask) {
        this.isProcessingTask = true;
        TaskProcessService.completeTask(param)
          .then(() => {
            this.isProcessingTask = false;
            this.info("处理完毕");
            this.showDialog = false;
            this.$emit("task-completed");
          })
          .catch(err => {
            this.isProcessingTask = false;
            this.error(err.message[0]);
          });
      }
    },

    onUploadSuccess() {
      this.loadFiles();
    },

    onBeforeUpload(file) {
      if (file.size > 10 * 1024 * 1024) {
        this.warn("无法上传，文件大小应小于10M");
        return Promise.reject();
      }
    },

    deleteFile(fileId) {
      TaskProcessService.deleteFile(fileId).then(() => {
        this.loadFiles();
      });
    },

    downloadFile(fileId) {
      window.open(window.CAMUNDA_URL + `/tasks/download?fileId=${fileId}`);
    },

    loadFiles() {
      TaskProcessService.loadFlowFiles(this.currentTask.id)
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
            }
            task.files.push(file);
          });
          this.activeFileTab = this.currentTask.taskDefKey;
          this.flowFiles = temp;
        })
        .catch(err => {
          this.error(err.message[0]);
        });
    },

    loadProcessLog(instId) {
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

<style lang="scss">
.task-proc {
  .el-dialog__headerbtn {
    top: 16px;

    &:hover {
      .dialog-full-screen {
        color: #409eff;
      }
    }
  }

  .el-dialog__body {
    height: calc(100% - 40px);
  }
}
.task-process {
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

  .log-detail-form {
    label {
      font-weight: 600;
      color: #909399;
    }

    .el-form-item {
      margin-bottom: 8px;
    }
  }

  .el-tabs {
    .el-tabs__content {
      height: calc(100% - 40px);

      .el-tab-pane {
        height: 100%;
      }
    }
  }
}
</style>