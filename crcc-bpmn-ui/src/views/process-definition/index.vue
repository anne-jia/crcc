<!--  index-->
<template>
    <crcc-main class="flow-types" :scroll="false" :showSearch='false' :showOpcation="!showProcessBpmn">
        <template slot="crcc-opcation">
            <el-button type="primary" :disabled="(!currentType.id)&&(processTypesList.total==0)" @click="openOperationDefinition('add')">新增流程定义</el-button>
        </template>
        <template slot="crcc-main">
            <el-row class="crcc-row">
                <el-col :span="8">
                    <crcc-card :scroll="true" title="流程类型">
                        <div>
                            <el-form ref="form" class="search-form" :model="searchType" label-position="right" @submit.native.prevent>
                                <el-form-item label="模糊查询" label-width="70px">
                                    <el-input v-model="searchType.keyword" placeholder="编号，名称" clearable @clear="getTypePage(searchType)"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="searchTypePage()">搜索</el-button>
                                </el-form-item>
                            </el-form>
                            <el-table ref="typeTable" v-loading="processTypesLoading" :data="processTypesList.list" stripe border highlight-current-row @row-click="onTypeRowClick">
                                <el-table-column prop="typeCode" align="left" header-align="center" label="编号" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="typeName" align="left" header-align="center" label="名称" show-overflow-tooltip></el-table-column>
                            </el-table>
                            <pagination v-show="processTypesList.total>0" scrollToElementClassName='.main.scrollBar' :total="processTypesList.total" :pageSize="processTypesList.pageSize" :currentPage="processTypesList.pageNum" @pagination="pageLoaderTypesList">
                            </pagination>
                        </div>
                    </crcc-card>
                </el-col>
                <el-col :span="16">
                    <crcc-card :scroll="true" title="流程定义" className="types-list">
                        <div>
                            <el-form ref="form" class="search-form" :model="searchDefinition" label-position="right" @submit.native.prevent>
                                <el-form-item label="模糊查询" label-width="70px">
                                    <el-input v-model="searchDefinition.keyword" placeholder="标识、名称" clearable @clear="getFlowDefinitions(searchDefinition)"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="searchFlowDefinitions()">搜索</el-button>
                                </el-form-item>
                            </el-form>
                            <el-table ref="flowTable" v-loading="flowDefinitionsLoading||processTypesLoading" :data="flowDefinitions.list" border stripe highlight-current-row>
                                <el-table-column prop="procKey" label="标识" header-align="center" align="left" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="procName" label="名称" header-align="center" align="left" show-overflow-tooltip></el-table-column>
                                <el-table-column width="80" header-align="center" class-name="switch" align="center" label="状态">
                                    <template slot-scope="{row}">
                                        <el-switch :width="36" :value="row.state" active-value="1" inactive-value="0" @change="setProcState(row)"></el-switch>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="lastModifier" header-align="center" align="left" width="130" label="最后修改人" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="lastModifyTime" align="center" width="150" label="最后修改时间" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="currentVersion" label="当前版本" width="80" header-align="center" align="left" show-overflow-tooltip></el-table-column>
                                <el-table-column width="100" header-align="center" align="center" class-name="table-btn-group" show-overflow-tooltip label="操作">
                                    <template slot-scope="{ row }">
                                        <el-button type="text" @click="editFlow('update',row)">编辑</el-button>
                                        <el-button type="text" @click="copyFlow('copy',row)">复制</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <pagination v-show="flowDefinitions.total>0" scrollToElementClassName='.types-list' :total="flowDefinitions.total" :pageSize="flowDefinitions.pageSize" :currentPage="flowDefinitions.pageNum" @pagination="pageLoader">
                            </pagination>
                        </div>
                    </crcc-card>
                </el-col>
            </el-row>
        </template>
        <operation-definition ref="operationDefinition" :state="stateOperationDefinition" @save="saveOpreation"></operation-definition>
        <process-bpmn ref="processBpmn" :class="showProcessBpmn?'show':'hide'" @hide-bpmn="hideBpmn"></process-bpmn>
    </crcc-main>
</template>

<script>
import crccCard from "@/components/crcc-main/crcc-card/index.vue";
import operationDefinition from './components/operation-definition.vue'
import processBpmn from '@/views/process-bpmn/index.vue'


