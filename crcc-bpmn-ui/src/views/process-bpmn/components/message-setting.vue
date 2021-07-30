<!--  message-setting-->
<template>
    <el-dialog  @close='close' append-to-body title='消息设置' v-el-drag-dialog :visible.sync='dialogVisible' :close-on-click-modal='false' width=''>
        <el-tabs v-model="activeTab">
            <el-tab-pane name="basic" label="基本设置">
                <el-card class="box-card" shadow="never" style="margin-bottom:8px">
                    <div slot="header">
                        <span>通用设置</span>
                    </div>
                    <div style="padding:8px 0 8px 16px">
                        <el-checkbox v-model="messageSetting.sendMessage" label="启动流程进度消息"></el-checkbox>
                    </div>
                    <div style="padding:8px 0 8px 16px" v-if="showCandidateUserOption">
                        <el-checkbox :disabled="!messageSetting.sendMessage" v-model="messageSetting.recipients.candidateUsers" label="发送给当前节点的所有参与者"></el-checkbox>
                    </div>
                </el-card>
                <el-card class="person-box" shadow="never">
                    <div slot="header">
                        <span>抄送人</span>
                    </div>
                    <el-row>
                        <el-col :span="12">
                            <crcc-card :scroll="true" className="position-list" title="岗位详情">
                                <template slot="title">
                                    <div style="float: right;">
                                        <el-tooltip class="item" effect="light" content="添加岗位" placement="bottom">
                                            <el-button type="text" icon="el-icon-plus" @click="openPostion"></el-button>
                                        </el-tooltip>
                                    </div>
                                </template>
                                <div>
                                    <el-table stripe border highlight-current-row :data="messageSetting.recipients.sysJob">
                                        <el-table-column label="岗位名称" align="left" header-align="center" show-overflow-tooltip prop="name">
                                        </el-table-column>
                                        <el-table-column label="操作" prop="name" width="58px" align="center" class-name="tag-sigle">
                                            <template slot-scope="{$index }">
                                                <el-button type="text" icon="el-icon-delete" @click="messageSetting.recipients.sysJob.splice($index, 1)"></el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </crcc-card>
                        </el-col>
                        <el-col :span="12">
                            <crcc-card :scroll="true" className="position-list" title="人员详情">
                                <template slot="title">
                                    <div style="float: right;">
                                        <el-tooltip class="item" effect="light" content="添加人员" placement="bottom">
                                            <el-button type="text" icon="el-icon-plus" @click="openUsers"></el-button>
                                        </el-tooltip>
                                        <el-tooltip class="item" effect="light" content="添加发起人员" placement="bottom">
                                            <el-button type="text" icon="el-icon-setting" @click="addStartUser"></el-button>
                                        </el-tooltip>
                                    </div>
                                </template>
                                <div>
                                    <el-table stripe border highlight-current-row :data="messageSetting.recipients.sysUser">
                                        <el-table-column label="人员" prop="userName" align="left" header-align="center" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column label="操作" prop="userName" width="58px" align="center" class-name="tag-sigle">
                                            <template slot-scope="{$index }">
                                                <el-button type="text" icon="el-icon-delete" @click="messageSetting.recipients.sysUser.splice($index, 1)"></el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </crcc-card>

                        </el-col>
                    </el-row>
                </el-card>
            </el-tab-pane>
            <el-tab-pane name="template" label="自定义模板">
                <el-card class="message-box" shadow="never">
                    <div slot="header">
                        <span>消息模板</span>
                    </div>
                    <el-col :offset="3" :span="18">
                        <el-form ref="form" :model="messageSetting.template" label-width="80px">
                            <el-form-item label="模版选项">
                                <el-checkbox v-model="messageSetting.template.enabled" label="使用自定义消息模板"></el-checkbox>
                            </el-form-item>
                            <el-row style="padding:16px; padding-left:80px; color:red; line-height:1.5em; padding-top:0">
                                自定义消息模版中支持使用流程变量进行替换，形如：${your_variable}
                                <br />
                                例如：您提交的编号为${code}的报销单有新的进度了
                                <br />使用流程变量时，务必保证在提交流程时，将相应变量提交给流程实例。
                            </el-row>
                            <el-form-item label="消息标题">
                                <el-input v-model="messageSetting.template.title" :disabled="!messageSetting.template.enabled"></el-input>
                            </el-form-item>
                            <el-form-item label="消息内容" style="margin-bottom:0">
                                <el-input type="textarea" v-model="messageSetting.template.body" rows="6" :disabled="!messageSetting.template.enabled"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-card>
            </el-tab-pane>
        </el-tabs>
        <operationPosition ref="operationPosition" :checkedNodes="messageSetting.recipients.sysJob" @addPosition='addPosition'></operationPosition>
        <operationUsers ref="operationUsers" :checkedNodes="messageSetting.recipients.sysUser" @addUsers="addUsers"></operationUsers>
        <span slot="footer">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="confirm">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import crccCard from "@/components/crcc-main/crcc-card/index.vue";
