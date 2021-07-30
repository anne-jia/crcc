<!--  view-process-->
<template>
    <el-dialog @open="open" @close="close"   :fullscreen="fullScreen" append-to-body v-el-drag-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" width="1000px">
        <template slot="title">
            <span class="el-dialog__title" style="user-select: none; cursor: default">流程处理</span>
            <button type="button" aria-label="FullScreen" class="el-dialog__headerbtn" style="right: 40px; color: #909399">
                <span class="dialog-full-screen" v-if="fullScreen" @click="fullScreen = false">
                    <svg-icon icon-class="recover-screen" />
                </span>
                <span class="dialog-full-screen" v-else @click="fullScreen = true">
                    <svg-icon icon-class="fullscreen" />
                </span>
            </button>
        </template>
        <processLayout width="360px" :scroll='false'>
            <template slot="main">
             <iframe style="width:100%;height:100%;border:none;" :src="fullPageUrl"></iframe>
            </template>
            <template slot="aside">
                <el-tabs v-model="selectedTab" type="card" style="height: 100%">
                    <el-tab-pane label="处理" name="todo">
                        <div class="scrollBar">
                            <el-form label-position="left" label-width="80px">
                                <el-form-item label="审批意见">
                                    <el-input style="width:100%" v-model="userMsg" maxlength="100" type="textarea" :rows="6" placeholder="请输入审批意见, 少于100字"></el-input>
                                </el-form-item>
                                <el-form-item label="流程走向">
                                    <el-select v-model="processResult" style="width:100%;" placeholder="请选择" value-key="id">
                                        <el-option v-for="item in processOptions" :key="item.id" :label="item.name" :value="item"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-if="canUpload" label="附件" >
                                    <el-upload :action="uploadUrl" :data="uploadData" :show-file-list="false" :multiple="false" :on-success="onUploadSuccess" :before-upload="onBeforeUpload">
                                        <el-button type="primary" plain >上传</el-button>
                                    </el-upload>
                                </el-form-item>
                                <div  v-if="canUpload" style="color:red;padding-bottom: 8px;">注意：文件大小应小于10M</div>

                            </el-form>
                            <el-collapse v-model="activeFileTab" v-show="flowFiles.length>0" accordion>
                                <el-collapse-item v-for="task in flowFiles" v-bind:key="task.id" :title="task.name" :name="task.id">
                                     <el-table :data="task.files" border stripe  highlight-current-row>
                                         <el-table-column prop="uploader" label="操作人" header-align="center" align="left" show-overflow-tooltip></el-table-column>
                                         <el-table-column prop="fileName" label="附件名称" header-align="center" align="left" show-overflow-tooltip></el-table-column>
                                         
                                         <el-table-column prop="uploadTime" label="上传时间" align="center" show-overflow-tooltip></el-table-column>
                                         <el-table-column prop="uploader" label="操作" align="center" show-overflow-tooltip class-name="table-btn-group">
                                             <template slot-scope="{row}">
                                                   <el-button type="text" icon="el-icon-download" @click="downloadFile(row.id)"></el-button >
                                                <el-button type="text" v-if=" row.procTaskDefId == currentTask.taskDefKey" icon="el-icon-delete"  @click="deleteFile(row.id)"></el-button>
                                             </template>
                                         </el-table-column>
                                     </el-table>
                                    <!-- <el-row class="file-row" style="padding-left: 12px; padding-right: 10px;" v-for="file in task.files" v-bind:key="file.id">
                                        <el-row class="file-upload-info">{{ file.uploader }}, {{ file.uploadTime }}</el-row>
                                        <el-row>
                                            <el-col :span="19">{{ file.fileName }}</el-col>
                                            <el-col :span="5" style="text-align: right;">
                                                <i class="el-icon-download" @click="downloadFile(file.id)"></i>
                                                <i v-if="file.procTaskDefId == currentTask.taskDefKey" class="el-icon-delete" style="margin-left: 10px;" @click="deleteFile(file.id)"></i>
                                            </el-col>
                                        </el-row>
                                    </el-row> -->
                                </el-collapse-item>
                            </el-collapse>

                        </div>

                        <div class="deal">
                            <el-button type="primary" plain @click="completeTask">处理</el-button>

                        </div>

                    </el-tab-pane>
                    <el-tab-pane label="记录" name="done">
                        <div class="scrollBar" style="overflow:scroll;height:100%; padding:8px">
                            <el-table :data="instLog" border stripe  highlight-current-row>
                                <el-table-column type="expand" width="54px" label="详情">
                                    <template slot-scope="{ row }">
                                        <el-form label-position="left" label-width="80px" inline>
                                            <el-form-item label="开始时间">
                                                <span>{{ row.startTime }}</span>
                                            </el-form-item>
                                            <el-form-item label="结束时间">
                                                <span>{{ row.endTime }}</span>
                                            </el-form-item>
                                            <el-form-item label="处理时长">
                                                <span>{{ row.duration | milliSecondFommatter }}</span>
                                            </el-form-item>
                                            <el-form-item label="委托人">
                                                <span>{{ row.owner }}</span>
                                            </el-form-item>
                                            <el-form-item label="处理结果">
                                                <span>{{ row.operateResult }}</span>
                                            </el-form-item>
                                            <el-form-item label="处理意见">
                                                <span>{{ row.userMsg }}</span>
                                            </el-form-item>
                                        </el-form>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="taskName" label="环节" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="operator" label="处理人" width="85" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="operateTime" label="处理时间" width="150" show-overflow-tooltip></el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </template>
        </processLayout>
    </el-dialog>
