<template>
    <div class="prodict">
        <div class="prodict-btn-group">
            <el-button plain :disabled="editable" @click="handleAdd">新增</el-button>
            <el-button plain :disabled="getUpdateDisabled" @click="handleUpdate">修改</el-button>
            <el-button plain :disabled="getUpdateDisabled" @click="handleDel">删除</el-button>
            <el-divider direction="vertical"></el-divider>

            <el-button plain :disabled="!editable" @click="handleSave()">保存</el-button>
            <el-button plain :disabled="!editable" @click="handleCancel()">取消</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button plain :disabled="getDisableBtn" @click="handleDiable">停用</el-button>
            <el-button plain :disabled="getEnableBtn" @click="handleEnable">
                启用</el-button>
        </div>
        <el-form class="unti-serach" inline @submit.native.prevent ref="form" :model="searchForm">
            <el-form-item label="模糊查询">
                <el-input v-model="searchForm.filterText" placeholder="编号、名称" clearable @clear="handleSearch" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form-item>
        </el-form>

        <div class="main">
            <div class="tableBox scrollBar">
                <el-table ref="typeTable" :data="tableData.list" border stripe highlight-current-row @row-click="changeSelect">
                    <el-table-column prop="rowNum" label="序号" width="50" align="center" />
                    <el-table-column prop="code" label="编号" header-align="center" />
                    <el-table-column prop="name" label="名称" header-align="center" />
                    <el-table-column prop="note" label="备注" header-align="center" />
                    <el-table-column prop="state" label="状态" width="70" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.state == 1" class="el-icon-success" />
                            <span v-if="scope.row.state == 0" class="el-icon-remove" />
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="tableData.total >= 0" scroll-to-element-class-name=".tableBox" :total="tableData.total" :page-size="tableData.pageSize" :current-page="tableData.pageNum" @pagination="pagination" />
            </div>
            <div class="form-box scrollBar">
                <el-form ref="typeForm" :rules="rules" :disabled="!editable" :model="formData" label-width="100px" label-position="left">
                    <el-row type="flex" justify="center">
                        <el-col :span="11">
                            <el-form-item label="编号" prop="code">
                                <el-input v-model="formData.code" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="1">
                            <el-form-item label="名称" prop="name">
                                <el-input v-model="formData.name" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="备注" prop="note">
                                <el-input v-model="formData.note" style="width:100%" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="1">
                            <el-form-item label="状态" prop="state">
                                <el-select v-model="formData.state" placeholder="启用" disabled style="width:100%">
                                    <el-option label="启用" :value="1" />
                                    <el-option label="停用" :value="0" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="停用人" prop="disableUser">
                                <el-input v-model="formData.disableUser" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="1">
                            <el-form-item label="停用时间" prop="disableTime">
                                <el-input v-model="formData.disableTime" disabled style="width:100%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="创建人" prop="creator">
                                <el-input v-model="formData.creator" disabled style="width:100%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="1">
                            <el-form-item label="创建时间" prop="createTime">
                                <el-input v-model="formData.createTime" disabled style="width:100%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="最后修改人" prop="lastModifier">
                                <el-input v-model="formData.lastModifier" disabled style="width:100%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="11" :offset="1">
                            <el-form-item label="最后修改时间" prop="lastModifyTime">
                                <el-input v-model="formData.lastModifyTime" disabled style="width:100%" />
                            </el-form-item>
                        </el-col>
                    </el-row>

                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import prodictAPI from "@/api/prodict-service";
