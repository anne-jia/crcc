<!--process-permissions  index-->
<template>
    <crcc-main class="flow-types" :scroll="false">
        <template slot="crcc-serach">
            <el-form ref="form" :model="searchForm" label-position="right">
                <el-form-item label="模糊查询" label-width="70px">
                    <el-input v-model="searchForm.keyword" placeholder="模糊查询" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">搜索</el-button>
                </el-form-item>
            </el-form>
        </template>
        <template slot="crcc-opcation">
            <el-button type="primary" :disabled='!currentTreeData.hasPermission' @click="openImportFlow">引入流程</el-button>
        </template>
        <template slot="crcc-main">
            <el-row>
                <el-col :span="8">
                    <crcc-card :scroll="true" title="系统组织">
                        <div>
                            <!-- 组织树结构 -->
                            <el-tree @node-click="nodeClickTree" ref="orgTree" :expand-on-click-node="false" :load="loadNode" highlight-current :key="loadTreeTime" :lazy="lazy" node-key="id" :default-expanded-keys="defaultExpandedKeys" :props="defaultProps">
                                <template slot-scope="{data}">
                                    <span :class="data.hasPermission?'has-permission':'no-permission'">
                                        {{data.name}}
                                    </span>

                                </template>
                            </el-tree>
                        </div>
                    </crcc-card>
                </el-col>
                <el-col :span="16">
                    <crcc-card :scroll="true" title="流程列表" className="flow-table">
                        <div v-show="!currentTreeData.hasPermission" style="text-align: center;">
                            <span v-if="!currentTreeData.pathName" style=" line-height: 44px;color: #909399;font-size: 14px;"> 暂无数据</span>
                            <div v-else>
                                <h1 class="text-jumbo text-ginormous">
                                    对不起！
                                </h1>
                                <h2> 您没有权限查看【{{currentTreeData.pathName}}】下的流程列表</h2>
                            </div>

                        </div>
                        <div v-show="currentTreeData.hasPermission" v-loading="loadingDefinitions">
                            <!-- 表格 -->
                            <el-table ref="flowTable" :data="flowDefinitions.list" border stripe highlight-current-row>
                                <el-table-column prop="procKey" label="标识" header-align="center" align="left" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="procName" label="名称" header-align="center" align="left" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="typeName" label="类型" header-align="center" align="left" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="companyName" label="流程编制公司" header-align="center" align="left" show-overflow-tooltip></el-table-column>
                                <el-table-column width="60" class-name="switch" header-align="center" align="center" show-overflow-tooltip label="状态">
                                    <template slot-scope="{ row }">
                                        <i v-if="row.state == 0" class="el-icon-circle-close" style="color:#ff4949"></i>
                                        <i v-else class="el-icon-circle-check" style="color:#1890ff"></i>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="createTime" width="150px" label="创建时间" align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="lastModifyTime" width="150px" label="最后操作时间" align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column width="90" label="操作" class-name="table-btn-group" align="center">
                                    <template slot-scope="{ row }">
                                        <el-button type="text" @click="removeFlow(row)">
                                            删除</el-button>
                                        <el-button type="text" @click="settingFlow(row)">设置</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <pagination v-show="flowDefinitions.total > 0" scrollToElementClassName=".flow-table" :total="flowDefinitions.total" :pageSize="flowDefinitions.pageSize" :currentPage="flowDefinitions.pageNum" @pagination="pageLoader">
                            </pagination>
                        </div>

                    </crcc-card>
                </el-col>
            </el-row>
        </template>
        <import-flow ref="importFlow" :exclusionId="currentTreeData.id" @selected-flow="selectedFlow"></import-flow>
        <processSetting ref="processSetting" :bpmnId='currentDetailRow.procDefId' v-model="participants" @close="loadFlowTypes">

        </processSetting>
    </crcc-main>
</template>

<script>
import crccCard from "@/components/crcc-main/crcc-card/index.vue";
import importFlow from "./components/import-flow.vue";
import processSetting from '../process-deal/process-setting.vue'

