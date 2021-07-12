<!--  index-->
<template>
    <crcc-main class="flow-types" :scroll="false" :showSearch="false">
        <template slot="crcc-opcation">
            <el-button type="primary">刷新</el-button>
        </template>
        <template slot="crcc-main">
            <el-row>
                <el-col :span="6">
                    <crcc-card v-loading="loadingTypes" :scroll="true" title="流程类型">
                        <div :class="processTypesList.list.length>0? 'types-list' : 'empty types-list'">
                            <el-table ref="typeTable" :data="processTypesList.list" stripe  highlight-current-row :show-header="false" @row-click="selectType">
                                 <el-table-column prop="typeName" align="left" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="taskNum" width="60px" header-align="center" align="left" class-name="tag-group" >
                            <template slot-scope="{row}">
                                <el-tag  v-showPopver='{text:row.taskNum}'>{{row.taskNum?row.taskNum:0}}</el-tag>
                            </template>
                        </el-table-column>
                            </el-table>
                            <pagination v-show="processTypesList.total > 0" scrollToElementClassName=".main.scrollBar" :total="processTypesList.total" :pageSize="processTypesList.pageSize" :currentPage="processTypesList.pageNum" @pagination="pageLoader">
                            </pagination>
                        </div>
                    </crcc-card>
                </el-col>
                <el-col :span="18">
                    <crcc-card v-loading="loadingFlowTable||loadingTypes" :scroll="true" title="流程详情">
                        <div>
                            <el-table ref="flowTable" :data="taskList.list" border stripe highlight-current-row>
                      
                                <el-table-column v-for="col in extendCols" v-bind:key="col.field" :prop="col.field" :label="col.label" :width="col.width" :header-align="col.align" :align="col.align" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="_procName_" label="所属流程" min-width="200" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="_name_" label="任务名称" min-width="200" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="_createTime_" label="创建时间" width="160" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column label="操作" width="100" header-align="center" align="center" class-name="table-btn-group">
                                    <template slot-scope="{ row }">
                                        <el-button type="text" @click="showStatus(row)">进度</el-button>
                                        <el-button type="text" @click="handleTask(row)">处理</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </crcc-card>
                </el-col>
            </el-row>
        </template>
    </crcc-main>
</template>

<script>
import crccCard from "@/components/crcc-main/crcc-card/index.vue";

import procesTasksApi from "@/api/process-task-api";
import showPopver from '@/directive/show-popver'
export default {
    components: {
        crccCard
    },
     directives:{
        showPopver
    },
    data() {
        return {
            loadingTypes: false,
            loadingFlowTable: false,
            processTypesList: {
                list: [],
                pageSize: 20,
                pageNum: 0,
                total: 0
            },
            taskList: {
                list: [1],
                pageSize: 20,
                pageNum: 0,
                total: 0
            },
            extendCols: []
        };
    },
    computed: {
        currentFlowType() {
            return this.$refs.typeTable.store.states.currentRow;
        }
    },
    methods: {
        //获取任务类型列表
        loadFlowTypes() {
            this.loadingTypes = true;
            procesTasksApi
                .loadFlowTypes()
                .then(res => {
                    if (res) {
                        this.processTypesList.list = res;
                        if(res.length>0){
                            this.selectType(res[0]);
                        }
                    }
                })
                .catch(err => this.error(err.message[0]))
                .finally(() => {
                    this.loadingTypes = false;
                });
        },
        //获取行元素
        selectType(type) {
            this.$refs.typeTable.setCurrentRow(type);
            //获取扩展
            this.extendCols = type.columns
                .map(col => JSON.parse(col.taskColInfo))
                .sort((a, b) => {
                    return parseInt(a.order) - parseInt(b.order);
                });
            this.loadTasks();
        },
        //获取流程详情
        loadTasks() {
            this.loadingFlowTable = true
            procesTasksApi.loadTasks(this.currentFlowType.id)
                .then(ret => {
                    this.taskList.list = ret;
                })
                .catch(err => {
                    this.error(err.message[0]);
                }).finally(() => {
                    this.loadingFlowTable = false
                });;
        },
        pageLoader() {},
        showStatus() {},
        handleTask() {},
    },
    mounted() {
        this.loadFlowTypes();
    }
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
       .el-table {
        .el-tag{
            width: 84%;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    .empty.types-list{
        border: none;
    }
    .types-list {
            border: 1px solid $borderColor;
            border-bottom: none;

        ::v-deep .el-table {
            &::before{
                height: 0px;
            }
           

            .el-table__empty-block {
                border: none
            }
        }

    }
  
}
</style>