export default {
    name: "Prodict",
    components: {},
    data() {
        return {
            searchForm: {
                filterText: "",
                pageNum: 1,
                pageSize: 20
            },
            //当前选中行
            formData: {
                id: "",
                code: "",
                name: "",
                note: "",
                state: 1,
                creator: "",
                lastModifier: "",
                disableUser: "",
                disableTime: "",
                createTime: "",
                rowNum: "",
                lastModifyTime: ""
            },
            currentSelectData: {},
            tableData: {
                list: [],
                pageNum: 1,
                pageSize: 20,
                total: 0
            },
            //是否可编辑
            editable: false,
            //是否是add,updata
            editState: "",
            rules: {
                name: [{
                    required: true,
                    message: "不能为空",
                    trigger: "blur"
                }],
                code: [{
                    required: true,
                    message: "不能为空",
                    trigger: "blur"
                }],
                note: [{
                    required: true,
                    message: "不能为空",
                    trigger: "blur"
                }]
            }
        };
    },
    created() {
        this.getPageInfo(this.searchForm);
    },
    computed: {
        //删除和修改不可用
        getUpdateDisabled() {
            return this.editable || !this.formData.id;
        },
        //停用
        getDisableBtn() {
            return this.editable || this.formData.state == 0;
        },

        //启用
        getEnableBtn() {
            return this.editable || this.formData.state == 1;
        }
    },
    methods: {
        // 获取表格数据
        getPageInfo(data) {
            prodictAPI
                .getPageInfo(data)
                .then(res => {
                    if (res) {
                        this.tableData = res;
                        if (res.list.length > 0) {
                            this.changeSelect(res.list[0]);
                            this.$refs.typeTable.setCurrentRow(res.list[0]);
                        }
                    }
                })
                .catch(err => this.error(err.message[0]));
        },
        pagination(pageInfo) {
            let data = {
                pageNum: pageInfo.currentPage,
                pageSize: pageInfo.pageSize,
                filterText: this.searchForm.filterText.trim()
            };
            this.getPageInfo(data);
        },
        // 新增
        handleAdd() {
            this.editable = true;
            this.$refs.typeForm.resetFields();
            let data = {
                id: "",
                creator: this.$store.getters.name,
                lastModifier: this.$store.getters.name,
                createTime: this.$moment().format("YYYY-MM-DD h:mm:ss"),
                lastModifyTime: this.$moment().format("YYYY-MM-DD h:mm:ss")
            };
            this.formData = {
                ...this.formData,
                ...data
            };
            this.editState = "add";
        },
        // 修改
        handleUpdate() {
            this.editState = "update";
            this.editable = true;
            let data = {
                lastModifier: this.$store.getters.name,
                lastModifyTime: this.$moment().format("YYYY-MM-DD h:mm:ss")
            };
            this.formData = {
                ...this.formData,
                ...data
            };
        },

        // 保存
        handleSave() {
            this.$refs.typeForm.validate(valid => {
                if (valid) {
                    if (this.editState === "add") {
                        prodictAPI
                            .addProdict(this.formData)
                            .then(() => {
                                this.editable = false;
                                this.getPageInfo(this.searchForm);
                                this.info("新增成功");
                            })
                            .catch(err => {
                                this.error(err.message[0]);
                            });
                    } else {
                        prodictAPI
                            .getupdate(this.formData)
                            .then(res => {
                                if (res) {
                                    this.editable = false;
                                    this.getPageInfo(this.searchForm);
                                    this.info("修改成功");
                                }
                            })
                            .catch(err => {
                                this.error(err.message[0]);
                            });
                    }
                } else {
                    return false;
                }
            });
        },

        // 取消
        handleCancel() {
            this.editable = false;
            this.$refs.typeForm.clearValidate();
            this.formData = {
                ...this.currentSelectData
            };
        },

        // 停用
        handleDiable() {
            this.$confirm(`【${this.formData.name}】将被停用, 是否继续?`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then(() => {
                    prodictAPI.stopdata(this.formData.id).then(() => {
                        this.getPageInfo(this.searchForm);
                        this.info(`【${this.formData.name}】已停用`);
                    }).catch(err=>this.error[err.message[0]]);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消停用"
                    });
                });
        },
        // 启用
        handleEnable() {
            this.$confirm(`【${this.formData.name}】将被启用, 是否继续?`, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then(() => {
                    prodictAPI.getcall(this.formData.id).then(() => {
                        this.getPageInfo(this.searchForm);
                        this.info(`【${this.formData.name}】已启用`);
                    }).catch(err=>this.error[err.message[0]]);

                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消启用"
                    });
                });

        },
        // 删除
        handleDel() {
            this.$confirm("确定要删除吗？", "提示", {
                    onfirmButtonText: "确定",
                    confirmButtonClass: "el-button--mini",
                    cancelButtonClass: "el-button--mini",
                    cancelButtonText: "取消",
                    type: "info"
                })
                .then(() => {
                    prodictAPI.getDelete(this.formData.id).then(() => {
                      this.info(`【${this.formData.name}】删除成功`);
                        this.getPageInfo(this.searchForm);
                    }).catch(err=>this.error[err.message[0]]);
                })
                .catch(() => {
                      this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        // 搜索
        handleSearch() {
            this.searchForm.filterText = this.searchForm.filterText.trim();
            this.getPageInfo(this.searchForm);
        },
        // 选择某一行
        changeSelect(row) {
            this.editable = false;
            this.formData = {
                ...row
            };
            this.currentSelectData = {
                ...row
            };
        }
    }
};
</script>

<style lang="scss" scoped>
.prodict {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

// 按钮
.prodict-btn-group {
    border-bottom: 1px solid #e8e8ea;
    padding: 0px 28px;
    line-height: 31px;
    min-width: 668px;

    .el-button {
        margin-top: 4px;
        margin-bottom: 4px;
    }

    .el-divider--vertical {
        height: 2.2em;
    }

}

// 搜索按钮
.unti-serach {
    border-bottom: 1px solid #e8e8ea;
    padding-left: 24px;
    min-width: 668px;

    ::v-deep.el-form-item--mini .el-form-item__label {
        line-height: 28px;
    }

    ::v-deep.el-form-item {
        padding: 4px 0 4px 8px;
    }

    ::v-deep.el-form-item {
        margin-bottom: 0;
    }
}

.main {
    flex: 1;
    overflow: hidden;
    display: flex;
    justify-content: flex-start;
}

.tableBox {
    padding: 8px 8px 0px;
    height: 100%;
    width: 30%;
    min-width: 480px;
    border-right: 1px solid #e8e8ea;
    overflow: scroll;
}

.form-box {
    flex: 1;
    padding: 8px;
    height: 100%;
    overflow: scroll;

    .el-form {
        min-width: 580px;

        .el-row {
            flex-wrap: wrap;
        }
    }

}

::v-deep.el-icon-success {
    color: #67c23a;
}

::v-deep.el-icon-remove {
    color: #ff4949;
}
</style>
