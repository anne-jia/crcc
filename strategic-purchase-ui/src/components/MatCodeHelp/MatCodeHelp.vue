<template>
    <el-dialog custom-class="project-mat-dialog" top="8vh" @open="opened" @close="closeDialog" append-to-body title="物料列表" v-el-drag-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" width="1180px">
        <div  class="aside scrollBar">
            <el-form inline class="search-form" @submit.native.prevent>
                <el-form-item label="模糊查询">
                    <el-input v-model="filterText" style="width:190px" placeholder="分类编号、分类名称、别名" @keyup.enter.native="queryFilterData" />
                </el-form-item>
                <el-form-item class="mat-btn-group">
                    <el-button type="primary" :disabled="!currentOrgId"  @click="queryFilterData">查询</el-button>
                </el-form-item>
            </el-form>
            <mat-sort-tree ref="matSortTree" :current-org-id="currentOrgId" @onTreeNodeClick="onTreeNodeClick" />
        </div>
            
        <mat-code-table  class="scrollBar " ref="matCodeTable" :current-org-id="currentOrgId" :current-mat-sort="currentMatSort" :default-checked-codes="defaultCheckedCodes" />
            <template slot="footer">
                <el-button  @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="saveCheckedValue">确 定</el-button>
            </template>
    </el-dialog>
</template>

<script>
import MatSortTree from '@/components/MatSortTree/MatSortTree'
import MatCodeTable from '@/components/MatCodeTable/MatCodeTable'
export default {
    name: 'ProjectMaterialDialog',
    components: {
        MatSortTree,
        MatCodeTable
    },
    props: {
        currentOrgId: String,
        defaultCheckedCodes: Array
    },
    data() {
        return {
            currentMatSort: {},
            filterText: '',
            dialogVisible: false,
        }
    },
    methods: {
        opened() {

        },
        onTreeNodeClick(data) {
            this.currentMatSort = data
        },
        closeDialog() {
            this.dialogVisible = false;
        },
        saveCheckedValue() {
            const checkedData = this.$refs.matCodeTable.getCheckedData()
            this.$emit(
                'saveCheckedValue',
                JSON.parse(JSON.stringify(checkedData))
            )
            this.closeDialog();
            this.$refs.matCodeTable.clearSelection()
        },
        queryFilterData() {
            this.$refs.matSortTree.getMatSortPathByFilterText(
                this.filterText.trim()
            )
        }
    }
}
</script>

<style lang="scss" scoped>
$borderColor: #dcdfe6;

::v-deep .project-mat-dialog {
    .el-dialog__body {
        padding: 0px;
        display:flex;
        justify-content: flex-start;
        height: 510px;
        overflow: hidden;
        .aside {
          width:380px;
          overflow: scroll;
          border-right: 1px solid $borderColor;
          box-sizing: border-box;
        }

        .mat-code-table-api .el-form,
        .aside .search-form {
            border-bottom: 1px solid $borderColor;
            padding-left: 8px;

            .el-form-item--mini .el-form-item__label {
                line-height: 28px;
            }

            .el-form-item {
                padding: 4px 0 4px 8px;
            }

            .el-form-item {
                margin-bottom: 0;
            }
        }
        .mat-code-table-api{
          flex:1;
          overflow: scroll;

        }

    }
}
</style>