import operationPosition from './take-part-components/operation-position.vue'
import operationUsers from './take-part-components/operation-users.vue'
import startUser from "./take-part-components/inner-parms-start";
import elDragDialog from '@/directive/el-drag-dialog/index'

export default {
    directives:{
        elDragDialog
    },
    
    name:'messageSetting',
    props: {},
    components: {
        crccCard,
        operationPosition,
        operationUsers,
    },
    data() {
        return {
            //设置人增加发起人
            startUser: startUser,
            dialogVisible: false,
            activeTab: "basic",
            moddleElement: null,
            showCandidateUserOption: true,
            messageSetting: {
                sendMessage: false,
                template: {
                    enabled: false,
                    title: "",
                    body: ""
                },
                recipients: {
                    candidateUsers: true,
                    sysJob: [],
                    sysUser: []
                }
            }

        }
    },
    computed: {

    },
    methods: {
        showHelp(data) {
            if (data) {
                this.moddleElement = data.element;
                this.showCandidateUserOption = !!this.moddleElement &&
                    this.moddleElement.businessObject &&
                    this.moddleElement.businessObject.$type == "bpmn:UserTask";
                if (data.setting && Object.getOwnPropertyNames(data.setting).length > 0) {
                    this.messageSetting = data.setting;
                } else {
                    this.messageSetting.sendMessage = false;
                    this.messageSetting.template.enabled = false;
                    this.messageSetting.template.title = "";
                    this.messageSetting.template.body = "";
                    this.messageSetting.recipients.candidateUsers = true;
                    this.messageSetting.recipients.sysJob = [];
                    this.messageSetting.recipients.sysUser = [];
                }
                this.activeTab = "basic";
                this.dialogVisible = true;
            }

        },
        //打开岗位弹框
        openPostion() {
            this.$refs.operationPosition.dialogVisible = true;
        },
        //添加人员
        openUsers() {
            this.$refs.operationUsers.dialogVisible = true;
        },
        //添加岗位
        addPosition(checklist) {
            this.messageSetting.recipients.sysJob = checklist;
        },
        //增加人员
        addUsers(checklist) {
            let find = this.messageSetting.recipients.sysUser.findIndex(j => j.userId == this.startUser[0].userId);
            let newArr = []
            if (find==-1) {
                 checklist.map(item=>{
                        newArr.push({
                            userId:item.id,
                            userName:item.name,
                            isVariable:false
                        })
                })
                this.messageSetting.recipients.sysUser = newArr;
            } else {
                  checklist.map(item=>{
                        if(item.id!=this.startUser[0].userId){
                        newArr.push({
                            userId:item.id,
                            userName:item.name,
                            isVariable:false
                        })
                    }    
                })
                this.messageSetting.recipients.sysUser = checklist.concat(this.startUser)

            }
        },
        //设流程启动人收到信息
        addStartUser() {
            if (this.messageSetting.recipients.sysUser.findIndex(j => j.userId == this.startUser[0].userId)==-1) {
                this.messageSetting.recipients.sysUser = this.messageSetting.recipients.sysUser.concat(this.startUser)
            }
        },

        confirm() {
            if (this.messageSetting.template.enabled) {
                if (!this.messageSetting.template.title) {
                    this.warn("请填写消息标题");
                    return;
                }
                if (!this.messageSetting.template.enabled) {
                    this.warn("请填写消息内容");
                    return;
                }
            }
            this.$emit("on-message-save", {
                element: this.moddleElement,
                setting: this.messageSetting
            });
            this.dialogVisible = false
        },

        close() {
            this.dialogVisible = false
        },

    },
    mounted() {

    },
}
</script>

<style lang="scss" scoped>
$borderColor: #dcdfe6;
@import '@/styles/mixin.scss';

::v-deep .el-dialog__body {
    padding: 0px 8px;
    overflow: hidden;
    height: 460px;

    .el-row {
        height: 100%;

        .el-col {
            height: 100%;
        }

        .el-col+.el-col {
            border-left: 1px solid $borderColor;
        }
    }

    .el-tabs {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        .el-tabs__content {
            flex: 1;
        }

        .el-tab-pane {
            box-sizing: border-box;
            padding-bottom: 8px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
        }
    }

    .el-card {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        .el-card__header {
            background-color: #f3f3f3;
            padding: 8px;
        }

        .el-card__body {
            padding: 8px;
            overflow: scroll;
            @include scrollBar;
        }

    }

    .person-box {
        flex: 1;

        .el-card__body {
            padding: 0px;
            flex: 1;
            overflow: hidden;
        }
    }

    .message-box {
        flex: 1;

        .el-card__body {
            flex: 1;
        }

    }
}
</style>
