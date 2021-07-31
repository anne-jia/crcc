<!--  message-setting-->
<template>
    <el-dialog @close="close" append-to-body title="参与者设置" v-el-drag-dialog :visible.sync="dialogVisible" custom-class="take-part-in-setting" :close-on-click-modal="false" width="880px">
        <el-row>
            <el-col :span="6">
                <crcc-card :scroll="false" title="参与者分组设置">
                    <template slot="title">
                        <div style="float: right;">
                            <el-tooltip class="item" effect="light" content="添加参与者分组" placement="bottom">
                                <el-button type="text" icon="el-icon-plus" @click="addExp('add')"></el-button>
                            </el-tooltip>
                        </div>
                    </template>
                    <!-- <el-button style="margin-right:8px;max-width:150px" type="primary">添加参与者分组</el-button> -->
                    <div class="group-take-part scrollBar">
                        <el-table ref="expTable" :show-header="false" empty-text="暂无参与者分组数据" :data="participants" highlight-current-row @row-click="selectCurrent">
                            <el-table-column type="index" width="30"></el-table-column>
                            <el-table-column prop="expressionDesc" align="left" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="expressionDesc" class-name="tag-sigle" width="48px">
                                <template slot-scope="scope">
                                    <el-button type="text" icon="el-icon-edit" @click="editExp('update',scope)"></el-button>
                                    <el-button type="text" icon="el-icon-delete" @click="removeItem(scope.$index,scope.row)"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </crcc-card>
            </el-col>
            <el-col :span="18" class="setting">
                <crcc-card :scroll="false" title="分组岗位人员设置" className="no-padding">
                    <el-form label-width="70px" label-position="left">
                        <el-form-item label="生效条件">
                            <el-input v-model="currentExpression.validateCondition" @change="changeValidateCondition" placeholder="可填写此设置的生效条件" clearable @clear="clearConditionVar" :disabled="disabled" style="width:320px">
                            </el-input>
                            <el-button style="margin-left: 8px;" type="primary" icon="el-icon-setting" @click="selectConditionVar" :disabled="disabled"></el-button>
                        </el-form-item>
                    </el-form>
                    <el-row>
                        <el-col :span="12">
                            <crcc-card :scroll="true" className="position-list" title="岗位详情">
                                <template slot="title">
                                    <div style="float: right;">
                                        <el-tooltip class="item" effect="light" content="添加岗位" placement="bottom">
                                            <el-button type="text" icon="el-icon-plus" @click="openPostion" :disabled="disabled"></el-button>
                                        </el-tooltip>
                                    </div>
                                </template>
                                <div>
                                    <el-table stripe border highlight-current-row :data="currentExpression.sysJob">
                                        <el-table-column label="岗位名称" align="left" header-align="center" show-overflow-tooltip prop="name">
                                        </el-table-column>
                                        <el-table-column label="操作" prop="name" width="58px" align="center" class-name="tag-sigle">
                                            <template slot-scope="{$index }">
                                                <el-button type="text" icon="el-icon-delete" :disabled="disabled" @click="currentExpression.sysJob.splice($index, 1)"></el-button>
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
                                            <el-button type="text" icon="el-icon-plus" @click="openUsers" :disabled="disabled"></el-button>
                                        </el-tooltip>
                                        <el-tooltip class="item" effect="light" content="添加发起人员" placement="bottom">
                                            <el-button type="text" icon="el-icon-setting" @click="addStartUser" :disabled="disabled"></el-button>
                                        </el-tooltip>
                                    </div>
                                </template>
                                <div>
                                    <el-table stripe border highlight-current-row :data="currentExpression.sysUser">
                                        <el-table-column label="人员" prop="userName" align="left" header-align="center" show-overflow-tooltip>
                                        </el-table-column>
                                        <el-table-column label="操作" prop="userName" width="58px" align="center" class-name="tag-sigle">
                                            <template slot-scope="{$index }">
                                                <el-button type="text" icon="el-icon-delete" :disabled="disabled" @click="currentExpression.sysUser.splice($index, 1)"></el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </crcc-card>
                        </el-col>
                    </el-row>
                </crcc-card>
            </el-col>
        </el-row>
        <operationGroup ref="operationGroup" v-model="currentExpression" v-bind="bindOperation" :participants="participants" @expression-change="operationGroupAdd"></operationGroup>
        <operationPosition ref="operationPosition" :checkedNodes="currentExpression.sysJob" @addPosition='addPosition'></operationPosition>
        <operationUsers ref="operationUsers" :checkedNodes="currentExpression.sysUser" @addUsers="addUsers"></operationUsers>
        <variableSelect ref="variableSelect"></variableSelect>
        <span slot="footer">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="confirm">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import crccCard from "@/components/crcc-main/crcc-card/index.vue";
import operationGroup from './take-part-components/operation-group.vue'
import operationPosition from './take-part-components/operation-position.vue'
import operationUsers from './take-part-components/operation-users.vue'
import variableSelect from './take-part-components/variable-select.vue'

import startUser from "./take-part-components/inner-parms-start";

