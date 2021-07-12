<!--  message-setting-->
<template>
    <el-dialog @open="opened" @close="close"  append-to-body title="参与者设置" v-el-drag-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" width="880px">
        <el-row >
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
                        <el-table ref="expTable" :show-header="false" empty-text="暂无参与者分组数据" :data="expressionList" highlight-current-row @row-click="selectCurrent">
                            <el-table-column type="index" width="30"></el-table-column>
                            <el-table-column prop="expressionDesc" align="left" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="expressionDesc" class-name="table-btn-group" width="48px">
                                <template slot-scope="{ $index }">
                                    <el-button type="text" icon="el-icon-edit" @click="editExp('update')"></el-button>
                                    <el-button type="text" icon="el-icon-delete" @click="removeItem($index)"></el-button>
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
                            <el-input v-model="currentExpression.validateCondition" placeholder="可填写此设置的生效条件" clearable :disabled="disabled" style="width:320px">
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
                                                <el-button type="text" icon="el-icon-plus" @click="addPosition"></el-button>
                                          </el-tooltip>
                                    </div>
                                </template>
                                <div>
                                    <el-table stripe border highlight-current-row :data="currentExpression.sysJob">
                                        <el-table-column label="岗位名称" align="left" header-align="center" show-overflow-tooltip prop="name">
                                        </el-table-column>
                                        <el-table-column label="操作" prop="name" width="58px" align="center" class-name="table-btn-group">
                                            <template slot-scope="{$index }">
                                                <el-button type="text" icon="el-icon-delete" @click="currentExpression.sysJob.splice($index, 1)"></el-button>
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
                                                <el-button type="text" icon="el-icon-plus" @click="addUser"></el-button>
                                          </el-tooltip>
                                          <el-tooltip class="item" effect="light" content="设置人员" placement="bottom">
                                                <el-button type="text" icon="el-icon-setting"></el-button>
                                          </el-tooltip>
                                    </div>
                                </template>
                                 <div>
                                    <el-table stripe border highlight-current-row :data="currentExpression.sysUser">
                                        <el-table-column label="人员" prop="userName" align="left" header-align="center" show-overflow-tooltip >
                                        </el-table-column>
                                         <el-table-column label="操作" prop="userName" width="58px" align="center" class-name="table-btn-group">
                                            <template slot-scope="{$index }">
                                                    <el-button type="text" icon="el-icon-delete" @click="currentExpression.sysUser.splice($index, 1)"></el-button>
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
        <operationGroup ref="operationGroup" :status="statusGroupDialog" :expList='expressionList'></operationGroup>
        <operationPosition ref="operationPosition"></operationPosition>
        <operationUsers ref="operationUsers"></operationUsers>
        <span slot="footer">
            <el-button @click="close">取消</el-button>
            <el-button type="primary">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import crccCard from "@/components/crcc-main/crcc-card/index.vue";
import operationGroup from './take-part-components/operation-group.vue'
import operationPosition from './take-part-components/operation-position.vue'
import operationUsers from './take-part-components/operation-users.vue'
export default {
    props: {},
    components: {
        crccCard,
        operationGroup,
        operationPosition,
        operationUsers
    },
    data() {
        return {
            dialogVisible: false,
            statusGroupDialog:'add',
            expressionList: [],
            //当前设置
            currentExpression: {
                sysJob: [],
                sysUser:[],
            }
        };
    },
    computed: {
        disabled() {
            return !this.currentExpression || !this.currentExpression.expressionDesc;
        }
    },
    methods: {
        opened() {},
        showDialogVisibel(value) {
            this.dialogVisible = true;
            console.log(value, "value tack");
        },
        close() {
            this.dialogVisible = false;
        },
        //当前分组选中行
        selectCurrent() {},
        //编辑分组
        editExp(value) {
            this.statusGroupDialog =value;
        },
        //添加分组
        addExp(value){
            this.statusGroupDialog =value;
            this.$refs.operationGroup.dialogVisible =true;
        },
        //删除分组
        removeItem(index) {},
        //添加岗位
        addPosition(){
            this.$refs.operationPosition.dialogVisible =true;
        },
        //添加人员
        addUser(){
            this.$refs.operationUsers.dialogVisible =true;

        },
        selectConditionVar() {}
    },
    mounted() {}
};
</script>

<style lang="scss" scoped>
$borderColor: #dcdfe6;

::v-deep .el-dialog__body {
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
        .el-table .el-table__empty-block{
            border-right:none;
            width: 100%;
            text-align: center;
            .el-table__empty-text{
                width: 100%;
            }
        }
        .el-table::before{
            height: 0px;
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
</style>