import processPermissionsApi from "@/api/process-permissions-api";
export default {
    components: {
        crccCard,
        importFlow,
        processSetting
    },
    data() {
        return {
            loadingDefinitions: false,
            searchForm: {
                companyId: "",
                keyword: "",
                pageSize: 20,
                pageNum: 1
            },
            //组织树加载
            loadTreeTime: 0,
            //当前选中树
            currentTreeData: {
                  
            },
            //参与者
            participants:{ 
                    companyId: "",
                    id: "",
                    participants: [],
                    processDefinitionId: "",
                    processDefinitionKey: "",
                    taskDefinitionKey: ""
            },
            
            //流程详情当前行的数据
            currentDetailRow: {},
            //当前组织树默认展开节点
            defaultExpandedKeys: [],
            defaultProps: {
                children: "children",
                label: "name",
                id: "id",
                isLeaf: "isDetail"
            },
            lazy: true,
            //实例列表
            flowDefinitions: {
                list: [],
                pageSize: 20,
                pageNum: 1,
                total: 0
            }
        };
    },
    computed: {},
    methods: {
        //引入流程
        openImportFlow() {
            this.$refs.importFlow.dialogVisible = true;
        },
        loadFlowTypes() {

        },

        pageLoader() {},
        //添加选中需要引入的流程
        selectedFlow(value) {
            let companyFlow = {
                procKey: value.map(f => f.procKey).join(","),
                companyId: this.currentTreeData.id
            };
            processPermissionsApi
                .saveCompanyFlow(companyFlow)
                .then(() => {
                    this.info("关联成功");
                    this.getCompanyFlowPage(this.searchForm);
                    this.$refs.importFlow.close();
                })
                .catch(err => thie.error(err.message[0]));
        },
        //删除列表
        removeFlow(row) {
            this.$confirm("确定要删除吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "info"
                })
                .then(() => {
                    processPermissionsApi
                        .removeFlow(row.linkCompanyFlowId)
                        .then(res => {
                            this.info("操作成功");
                            this.getCompanyFlowPage(this.searchForm);
                        })
                        .catch(err => this.error(err.message[0]));
                })
                .catch(() => {
                    return;
                });
        },

        settingFlow(row) {
            this.currentDetailRow = row;
            this.participants={ 
                    companyId: row.linkCompanyId,
                    id: "",
                    participants: [],
                    processDefinitionId: row.procDefId,
                    processDefinitionKey: row.procKey,
                
                    taskDefinitionKey: ""
            },
            this.$refs.processSetting.dialogVisible = true
        },

        //获取流程列表
        getCompanyFlowPage(value) {
            this.loadingDefinitions = true;
            processPermissionsApi
                .getCompanyFlowPage(value)
                .then(res => {
                    this.flowDefinitions = res;
                })
                .catch(err => this.error(err.message[0]))
                .finally(() => (this.loadingDefinitions = false));
        },
        nodeClickTree(data, node, e) {
            this.currentTreeData = data;
        },
        //获取公司顶级节点
        getCompanyTree() {
            return new Promise((resolve, reject) => {
                processPermissionsApi
                    .getCompanyTree()
                    .then(res => {
                        if (res) {
                            resolve(res);
                        } else {
                            resolve([]);
                        }
                    })
                    .catch(err => reject(err));
            });
        },

        //根据父节点加载子节点
        getCompanyListByParentId(id) {
            return new Promise((resolve, reject) => {
                processPermissionsApi
                    .getCompanyListByParentId(id)
                    .then(res => {
                        if (res) {
                            resolve(res);
                        } else {
                            resolve([]);
                        }
                    })
                    .catch(err => reject(err));
            });
        },
        //岗位树节点懒加载
        async loadNode(node, resolve) {
            if (!this.lazy) {
                return;
            } else {
                //懒加载
                if (node.level === 0) {
                    let value = await this.getCompanyTree();
                    if (value) {
                        if (!Array.isArray(value)) {
                            this.defaultExpandedKeys = [value.id];
                            this.currentTreeData = value;
                            resolve([value]);
                        } else {
                            this.defaultExpandedKeys = [value[0].id];
                            this.currentTreeData = value[0];
                            resolve(value);
                        }
                    } else {
                        resolve([]);
                    }
                }
                //选中节点加载下一节点
                if (node.level >= 1) {
                    if (!node.data.hasPermission) {
                        resolve(node.data.children);
                    } else {
                        if (node.key) {
                            let parame = encodeURI(node.key);
                            let value = await this.getCompanyListByParentId(parame);
                            if (value) {
                                if (!Array.isArray(value)) {
                                    resolve([value]);
                                } else {
                                    resolve(value);
                                }
                            } else {
                                resolve([]);
                            }
                        }
                    }
                }
            }
        }
    },
    watch: {
        currentTreeData: {
            handler(val, oldVal) {
                if (JSON.stringify(val) == "{}") {
                    return;
                } else {
                    this.$refs.orgTree.setCurrentKey(val.id);
                    this.searchForm.companyId = val.id;
                    if (val.hasPermission) {
                        this.getCompanyFlowPage(this.searchForm);
                    }
                }
            },
            deep: true,
            immediate: true
        }
    },
    mounted() {}
};
</script>

<style lang="scss" scoped>
$borderColor: #dcdfe6;

::v-deep .el-row {
    height: 100%;
    min-width: 850px;

    .el-col {
        height: 100%;
    }

    .el-col+.el-col {
        border-left: 1px solid $borderColor;
    }

    .el-tree .no-permission {
        cursor: not-allowed;
        width: 100%;
        text-align: left;
        color: #828080;
    }

    .el-badge__content.is-fixed {
        right: 22px;
    }
}
</style>
