<!--  import-flow-->
<template>
    <el-dialog @open='opened' @close='close' append-to-body title='新增流程定义' v-el-drag-dialog :visible.sync='dialogVisible' :close-on-click-modal='false' width='780px'>
        <crcc-main class="import-flow" :showOpcation='false'>
            <template slot="crcc-serach">
                <el-form ref="form" :model="searchForm" label-position="right">
                    <el-form-item label="模糊查询" label-width="70px">
                        <el-input v-model="searchForm.keyword" placeholder="模糊查询" clearable @clear="loadHelpFlows(searchForm)"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchPage" >搜索</el-button>
                    </el-form-item>
                </el-form>
            </template>
            <template slot="crcc-main">
                <div style="padding:8px 8px 0px 8px">
                    <el-table ref="flowTable" :data="flowDefinitions.list" :row-key="getRowKey" border stripe highlight-current-row>
                        <el-table-column type="selection" reserve-selection></el-table-column>
                        <el-table-column prop="procKey" label="标识" header-align="center" align="left" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="procName" label="名称" header-align="center" align="left" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="typeName" label="类型" header-align="center" align="left" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="companyName" label="流程编制公司" header-align="center" align="left" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="createTime" width="150px" label="创建时间" align="center" show-overflow-tooltip></el-table-column>
                    </el-table>
                    <pagination v-show="flowDefinitions.total>0" scrollToElementClassName='.import-flow' :total="flowDefinitions.total" :pageSize="flowDefinitions.pageSize" :currentPage="flowDefinitions.pageNum" @pagination="pageLoader">
                    </pagination>
                </div>
            </template>
        </crcc-main>
        <div slot="footer">
            <el-button plain @click="close">取消</el-button>
            <el-button type="primary" @click="confirm">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import processPermissionsApi from '@/api/process-permissions-api'
import elDragDialog from '@/directive/el-drag-dialog/index'

export default {
    directives:{
        elDragDialog
    },
    props: {
        exclusionId: String
    },
    components: {

    },
    data() {
        return {
            dialogVisible: false,
            searchForm: {
                keyword: "",
                exclusionId: '',
                pageSize: 20,
                pageNum: 1
            },
            loadingFlowDefinitions: false,
            flowDefinitions: {
                list: [],
                pageSize: 20,
                pageNum: 1,
                total: 0
            },

        }
    },
    computed: {
           selectedFlow() {
                return this.$refs.flowTable.selection;
            },
    },
    methods: {
        opened() {
            this.searchForm.exclusionId = this.exclusionId;

            this.loadHelpFlows(this.searchForm);
        },
        close() {
            this.dialogVisible = false
        },
        confirm() {
            if(this.selectedFlow.length===0){
                  this.warn("请选择要引入的流程");
                return;
            }
            this.$emit('selected-flow',this.selectedFlow);
        },
        pageLoader(value) {
            let data =Object.assign({},this.searchForm,{ pageSize: value.pageSize,pageNum: value.currentPage})
            this.loadHelpFlows(data);
        },
        //设置 则会在数据更新之后保留之前选中的数据 设置行的key属性
        getRowKey(row) {
            if (!row) {
                return '0';
            } else {
                row.id;
            }
        },
        searchPage(){
            if(!this.searchForm.keyword.trim()){
                return
            }
            this.loadHelpFlows(this.searchForm)
        },
        loadHelpFlows(value) {
            this.loadingFlowDefinitions = true
            processPermissionsApi.loadHelpFlows(value).then(res => {
                this.flowDefinitions = res;
            }).catch(err => this.error(err.message[0])).finally(() => {
                this.loadingFlowDefinitions = false
            })
        }
    },
    mounted() {

    },
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
    padding: 0px 8px;
    height: 450px;
}
</style>
