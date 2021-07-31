<!--  view-process-->
<template>
    <el-dialog @open="opened" @close="close" :fullscreen="fullScreen" append-to-body v-el-drag-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" width="960px">
        <template slot="title">
            <span class="el-dialog__title" style="user-select: none; cursor: default">流程进度</span>
            <button type="button" aria-label="FullScreen" class="el-dialog__headerbtn" style="right: 40px; color: #909399">
                <span class="dialog-full-screen" v-if="fullScreen" @click="fullScreen = false">
                    <svg-icon icon-class="recover-screen" />
                </span>
                <span class="dialog-full-screen" v-else @click="fullScreen = true">
                    <svg-icon icon-class="fullscreen" />
                </span>
            </button>
        </template>
        <modeler-setting-control v-model="instance.definition" :status="instance.status" @element-click="elementClick">
            <div style="text-align: right;">
                <span style="display:inline-block;margin-right:8px"> <span v-if="getElementName">当前选中节点：</span>{{getElementName}}</span>
                <el-Button :disabled="showSetting" type="primary" @click="getTaskExternalParticipants">
                    设置参与者
                </el-Button>
                <el-Button :disabled="showSetting" type="primary" @click="deleteParticipants">
                    清除流程参与者
                </el-Button>
            </div>

        </modeler-setting-control>
        <take-part-in-setting  ref="takePartInSetting" @on-save-take-part-setting="savedParticipant"></take-part-in-setting >
    </el-dialog>
</template>

<script>
import processDefinitionApi from "@/api/process-definition-api";
import processPermissionsApi from "@/api/process-permissions-api";
import {ModelerSettingControl,processError} from '@crcc/bpmn-basic'

import takePartInSetting from '@/views/process-bpmn/components/take-part-in-setting.vue'
import elDragDialog from '@/directive/el-drag-dialog/index'

export default {
    directives:{
        elDragDialog
    },
    name:'processSetting',
    props: {
        //流程实例得id
        bpmnId: String,
        //节点参与者数据
        value: {
            type: Object,
            default: function () {
                return {
                    companyId: "",
                    id: "",
                    participants: [],
                    processDefinitionId: "",
                    processDefinitionKey: "",
                    taskDefinitionKey: ""
                }
            }
        },
    },
    components: {
        takePartInSetting,
        ModelerSettingControl
    },
    data() {
        return {
            dialogVisible: false,
            fullScreen: false,
            //节点类型
            element: null,
            //流程内容
            instance: {
                definition: "",
                status: []
            },

        };
    },
    computed: {
        showSetting() {
            let type = this.element?.type || null
            return type != 'bpmn:UserTask'
        },
        getElementName() {
            let name = this.element?.businessObject?.name || '';
            return name;
        }
    },
    methods: {
        opened() {
            this.$nextTick(async () => {
                this.loadInstanceInfo(this.bpmnId);
            });
        },
        //元素点击
        elementClick(element, eventObj) {
            this.element = element;
            this.value.taskDefinitionKey = element.id;
        },
        //清除参与者
        deleteParticipants() {          
            this.$confirm('此操作清除流程参与者, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                  processPermissionsApi.deleteParticipants(encodeURI(this.value.processDefinitionKey), encodeURI(this.value.companyId), encodeURI(this.value.taskDefinitionKey)).then(res => {
                    this.$message({
                        type: 'success',
                        message: '流程参与者清除成功!'
                    });
                }).catch(err => processError.message[err[0]])

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消清除'
                });
            });

        },
        //保存参与者设置
        savedParticipant(data) {
            this.value.participants = [...data.participants];
            processPermissionsApi.saveTaskExternalParticipants(this.value).then(res => {
                this.info('参与者设置成功')
            }).catch(err => this.error[err[0]])
        },

        //获取流程图
        loadInstanceInfo(id) {
            processDefinitionApi.getFlowXml(id).then(xml => {
                if (xml) {
                    this.instance.definition = xml;
                    this.instance.status = [];
                }

            }).catch(err => this.error(err.message[0])).finally(() => this.loadingProcess = false);

        },
        //获取流程某一个节点的参与者
        getTaskExternalParticipants() {
            processPermissionsApi.getTaskExternalParticipants(encodeURI(this.value.processDefinitionKey), encodeURI(this.value.companyId), encodeURI(this.value.taskDefinitionKey)).then(res => {
                if (res) {
                    let participants = JSON.parse(res.participants);

                    this.value = Object.assign(this.value, res, {
                        participants
                    })
                } else {
                    this.value.participants = [];
                    this.value.id = '';
                }
                this.$refs.takePartInSetting.showDialogVisibel({
                    element: this.element,
                    participants: this.value.participants
                });

            }).catch(err => processError.message[err[0]])
        },
        close() {
            this.dialogVisible = false;
            this.element =null;
            this.fullScreen =false;
            this.$emit('close');
        }
    },

};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
    .dialog-full-screen {
        margin-right: 12px;
    }
}

::v-deep .el-dialog__body {
    padding: 8px;
    height: 480px;

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
    }

    .el-tab-pane {
        height: 100%;
    }

    .free-jump {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding-bottom: 8px;

        .table-box {
            flex: 1;
            padding: 0px 0px 8px;
        }
    }

    .el-table::before {
        height: 0px;
    }

    .el-table__empty-block {
        border-right: none;
    }
}

::v-deep .el-dialog.is-fullscreen {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    left: 0px !important;
    top: 0px !important;

    .el-dialog__body {
        flex: 1;
    }
}
</style>
