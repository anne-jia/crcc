<!--  supplierList 供应商列表-->
<template>
    <el-dialog custom-class="help-supplier-list" @open="opened" @close="close" append-to-body title="供应商列表" v-el-drag-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" width="950px">
           <el-form ref="searchFormData" :model="searchFormData" @submit.native.prevent inline class="search-form">
            <el-form-item label="采购组织" prop="manageOrgName">
                <el-input v-model="searchFormData.filterText"  clearable placeholder="供应商名称" @clear="getSupplierData(searchFormData)">
                </el-input>
            </el-form-item>
             <el-form-item prop="manageOrgName">
               <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form-item>
           </el-form>
        <div class="supplier-box scrollBar">
            <el-table :data="supplierData.list" border stripe highlight-current-row @row-click="changeChoseSupplier">
                <el-table-column type='index' :index="tableIndex" label="序号" show-overflow-tooltip width="50" align="center"></el-table-column>
                <el-table-column prop="code" show-overflow-tooltip width="120" align="center" label="供应商编号">
                </el-table-column>
                <el-table-column prop="name" class-name="link-sigle" show-overflow-tooltip align="left" header-align="center" label="供应商名称">
                    <template slot-scope="scope">
                        <el-link type="primary" @click="viewRecord(scope.row)">
                            <svg-icon v-if="scope.row.isInner == 1" icon-class="crcc-purchase-nei"></svg-icon>
                            {{scope.row.name}}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="creditNo" show-overflow-tooltip align="left" header-align="center" width="158" label="统一社会信用代码">
                    <template slot-scope="scope">
                        {{scope.row.creditNo=="-"?scope.row.regNo:scope.row.creditNo}}
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="operName" show-overflow-tooltip align="left" width="120" header-align="center" label="企业经济类型">
                    <template slot-scope="scope">
                        {{scope.row.enteEconTypeName}}
                    </template>
                </el-table-column> -->
                <el-table-column prop="econKind" show-overflow-tooltip align="left" width="108" header-align="center" label="注册类型">
                    
                </el-table-column>
         
                <el-table-column prop="scope" show-overflow-tooltip align="left" header-align="center" width="80px" label="主营类别">
                </el-table-column>
                <el-table-column prop="provinceName" show-overflow-tooltip align="left" header-align="center" width="80px" label="省份">
                </el-table-column>
                <el-table-column prop="districtName" show-overflow-tooltip align="left" header-align="center" width="80px" label="地区">
                </el-table-column>
            </el-table>
            <pagination scroll-to-element-class-name=".supplier-box" :total="supplierData.total" :page-size="supplierData.pageSize" :current-page="supplierData.pageNum" @pagination="pagination" />
        </div>
    </el-dialog>

</template>

<script>
import frameworkService from "@/api/framework-service";

export default {
    props: {},
    components: {},
    data() {
        return {
                //查询条件
            searchFormData: {
                //模糊查询
                filterText:'',
                pageNum:1,
                pageSize:20,
              
            },
            dialogVisible: false,
            supplierData: {
                list: [],
                total: 0,
                pageSize: 20,
                pageNum: 1,
            }
        };
    },
    computed: {},
    methods: {
        opened() {},
        close() {
            this.dialogVisible = false;
        },
        //查询
        handleSearch(){
            this.searchFormData.filterText=this.searchFormData.filterText.trim();
            if(this.searchFormData.filterText){
                 this.getSupplierData(this.searchFormData)
            }   
        },
        changeChoseSupplier(row){
            this.$emit('changeChose', row);
            this.close();
        },
        pagination(value){
            let data = {...this.searchFormData,...{pageSize: value.pageSize,
                pageNum: value.currentPage,}};
                this.getSupplierData(data);
        },
        // 获取供应商数据
        getSupplierData(data) {
            frameworkService
                .querySupplierInfoPage(data)
                .then((res) => {
                    if (res) {
                        this.supplierData = res;
                    }
                })
                .catch((err) => {
                    this.error(err.message[0]);
                });
        },
        // 序号
        tableIndex(index) {
            return (this.supplierData.pageNum - 1) * this.supplierData.pageSize + index + 1
        },
    },
    mounted() {
        this.getSupplierData(this.searchFormData);
    }
};
</script>

<style lang="scss" scoped>
::v-deep .help-supplier-list{
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
