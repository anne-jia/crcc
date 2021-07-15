<!--  index-->
<template>
    <crcc-main class="flow-types" :scroll="false">
        <template slot="crcc-serach">
            <el-form ref="form" :model="searchForm" @submit.native.prevent label-position="right">
                <el-form-item label="模糊查询" label-width="70px">
                    <el-input v-model="searchForm.keyword" placeholder="编号，名称" clearable @clear="getTypePage(searchForm)"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchTypePage()">搜索</el-button>
                </el-form-item>
            </el-form>
        </template>
        <template slot="crcc-opcation">
            <el-button :disabled="getDisableTypeBtn" type="primary" @click="changTypes('add')">新增</el-button>
            <el-button :disabled="getDisableTypeBtn||  currentType.isSysDef == '1'" plain @click="changTypes('update')">修改</el-button>
            <el-button :disabled="getDisableTypeBtn ||  currentType.isSysDef == '1'" plain @click="delTypes('del')">删除</el-button>
            <el-button :disabled="!getDisableTypeBtn" plain @click="saveTypes('save')">保存</el-button>
            <el-button :disabled="!getDisableTypeBtn" plain @click="changTypes('cancel')">取消</el-button>
        </template>
        <template slot="crcc-main">
            <el-row>
                <el-col :span="8">
                    <crcc-card :scroll="true" title="流程类型">
                        <div>
                            <el-table ref="typeTable" :data="processTypesList.list" stripe border highlight-current-row @row-click="onTypeRowClick">
                                <el-table-column prop="typeCode" align="left" header-align="center" show-overflow-tooltip label="编号" ></el-table-column>
                                <el-table-column prop="typeName" align="left" header-align="center" show-overflow-tooltip label="名称" ></el-table-column>
                            </el-table>
                            <pagination v-show="processTypesList.total>0" scrollToElementClassName='.main.scrollBar' :total="processTypesList.total" :pageSize="processTypesList.pageSize" :currentPage="processTypesList.pageNum" @pagination="pageLoader">
                            </pagination>
                        </div>
                    </crcc-card>
                </el-col>
                <el-col :span="16">
                    <crcc-card class="base-message" title="基本信息">
                        <el-form ref="typeForm" :model="baseInfo" label-width="100px" :rules="formRules" label-position="right" :disabled="getDisableFormData">
                            <el-form-item label="编号" prop="typeCode">
                                <el-input v-model="baseInfo.typeCode" @change="changeTypeCode" @input="inputTypeCode" maxlength="32" />
                            </el-form-item>
                            <el-form-item label="名称" prop="typeName">
                                <el-input v-model="baseInfo.typeName" @change="changeTypeName" @input="inputTypeName" maxlength="64" />
                            </el-form-item>
                            <el-form-item label="是否预制">
                                <el-input :value="isTypeSysDef" disabled />
                            </el-form-item>
                            <el-form-item label="单据预览" prop="bizPage">
                                <el-input v-model="baseInfo.bizPage" maxlength="256" />
                            </el-form-item>
                        </el-form>
                        <div class="main" style="padding:0px" v-show=" stateTypes !='add'">
                            <el-divider></el-divider>
                            <span>
                                <el-badge :value="getDetailListLength" class="item">
                                    <el-button type="primary" @click="openOperationDetail('add')">新增扩展列</el-button>
                                </el-badge>
                            </span>
                            <el-divider></el-divider>
                            <div class="table-box scrollBar">
                                <el-table :data="detailList" stripe border highlight-current-row @row-click="handleCurrentExtendCols" v-if="baseInfo.id">
                                    <el-table-column align="left" header-align="center" prop="field" label="标识" show-overflow-tooltip></el-table-column>
                                    <el-table-column align="left" header-align="center" prop="label" label="字段名" show-overflow-tooltip></el-table-column>
                                    <el-table-column align="left" header-align="center" prop="width" width="80px" label="列宽" show-overflow-tooltip></el-table-column>
                                    <el-table-column align="left" header-align="center" prop="order" width="80px" label="排序" show-overflow-tooltip></el-table-column>
                                    <el-table-column align="center" prop="align" width="100px" label="对齐方式" show-overflow-tooltip>
                                        <template slot-scope="{ row }">
                                            {{getAlign(row.align)}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" prop="align" width="100px" label="操作" show-overflow-tooltip class-name="table-btn-group">
                                        <template slot-scope="{ row }">
                                            <el-button type="text" @click="openOperationDetail('update',row)">修改</el-button>
                                            <el-button type="text" @click="delOperationDetail('del',row)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>

                            </div>
                        </div>

                    </crcc-card>
                </el-col>
            </el-row>
        </template>
        <operation-detail ref="operationDetail" :state="stateOperationDetail"  @on-column-saved="getColumns"></operation-detail>
    </crcc-main>
</template>

<script>
import crccCard from "@/components/crcc-main/crcc-card/index.vue";
import operationDetail from "./components/operationDetail.vue";
import processTypesApi from '@/api/process-types-api'
export default {
    components: {
        crccCard,
        operationDetail
    },
    data() {
        let transform = function (value) {
            return value ? value.trim() : "";
        };
        return {
            searchForm: {
                keyword: "",
                pageSize: 20,
                pageNum: 1
            },
            stateOperationDetail: 'add',
            stateTypes: "view", //update, view,add,save,del，cancel
            duplicatedTypeCode: false, //基本信息编号
            duplicatedTypeName: false, //基本信息名称

            //基本信息的数据
            baseInfo: {
                bizPage: "",
                columns: [],
                id: "",
                isSysDef: "",
                lastModifier: "",
                lastModifyTime: "",
                typeCode: "",
                typeName: "",
            },
            //当前选中行的数据
            currentType: {
                bizPage: "",
                columns: [],
                id: "",
                isSysDef: "",
                lastModifier: "",
                lastModifyTime: "",
                typeCode: "",
                typeName: "",
            },
            currentExtendCols: {},
            detailList: [],
            processTypesList: {
                list: [],
                pageSize: 20,
                pageNum: 0,
                total: 0
            },
            formRules: {
                typeCode: [{
                        required: true,
                        transform,
                        message: "请填写编号",
                        trigger: "blur"
                    },
                    {
                        pattern: /^[A-Za-z0-9]+$/,
                        message: "请使用数字或英文字母",
                        trigger: "blur"
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (this.duplicatedTypeCode) {
                                callback(new Error("编号已被使用"));
                            } else {
                                callback();
                            }
                        },
                        trigger: "change"
                    }
                ],

                typeName: [{
                        required: true,
                        transform,
                        message: "请填写名称",
                        trigger: "blur"
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (this.duplicatedTypeName) {
                                callback(new Error("名称已被使用"));
                            } else {
                                callback();
                            }
                        },
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    computed: {
        getDetailListLength() {
            return this.detailList.length;
        },
        getDisableTypeBtn() {
            return this.stateTypes == 'add' || this.stateTypes == 'update'
        },
        getDisableFormData() {
            switch (this.stateTypes) {
                case 'view':
                    return true;
                case 'save':
                    return true;
                case 'del':
                    return true;
                case 'cancel':
                    this.baseInfo = {
                        ...this.currentType
                    };
                    this.$refs.typeForm.clearValidate();
                    this.$refs.typeTable.setCurrentRow(this.currentType);
                    return true;
                case 'add':
                    this.$refs.typeTable.setCurrentRow();
                    this.baseInfo = {
                        bizPage: "",
                        columns: [],
                        id: "",
                        isSysDef: "",
                        lastModifier: "",
                        lastModifyTime: "",
                        typeCode: "",
                        typeName: "",
                    };
                    this.detailList = [];
                    return false;
                case 'update':
                    return false;
                default:
                    return true;
            }

        },
        //是否预制
        isTypeSysDef() {
            return this.baseInfo && this.baseInfo.isSysDef == "1" ? "是" : "否";
        }
    },
    watch: {
        "currentType": {
            handler(val, oldVal) {
                if (val.id) {
                    this.baseInfo = {
                        ...val
                    };
                    this.getColumns(val.id);
                }
            },
            deep: true,
            immediate: true,
        }
    },
    methods: {
        getAlign(align) {
            switch (align) {
                case 'left':
                    return '居左';
                case 'right':
                    return '居右'
                case 'center':
                    return '居中';
                default:
                    return '';
            }

        },
        searchTypePage() {
             this.searchForm.keyword=this.searchForm.keyword.trim()
            if (this.searchForm.keyword) {
                this.getTypePage(this.searchForm);
            }
        },

        //修改流程类型
        changTypes(value = 'update') {
            this.stateTypes = value;

        },
        saveTypes(value = 'save') {
            let state =  this.stateTypes;
            this.stateTypes = value;
            this.$refs.typeForm.validate(valid => {
                if (valid) {
                    processTypesApi.saveType(this.baseInfo)
                        .then((res) => {
                            if (res) {
                                if(state=='add'){
                                    this.info(`${this.baseInfo.typeName}添加成功`);

                                }else{
                                    this.info(`${this.baseInfo.typeName}修改成功`);
                                }   
                                this.getTypePage(this.searchForm);
                            }
                        })
                        .catch(err => {
                            this.error(err.message[0]);
                        });
                }
            });
        },
        delTypes(value = 'del') {
            this.stateTypes = value;
            if (!this.currentType.id) {
                this.warn("请选择要删除的类型");
                return;
            }
            this.$confirm("确定要删除吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "info"
                })
                .then(() => {
                    processTypesApi.deleteType(this.currentType.id)
                        .then(() => {
                            this.info(`${this.currentType.typeName}删除成功`);
                            this.getTypePage(this.searchForm);
                        })
                        .catch(err => {
                            this.error(err.message[0]);
                        });
                })
                .catch(() => {
                    return;
                });
        },

        //分页
        pageLoader(value) {
            let data = {
                keyword: this.searchForm.keyword.trim(),
                pageSize: value.pageSize,
                pageNum: value.currentPage
            }
            this.getTypePage(data);
        },
        //点击扩展列
        handleCurrentExtendCols(row) {
            this.currentExtendCols = {
                ...row
            };
        },
        //编号验证
        changeTypeCode(val) {
            if (val.trim()) {
                this.baseInfo.typeCode = val.trim();
                this.baseInfo.typeName = this.baseInfo.typeName.trim();
                processTypesApi.isCodeUsed(this.baseInfo).then(duplicated => {
                    this.duplicatedTypeCode = duplicated //基本信息编号
                    this.$refs.typeForm.validateField('typeCode');
                }).catch(err => {
                    this.error(err.message[0])
                });
            }
        },
        inputTypeCode(val) {
            if (val.trim() && this.duplicatedTypeCode) {
                this.changeTypeCode(val);
            }
        },
        //名称验证
        changeTypeName(val) {
            if (val.trim()) {
                this.baseInfo.typeName = val.trim();
                this.baseInfo.typeCode = this.baseInfo.typeCode.trim();
                processTypesApi.isNameUsed(this.baseInfo).then(duplicated => {
                    this.duplicatedTypeName = duplicated
                    this.$refs.typeForm.validateField('typeName');
                }).catch(err => {
                    this.error(err.message[0])
                });;
            }

        },
        inputTypeName(val) {
            if (val.trim() && this.duplicatedTypeName) {
                this.changeTypeName(val);
            }
        },

        //点击当前行，选中
        onTypeRowClick(row) {
            this.stateTypes = 'view';
            this.currentType = row;
        },
        //打开增加列
        openOperationDetail(state, value = {}) {
            this.stateOperationDetail = state;
            if(state=='add'){
                this.$refs.operationDetail.currentColumn.flowTypeId =this.currentType.id;
            }else if(state=='update'){
                this.$refs.operationDetail.currentColumn ={...value};
            }
            this.$refs.operationDetail.dialogVisible = true;
        },
        delOperationDetail(state, value = {}){
            this.stateOperationDetail = state;
                 this.$confirm("确定要删除吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "info"
            })
                .then(() => {
                processTypesApi.deleteCol(value.id)
                    .then(() => {
                        this.info('删除成功');
                         this.getColumns(value.flowTypeId);
                    })
                    .catch(err => {
                    this.error(err.message[0]);
                    });
                })
                .catch(() => {
                    return;
                });

        },
       
        //pageNum,pageSize,keyword  ;获取表流程类型数据
        getTypePage(data) {
            processTypesApi.getTypePage(data).then(res => {
                if (res) {
                    this.processTypesList = res;

                    if (res.total > 0) {
                        this.$refs.typeTable.setCurrentRow(res.list[0]);
                        this.currentType = res.list[0];
                    }
                }
            }).catch(err => {
                this.error(err.message[0])
            })
        },

        //获取扩展列的内容
        getColumns(id) {
            processTypesApi.getColumns(id).then(res => {
                if (res) {
                    this.detailList  = res.map(c => {
                             let obj = JSON.parse(c.taskColInfo);                              
                             if(obj){
                                 obj.id = c.id;
                                 obj.flowTypeId = c.flowTypeId;
                             }
                             return obj;
                       
                        });    
                }
            }).catch(err => {
                this.error(err.message[0])
            })
        },
    },
    mounted() {
        this.getTypePage(this.searchForm);
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

    .base-message {
        .item {
            margin-right: 8px;
        }

        .el-divider--horizontal {
            width: 102%;
            position: relative;
            right: 1%;
        }

        .el-form {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;

            .el-form-item {
                width: 45%;
            }
        }

        .table-box {
            box-sizing: border-box;
            flex: 1;
            padding-right: 8px;
            overflow: scroll;
        }
    }
}
</style>
