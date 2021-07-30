<!--  operation-->
<template>
    <el-dialog @open='opened' @close='close' append-to-body :title='getTitle' v-el-drag-dialog :visible.sync='dialogVisible' :close-on-click-modal='false' width='580px'>
        <el-form ref="flowForm" status-icon :model="currentColumn" :rules="validateRules" label-width="80px">
            <el-form-item label="标识" prop="field">
                <el-input v-model="currentColumn.field" @change="changeField" @input="inputField" maxlength="32"></el-input>
            </el-form-item>
            <el-form-item label="字段名" prop="label">
                <el-input v-model="currentColumn.label" @change="changeLabel" @input="inputLabel" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="列宽" prop="width">
                <el-input v-model="currentColumn.width" maxlength="3">
                    <template slot="append">px</template>
                </el-input>
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input v-model="currentColumn.order" maxlength="4"></el-input>
            </el-form-item>
            <el-form-item label="对齐方式" prop="align">
                <el-select v-model="currentColumn.align" default-first-option style="width:100%">
                    <el-option label="居左" value="left"></el-option>
                    <el-option label="居中" value="center"></el-option>
                    <el-option label="居右" value="right"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" style="text-align: right;">
            <el-button plain @click="close">取消</el-button>
            <el-button type="primary" @click="confirm">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import processTypesApi from '@/api/process-types-api'
import elDragDialog from '@/directive/el-drag-dialog/index'

export default {
    directives:{
        elDragDialog
    },
    props: {
        state: {
            type: String,
            default: 'add'
        }
    },
    components: {

    },
    data() {
        let transform = function (value) {
            return value ? value.trim() : "";
        };
        return {
            dialogVisible: false,
            duplicatedField: false,
            duplicatedLabel: false,

            currentColumn: {
                field: "",
                label: "",
                width: "100",
                order: "",
                align: "left",
                id: '',
                flowTypeId: "",
            },
            validateRules: {
                field: [{
                        required: true,
                        transform,
                        message: "请填写列标识",
                        trigger: "blur"
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (this.duplicatedField) {
                                callback(new Error("标识已存在"));
                            } else {
                                callback();
                            }
                        },
                        trigger: "blur"
                    }
                ],
                label: [{
                        required: true,
                        transform,
                        message: "请填写字段名",
                        trigger: "blur"
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (this.duplicatedLabel) {
                                callback(new Error("字段名已存在"));
                            } else {
                                callback();
                            }
                        },
                        trigger: "blur"
                    }
                ],
                width: [{
                        required: true,
                        transform,
                        message: "请填写列宽",
                        trigger: "blur"
                    },
                    {
                        pattern: /^(0|[1-9]\d*)$/,
                        message: "请填写数字",
                        trigger: "blur"
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (value > 200) {
                                callback(new Error("列宽不能超过200"));
                            } else {
                                callback();
                            }
                        },
                        trigger: "blur"
                    }
                ],
                order: [{
                        required: true,
                        transform,
                        message: "请填写排序",
                        trigger: "blur"
                    },
                    {
                        pattern: /^(0|[1-9]\d*)$/,
                        message: "请填写数字",
                        trigger: "blur"
                    }
                ]
            }
        }
    },
    computed: {
        getTitle() {
            switch (this.state) {
                case 'add':
                    return '新增扩展列';
                case 'update':
                    return '更新扩展列';
                case 'view':
                    return '查看扩展列';
                default:
                    return '新增扩展列';
            }
        },
    },
    methods: {
        opened() {},
        confirm() {
            this.$refs.flowForm.validate(valid => {
                if (valid) {
                    processTypesApi.saveColInfo(this.currentColumn)
                        .then(() => {
                            this.$emit("on-column-saved",this.currentColumn.flowTypeId);
                            this.close();
                        })
                        .catch(err => {
                            this.error(err.message[0]);
                        });
                }
            });

        },
        close() {
            this.$refs.flowForm.resetFields();
            this.$refs.flowForm.clearValidate();
            this.dialogVisible = false
        },
        changeField(val) {
            if (val.trim()) {
                let field = val.trim();
                let value ={
                  id:this.currentColumn.id,
                  flowTypeId:this.currentColumn.flowTypeId,
                  taskColInfo:`"field":"${field}"`
                }
                processTypesApi.isColumnDuplicate(value).then(duplicated => {
                    if(duplicated){
                        this.duplicatedField = duplicated;
                        this.$refs.flowForm.validateField('field');
                    }
                  
                }).catch(err => {
                    this.error(err.message[0])
                });
            }

        },
        inputField(val) {
            if (val.trim() && this.duplicatedField) {
                this.changeField(val);
            }
        },
        changeLabel(val) {
            if (val.trim()) {
                let label = val.trim();
                  let value ={
                  id:this.currentColumn.id,
                  flowTypeId:this.currentColumn.flowTypeId,
                  taskColInfo:`"label":"${label}"`
                }
                processTypesApi.isColumnDuplicate(value).then(duplicated => {
                    if(duplicated){
                        this.duplicatedLabel = duplicated;
                        this.$refs.flowForm.validateField('label');
                    }

                }).catch(err => {
                    this.error(err.message[0])
                });
            }
        },
        inputLabel(val) {
            if (val.trim() && this.duplicatedLabel) {
                this.changeLabel(val);
            }
        }

    },
    mounted() {

    },
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
    padding: 20px 40px 0px;
}
</style>