import processTypesApi from '@/api/process-types-api'
import processDefinitionApi from "@/api/process-definition-api";
export default {
    components: {
        crccCard,
        operationDefinition,
        processBpmn
    },
    data() {
        return {
            flowDefinitionsLoading: false,
            processTypesLoading: false,
            showProcessBpmn:false,
            searchDefinition: {
                keyword: "",
                typeId: "",
                pageSize: 20,
                pageNum: 1
            },
            searchType: {
                keyword: "",
                pageSize: 20,
                pageNum: 1
            },
            stateOperationDefinition: 'add',
            currentType: {
                bizPage: "",
                id: "",
                isSysDef: "",
                lastModifier: "",
                lastModifyTime: "",
                typeCode: "",
                typeName: "",
            },
            processTypesList: {
                list: [],
                pageSize: 20,
                pageNum: 1,
                total: 0
            },
            flowDefinitions: {
                list: [],
                pageSize: 20,
                pageNum: 1,
                total: 0
            }
        }
    },
    computed: {

    },
    methods: {
        onTypeRowClick(row) {
            this.currentType = {
                ...row
            };
        },
        //状态
        setProcState(row) {
            if (row.state == "1") {
                this.$confirm("确定要停用当前流程吗？", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "info"
                    })
                    .then(() => {
                        let flow = {
                            id: row.id,
                            procDefId: row.procDefId,
                            state: "0"
                        };
                        processDefinitionApi.setFlowState(flow)
                            .then(() => {
                                row.state = "0";
                            })
                            .catch(err => {
                                this.error(err.message[0]);
                            });
                    })
                    .catch(() => {
                        return;
                    });
            } else {
                this.$confirm("确定要启用当前流程吗？", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "info"
                    })
                    .then(() => {
                        let flow = {
                            id: row.id,
                            procDefId: row.procDefId,
                            state: "1"
                        };
                        processDefinitionApi.setFlowState(flow)
                            .then(() => {
                                row.state = "1";
                            })
                            .catch(err => {
                                this.error(err.message[0]);
                            });
                    })
                    .catch(() => {
                        return;
                    });
            }
        },
        hideBpmn(reload){
            this.showProcessBpmn =false;
            if(reload){
            let data = {
                keyword: this.searchDefinition.keyword.trim(),
                typeId: this.searchDefinition.typeId,
                pageSize:this.flowDefinitions.pageSize,
                pageNum: this.flowDefinitions.pageNum
            }
            this.getFlowDefinitions(data) 
            }
        },
        //编辑流程
        editFlow(state, value) {
            this.showProcessBpmn =true;
            this.$nextTick(()=>{
            this.$refs.processBpmn.editDiagram(value);
            })
        },
        //复制流程
        copyFlow(state, value) {
            this.openOperationDefinition(state,value);
        },
       //流程定义分页请求
        pageLoader() {
            let data = {
                keyword: this.searchDefinition.keyword.trim(),
                typeId: this.searchDefinition.typeId,
                pageSize: value.pageSize,
                pageNum: value.currentPage
            }
        },
        //流程定义
        getFlowDefinitions(value) {
            this.flowDefinitionsLoading = true
            processDefinitionApi.getFlowPage(value).then(res => {
                this.flowDefinitions = res;
            }).catch(err => this.error(err.message[0])).finally(() => this.flowDefinitionsLoading = false)
        },

        //搜索流程类型
        searchTypePage() {
            this.searchType.keyword = this.searchType.keyword.trim()
            if (this.searchType.keyword) {
                this.getTypePage(this.searchType);
            }
        },
        //搜索流程定义
        searchFlowDefinitions() {
            this.searchDefinition.keyword = this.searchDefinition.keyword.trim()
            if (this.searchDefinition.keyword) {
                this.getFlowDefinitions(this.searchDefinition);
            }
        },
        //流程类型分页请求
        pageLoaderTypesList(value) {
            let data = {
                keyword: this.searchType.keyword.trim(),
                pageSize: value.pageSize,
                pageNum: value.currentPage
            }
            this.getTypePage(data);
        },

        //pageNum,pageSize,keyword  ;获取表流程类型数据
        getTypePage(data) {
            this.processTypesLoading = true
            processTypesApi.getTypePage(data).then(res => {
                if (res) {
                    this.processTypesList = res;
                    if (res.total > 0) {
                        this.$refs.typeTable.setCurrentRow(res.list[0]);
                        this.currentType = res.list[0];
                    }
                }
            }).catch(err => this.error(err.message[0])).finally(() => this.processTypesLoading = false)
        },
        //打开定义流程弹窗
        openOperationDefinition(state,value={}) {
            this.stateOperationDefinition = state;
            if (state == 'add' || state == 'copy') {
                this.$refs.operationDefinition.currentFlow.typeId = this.currentType.id;
                this.$refs.operationDefinition.currentFlow.flowToCopy=value;
            }
            this.$refs.operationDefinition.dialogVisible = true;
        },
        //新增&复制 保存流程定义。
        saveOpreation(value) {
            if (this.stateOperationDefinition == 'add') {
                this.$refs.processBpmn.createDiagram(value);
            } else if (this.stateOperationDefinition == 'copy') {
                this.$nextTick(()=>{
                    this.$refs.processBpmn.copyDiagram(value);
                })
            } 
            this.showProcessBpmn = true;
        },
    },
    watch: {
        "currentType": {
            handler(val, oldVal) {
                if (val.id) {
                    this.searchDefinition.typeId = val.id;
                    this.getFlowDefinitions(this.searchDefinition);
                }
            },
            deep: true,
            immediate: true,
        }
    },
    mounted() {
        this.getTypePage(this.searchType);
    },
}
</script>

<style lang="scss" scoped>
$borderColor: #dcdfe6;

.el-row {
    height: 100%;
    width: 100%;

    .el-col {
        height: 100%;
    }

    .search-form {
        display: flex;
        width: 100%;
        justify-content: flex-start;

        .el-button.el-button--mini {
            height: 26px;
            padding: 4px 8px;
        }

        .el-button {
            margin-left: 6px;
        }
    }
}

.el-row.crcc-row {
    .el-col+.el-col {
        border-left: 1px solid $borderColor;
    }

    ::v-deep .el-badge__content.is-fixed {
        right: 22px;
    }
}
.hide{
    transition:transform 1s;
    transform: translateY(100%);
    position: absolute;

}
.show{
    position: unset;
    transition:transform 1s;
    transform: translateY(0);
    /* display: flex; */

    
}
</style>