export default {
    props: {},
    components: {
        crccCard,
        operationGroup,
        operationPosition,
        operationUsers,
        variableSelect
    },
    data() {
        return {
            dialogVisible: false,
            startUser: startUser,
            bindOperation: {
                status: 'add',
                index: 0,
            },
            //参与者数据
            participants: [],
            //当前设置
            currentExpression: {
                expressionDesc: "",
                validateCondition: "",
                sysJob: [],
                sysUser: []
            },
            //选中的数据
            validateList: [],

            modelerElement: null
        };
    },
    computed: {
        disabled() {
            let value = this.currentExpression?.expressionDesc || ''
            return !value;
        }
    },
    methods: {
        opened() {
            this.$nextTick(() => {
                var row = {
                    expressionDesc: "",
                    validateCondition: "",
                    sysJob: [],
                    sysUser: []
                };
                if (this.participants && this.participants.length > 0) {
                    row = this.participants[0];
                }
                this.selectCurrent(row)
            });

        },
        showDialogVisibel(value) {
            this.modelerElement = value?.element || null;
            this.participants = value.participants;
            this.opened();
            // this.currentExpression.sysJob
            this.dialogVisible = true;
        },
        close() {
            this.dialogVisible = false;
        },

        //编辑分组
        editExp(value, scope) {
            this.bindOperation.status = value;
            this.currentExpression = {
                ...scope.row
            }
            this.bindOperation.index = scope.$index;
            this.$refs.operationGroup.dialogVisible = true;
        },
        //添加分组
        addExp(value) {
            this.bindOperation.status = value;
            this.currentExpression.expressionDesc = '';
            this.$refs.operationGroup.dialogVisible = true;
        },
        operationGroupAdd(list, value) {
            this.participants = list;
            this.selectCurrent(value);
        },
        selectCurrent(row) {
            if (!this.$refs.expTable) {
                return;
            }
            let index = this.participants.findIndex(item => item.expressionDesc == row.expressionDesc);
            if (index != -1) {
                this.currentExpression = {
                    ...row
                };
                this.$refs.expTable.setCurrentRow(row);
            } else {
                this.currentExpression = {
                        expressionDesc: "",
                        validateCondition: "",
                        sysJob: [],
                        sysUser: []
                    },
                    this.$refs.expTable.setCurrentRow();
            }

        },
        //删除分组
        removeItem(index, row) {
            this.participants.splice(index, 1);
            if (row.expressionDesc == this.currentExpression.expressionDesc) {
                this.selectCurrent(row)
            }

        },
        //添加岗位
        addPosition(checklist) {
            this.currentExpression.sysJob = checklist;
        },
        addUsers(checklist) {
            let newArr = []
            let find = this.currentExpression.sysUser.findIndex(j => j.userId == this.startUser[0].userId);
            if (find == -1) {
                checklist.map(item => {
                    newArr.push({
                        userId: item.id,
                        userName: item.name,
                        isVariable: false
                    })
                })
                this.currentExpression.sysUser = newArr;
            } else {
                checklist.map(item => {
                    if (item.id != this.startUser[0].userId) {
                        newArr.push({
                            userId: item.id,
                            userName: item.name,
                            isVariable: false
                        })
                    }
                })
                this.currentExpression.sysUser = newArr.concat(this.startUser);
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
        addStartUser() {
            let findIndex = this.currentExpression.sysUser.findIndex(j => j.userId == this.startUser[0].userId)
            if (findIndex == -1) {
                this.currentExpression.sysUser = this.currentExpression.sysUser.concat(this.startUser)
            }
        },
        //生成条件的人员设置
        selectConditionVar() {
            this.$refs.variableSelect.open(variable => {
                if (this.currentExpression.validateCondition) {
                    this.currentExpression.validateCondition += "" + variable.exp;
                } else {
                    this.currentExpression.validateCondition = variable.exp;
                }
                // if (!this.validateList.find(j => j.exp == variable.exp)) {
                //     this.validateList = this.validateList.concat(variable);

                // }
            });

        },
        changeValidateCondition(value) {
            if (!value.trim()) {
                this.validateList = [];
            }
        },

        confirm() {
            let firstUnValid = this.participants.find(
                exp => exp.sysJob.length == 0 && exp.sysUser.length == 0
            );
            if (!this.participants || firstUnValid) {
                this.error(`'${firstUnValid.expressionDesc}'设置无效，请修改`);
                return;
            }

            this.$emit("on-save-take-part-setting", {
                element: this.modelerElement,
                participants: this.participants
            });

            this.close();
        },

        clearConditionVar() {
            this.validateList = []
        }
    },
    mounted() {}
};
</script>

<style lang="scss" scoped>
$borderColor: #dcdfe6;

::v-deep .take-part-in-setting {
    .el-dialog__body {
        padding: 0px 0px;
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

        .group-take-part {
            .el-table .el-table__empty-block {
                border-right: none;
                width: 100%;
                text-align: center;

                .el-table__empty-text {
                    width: 100%;
                }
            }

            .el-table::before {
                height: 0px;
            }

        }

        .position-list {
            .el-table__empty-block {
                border-bottom: 1px solid #dcdfe6;
            }
        }

        .setting {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            overflow: hidden;

            .el-form {
                padding: 8px;
                border-bottom: 1px solid $borderColor;
            }

            .el-form-item--mini.el-form-item {
                margin-bottom: 0px;
            }

            .el-row {
                flex: 1;
                overflow: hidden;
            }
        }
    }
}
</style>
