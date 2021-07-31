<!--  index-->
<template>
    <crcc-main class="flow-types" :scroll="false" :showSearch='false' :showOpcation="!showProcessBpmn">
        <template slot="crcc-opcation">
        <el-form ref="form" class="search-form"   label-position="right" @submit.native.prevent>
                <el-form-item label="切换公司" label-width="70px">
                  <el-select :value="choseType.companyName" filterable    @change="changeCompany" ref="searchCompany" placeholder="请选择">
                        <el-option
                        v-for="item in companyList"
                        :key="item.id"
                        :label="item.pathName"
                        :disabled='!(item.hasPermission)'
                        :value="item"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item >
                     <el-button type="primary" :disabled="(!choseType.id)&&(!choseType.companyId)" @click="openOperationDefinition('add')">新增流程定义</el-button>
                </el-form-item>
            
        </el-form>
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
                                <el-table-column width="80" header-align="center" class-name="tag-sigle" align="center" label="状态">
                                    <template slot-scope="{row}">
                                        <el-switch :width="36" :value="row.state" active-value="1" inactive-value="0" @change="setProcState(row)"></el-switch>
                                    </template>
                                </el-table-column>
                                 <el-table-column width="80" header-align="center" class-name="tag-sigle" align="center" label="是否公开">
                                    <template slot-scope="{row}">
                                        <el-switch :width="36" :value="row.general" :active-value="true" :inactive-value="false" @change="setGeneral(row)"></el-switch>
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
    name:'processDefinition',
    components: {
        crccCard,
        operationDefinition,
        processBpmn
    },
    data() {
        return {
            flowDefinitionsLoading: false,
            processTypesLoading: false,
            showProcessBpmn: false,
           
            //有权限公司列表
            companyList:[],
            searchDefinition: {
                keyword: "",
                typeId: "",
                companyId:"",
                pageSize: 20,
                pageNum: 1
            },
            searchType: {
                keyword: "",
                pageSize: 20,
                pageNum: 1
            },
            stateOperationDefinition: 'add',
            //选中的公司和企业 ,当前流程类型
            choseType: {
                bizPage: "",
                id: "",
                isSysDef: "",
                lastModifier: "",
                lastModifyTime: "",
                typeCode: "",
                typeName: "",
                companyId:'',
                companyName:'',
                companyPath:'',
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
            this.choseType = {...this.choseType,
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

        setGeneral(row){
                 if (row.general) {
                this.$confirm("确定不公开当前流程吗？", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "info"
                    })
                    .then(() => {
                        let flow = {
                            id: row.id,
                            procDefId: row.procDefId,
                            general: false
                        };
                        processDefinitionApi.setFlowState(flow)
                            .then(() => {
                                row.general = false;
                            })
                            .catch(err => {
                                this.error(err.message[0]);
                            });
                    })
                    .catch(() => {
                        return;
                    });
            } else {
                this.$confirm("确定要公开当前流程吗？", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "info"
                    })
                    .then(() => {
                        let flow = {
                            id: row.id,
                            procDefId: row.procDefId,
                            general: true
                        };
                        processDefinitionApi.setFlowState(flow)
                            .then(() => {
                                row.general = true;
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

        hideBpmn(reload) {
            this.showProcessBpmn = false;
            if (reload) {
                this.getFlowDefinitions(this.searchDefinition);
            }
        },
        //编辑流程
        editFlow(state, value) {
            this.showProcessBpmn = true;
            this.$nextTick(() => {
                this.$refs.processBpmn.editDiagram(value);
            })
        },
        //复制流程
        copyFlow(state, value) {
            this.openOperationDefinition(state, value);
        },
        //流程定义分页请求
        pageLoader(value) {
            let page ={pageSize: value.pageSize,
                pageNum: value.currentPage }
            let data = {...this.searchDefinition, ...page}
            this.getFlowDefinitions(data);
        },
        //流程定义
        getFlowDefinitions(value) {
                this.flowDefinitionsLoading = true
                processDefinitionApi.getFlowPage(value).then(res => {
                    this.flowDefinitions = res;
                }).catch(err => this.error(err.message[0])).finally(() => this.flowDefinitionsLoading = false)
        },
        //更改选中公司
        changeCompany(val){
            let company={
                companyId:val.id,
                companyName:val.pathName,
                companyPath:val.path
                
            }
            this.choseType={...this.choseType,...company};
        },
        //获取有权限的组织
        getHasPermissioCompany(){
            processDefinitionApi.getHasPermissioCompany().then(res=>{
                let length = res?.length||0;
                if(length>0){
                    this.companyList = res;
                    let findIndex = res.findIndex(res=>res.hasPermission==true)
                    this.changeCompany(res[findIndex]);
                    //复制流程定义的时候更改选中的值
                    this.$refs.operationDefinition.companyList=[...res];
                    this.$refs.operationDefinition.changeCompany(res[findIndex]);

                }
            }).catch(err => this.error(err.message[0]))
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
                        this.onTypeRowClick(res.list[0])
                    }
                }
            }).catch(err => this.error(err.message[0])).finally(() => this.processTypesLoading = false)
        },
        //打开定义流程弹窗
        openOperationDefinition(state, value = {}) {
            this.stateOperationDefinition = state;
            //数据转换
             let data ={
                    typeId:this.choseType.id,
                    companyId:this.choseType.companyId,
                    companyName:this.choseType.companyName,
                    companyPath:this.choseType.companyPath,
                    general:value?.general||false,
                    flowToCopy:value
                },
                currentFlow=this.$refs.operationDefinition.currentFlow;
            if (state == 'add'||state == 'copy' ) {
                this.$refs.operationDefinition.currentFlow={...currentFlow,...data}
            }
            this.$refs.operationDefinition.dialogVisible = true;
        },
        //新增&复制 保存流程定义。
        saveOpreation(value) {
            if (this.stateOperationDefinition == 'add') {
                this.$refs.processBpmn.createDiagram(value);
            } else if (this.stateOperationDefinition == 'copy') {
                this.$nextTick(() => {
                    this.$refs.processBpmn.copyDiagram(value);
                })
            }
            this.showProcessBpmn = true;
        },
    },
    watch: {
        'choseType':{
         handler(val, oldVal) {
                if (val.companyId && val.id) {
                    this.searchDefinition.typeId = val.id;
                    this.searchDefinition.companyId = val.companyId;
                    this.getFlowDefinitions(this.searchDefinition);
                }
            },
            deep: true,
            immediate: true,
        }
    },
    mounted() {
        this.getHasPermissioCompany();
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

.hide {
    transition: transform 1s;
    transform: translateX(100%);
    position: absolute;

}

.show {
    position: unset;
    transition: transform 1s;
    transform: translateX(0);
    /* display: flex; */

}
</style>