</template>

<script>
import processLayout from "./components/process-layout.vue";
import procesTasksApi from "@/api/process-task-api";
import elDragDialog from '@/directive/el-drag-dialog/index'

export default {
    directives:{
        elDragDialog
    },
    name:'processDeal',
    props: {},
    components: {
        processLayout,
    },
    data() {
        return {
            dialogVisible: false,
            fullScreen: false,
            //当前任务
            currentTask: {},
            processOptions: [],
            processResult: null,
            isMustComment: true,
            canUpload: true,
            userMsg: "",
            activeFileTab: "",
            flowFiles: [],
            uploadUrl: window.CLIENT_URL + "tasks/upload",
            selectedTab: "todo",
            instLog: [1, 3],
            fullPageUrl: "",
            isProcessingTask: false
        };
    },
    computed: {
        taskParam() {
            return {
                seq: this.processResult ? this.processResult.id : ""
            };
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
        close() {
            this.dialogVisible = false;
            this.$emit('close',this.currentTask.id);
        },
        open(task) {
            if(task){
                this.currentTask = {...task};
                this.userMsg = "";
                this.dialogVisible = true;
                this.selectedTab = "todo";
                if(task.id){
                    this.loadTaskProcessor(task.id);
                    this.loadFiles(task.id);
                    this.loadProcessLog(task.procInstId);
                }
                
            }
            
        },

        loadTaskProcessor(taskId) {
            procesTasksApi.getTaskProcessor(taskId)
                .then(ret => {
                    if (ret) {
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
                    }

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
                taskId: this.currentTask.id,
                msg: this.userMsg.trim(),
                result: this.processResult.name ? this.processResult.name : ""
            };
            if (this.processOptions.length > 0) {
                param.variables = this.taskParam;
            }
            if (!this.isProcessingTask) {
                this.isProcessingTask = true;
                procesTasksApi.completeTask(param)
                    .then(() => {
                        this.isProcessingTask = false;
                        this.info("处理完毕");
                        this.dialogVisible = false;
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
            procesTasksApi.deleteFile(fileId).then(() => {
                this.info('删除成功')
                this.loadFiles();
            });
        },

        downloadFile(fileId) {
            window.open(window.CLIENT_URL + `/tasks/download?fileId=${fileId}`);
        },

        loadFiles() {
            procesTasksApi.loadFlowFiles(this.currentTask.id)
                .then(ret => {
                    // 处理审批文件
                    if (ret) {
                        let temp = [];
                        ret.forEach(file => {
                            let task = temp.findIndex(t => t.id == file.procTaskDefId);
                            if (task==-1) {
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
                    }

                })
                .catch(err => {
                    this.error(err.message[0]);
                });
        },

        loadProcessLog(instId) {
            procesTasksApi.getLogs(instId)
                .then(ret => {
                    this.instLog = ret;
                })
                .catch(err => {
                    this.error(err.message[0]);
                });
        }
    },
    mounted() {

    },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header{
    .dialog-full-screen{
            margin-right: 12px;
    }
}
::v-deep .el-dialog__body {
    padding: 8px;
    height: 580px;

    .el-tabs {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .el-tabs__header {
        margin: 0px;
    }

    .el-tabs__content {
        flex: 1;

        .el-tab-pane {
            height: 100%;
        }

        #pane-todo {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;

            .scrollBar {
                overflow: scroll;
                padding: 8px;
            }

            .deal {
                text-align: right;
                padding: 0px 8px 8px;
            }
        }
    }

    .el-table::before {
        height: 0px;
    }

    .el-table__empty-block {
        border-right: none;
    }
}
::v-deep .el-dialog.is-fullscreen{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    left: 0px !important;
    top: 0px  !important;
     .el-dialog__body{
         flex: 1;
    }
}
</style>
