<!--  help-protocol-type 协议类型-->
<template>
    <el-dialog custom-class="help-protocol-type" @open='opened' @close='close' append-to-body title='协议类型' v-el-drag-dialog :visible.sync='dialogVisible' :close-on-click-modal='false' width='480px'>
        <div class="protocol-box scrollBar">
            <el-table :data="tableData.list" border stripe highlight-current-row @row-click="changeChose">
                <el-table-column type='index'  label="序号" show-overflow-tooltip width="50" align="center"></el-table-column>
                <el-table-column prop="name"  label="协议名称" show-overflow-tooltip width="120" align="center">
                </el-table-column>
                <el-table-column prop="creator" label="创建人" show-overflow-tooltip align="left" header-align="center"  >
                </el-table-column>
                <el-table-column prop="createTime"  label="创建时间" show-overflow-tooltip align="center" >
                </el-table-column>
                   <el-table-column prop="lastModifier" label="最后修改人" show-overflow-tooltip align="left" header-align="center"  >
                </el-table-column>
                <el-table-column prop="lastModifyTime"  label="最后修改时间" show-overflow-tooltip align="center" >
                </el-table-column>
                <el-table-column prop="note" label="备注" show-overflow-tooltip align="left" header-align="center" >
                </el-table-column>
            </el-table>
        </div>
    </el-dialog>
</template>

<script>
import frameworkService from "@/api/framework-service";
export default {
    props: {},
    components: {

    },
    data() {
        return {
            dialogVisible: false,
            tableData:{
                list:[],
            }

        }
    },
    computed: {

    },
    methods: {
        opened() {},
        close() {
            this.dialogVisible = false
        },
        changeChose(value){
            this.$emit('changeChose', row);
            this.close();
        },
        //   // 序号
        // tableIndex(index) {
        //     return (this.supplierData.pageNum - 1) * this.supplierData.pageSize + index + 1
        // },
        // 获取协议类型数据
        getPurProDictData() {
            frameworkService
                .getPurProDict()
                .then((res) => {
                    if (res) {
                        this.protocolType = res;
                    }
                })
                .catch((err) => {
                    this.error(err.message[0]);
                });
        },
    },
    mounted() {
        this.getPurProDictData();
    },
}
</script>

<style lang='scss' scoped>
::v-deep .help-protocol-type{
    .el-dialog__body{
        padding: 0px;
    .search-form {
        border-bottom: 1px solid #e8e8ea;
        padding-left: 8px;
        min-width: 668px;

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
        .supplier-box{
            height: 480px;
            padding:8px;
            overflow: scroll;
        }
    }
}
</style>
