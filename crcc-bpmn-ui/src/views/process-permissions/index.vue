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
            <el-button type="primary" @click="openImportFlow">引入流程</el-button>
        </template>
        <template slot="crcc-main">
            <el-row>
                <el-col :span="8">
                    <crcc-card :scroll="true" title="系统组织">
                        <div>
                            <!-- 组织树结构 -->
                            <el-tree @node-click="nodeClickTree" ref="orgTree" :expand-on-click-node="false" :load="loadNode" highlight-current :key="loadTreeTime" :lazy="lazy" node-key="code" :default-expanded-keys="defaultExpandedKeys" :props="defaultProps">
                            </el-tree>
                        </div>
                    </crcc-card>
                </el-col>
                <el-col :span="16">
                    <crcc-card :scroll="true" title="流程列表" className="flow-table">
                        <div v-loading="loadingDefinitions">
                            <!-- 表格 -->
                            <el-table ref="flowTable" :data="flowDefinitions.list" border stripe highlight-current-row>
                                <el-table-column prop="typeName" label="类型" header-align="center" align="left" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="procKey" label="标识" header-align="center" align="left" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="procName" label="名称" header-align="center" align="left" show-overflow-tooltip></el-table-column>
                                <el-table-column width="60" class-name="switch" header-align="center" align="center" show-overflow-tooltip label="状态">
                                    <template slot-scope="{ row }">
                                        <i v-if="row.state == 0" class="el-icon-circle-close" style="color:#ff4949"></i>
                                        <i v-else class="el-icon-circle-check" style="color:#1890ff"></i>
                                    </template>
                                </el-table-column>
                                <el-table-column width="60" label="操作" class-name="table-btn-group" align="center" show-overflow-tooltip>
                                    <template slot-scope="{ row }">
                                        <el-button type="text" class="el-icon-delete" @click="removeFlow(row)"></el-button>
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
        <import-flow ref="importFlow" :exclusionId="currentTreeData.code" @selected-flow="selectedFlow"></import-flow>
    </crcc-main>
</template>

<script>
import crccCard from "@/components/crcc-main/crcc-card/index.vue";
import importFlow from "./components/import-flow.vue";
import processPermissionsApi from "@/api/process-permissions-api";
export default {
    components: {
        crccCard,
        importFlow
    },
    data() {
        return {
            loadingDefinitions: false,
            searchForm: {
                companyId: "",
                keyword: "",
                pageSize: 1,
                pageNum: 20
            },
            loadTreeTime: 0,
            currentTreeData: {},
            defaultExpandedKeys: [],
            defaultProps: {
                children: "children",
                label: "name",
                id: "code",
                isLeaf: "isDetail"
            },
            lazy: true,
            flowDefinitions: {
                list: [],
                pageSize: 20,
                pageNum: 0,
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
        pageLoader() {},
        //添加选中需要引入的流程
        selectedFlow(value) {
            let companyFlow = {
                procKey: value.map(f => f.procKey).join(","),
                companyId: this.currentTreeData.code
            };
            processPermissionsApi.saveCompanyFlow(companyFlow).then(() => {
                this.info("关联成功");
                this.getCompanyFlowPage(this.searchForm);
                this.$refs.importFlow.close();

            }).catch(err=>thie.error(err.message[0]));
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
                        .removeFlow(row.companyFlowId)
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
                            this.defaultExpandedKeys = [value.code];
                            this.currentTreeData = value;
                            resolve([value]);
                        } else {
                            this.defaultExpandedKeys = [value[0].code];
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
                            let value = await this.getCompanyListByParentId(node.key);
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
                    this.$refs.orgTree.setCurrentKey(val.code);
                    this.searchForm.companyId = val.code;
                    this.getCompanyFlowPage(this.searchForm);
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

.el-row {
    height: 100%;
    min-width: 850px;

    .el-col {
        height: 100%;
    }

    .el-col+.el-col {
        border-left: 1px solid $borderColor;
    }

    ::v-deep .el-badge__content.is-fixed {
        right: 22px;
    }
}
</style>
