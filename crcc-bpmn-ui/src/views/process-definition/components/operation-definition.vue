<!--  operation-definition-->
<template>
    <el-dialog @open='opened' @close='close' append-to-body :title='getTitle' v-el-drag-dialog :visible.sync='dialogVisible' :close-on-click-modal='false' width='480px'>
        <el-form ref="flowForm" status-icon :model="currentFlow" :rules="validateRules" label-width="88px">
            <el-form-item label="流程类型">
                <el-select :disabled="state!='copy'" v-model="currentFlow.typeId" default-first-option style="width:100%">
                    <el-option v-for="type in flowTypes" v-bind:key="type.id" :label="type.typeName" :value="type.id">
                        <span class="select-option">{{type.typeName}}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="流程标识" prop="flowCode">
                <el-input v-model="currentFlow.flowCode" @change="changeFlowCode" @input="inputFlowCode" maxlength="64"></el-input>
            </el-form-item>
            <el-form-item label="流程名称" prop="flowName">
                <el-input v-model="currentFlow.flowName" maxlength="128"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" style="text-align: right;">
            <el-button plain @click="close">取消</el-button>
            <el-button type="primary" @click="confirm">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import processDefinitionApi from "@/api/process-definition-api";

export default {
    props: {
        state: {
            // add, update, view,copy,del
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
            currentFlow: {
                typeId: '',
                flowCode: "",
                flowName: "",
                flowToCopy:{},
            },
            duplicatedFlowCode: false,
            flowTypes: [],
            validateRules: {
                flowCode: [{
                        required: true,
                        transform,
                        message: "请填写流程标识",
                        trigger: "blur"
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (/\s/.test(value)) {
                                callback(new Error("不能包含空格"));
                            }
                            if (!/^[a-z_][\w-.]*$/i.test(value)) {
                                callback(
                                    new Error("命名必须以字母开始，只能包含字母、数字、-、_")
                                );
                            }
                            callback();
                        },
                        trigger: "blur"
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (this.duplicatedFlowCode) {
                                callback(new Error("流程标识已被使用，请重新输入"));
                            } else {
                                callback();
                            }
                        },
                        trigger: "blur"
                    }
                ],
                flowName: [{
                    required: true,
                    transform,
                    message: "请填写流程名称",
                    trigger: "blur"
                }]
            },
        }
    },
    computed: {
        getTitle() {
            switch (this.state) {
                case 'add':
                    return '新增流程定义';
                case 'update':
                    return '更新流程定义';
                case 'view':
                    return '查看流程定义';
                default:
                    return '新增流程定义';
            }
        },
    },
    methods: {
        opened() {},
        close() {
            this.$refs.flowForm.resetFields();
            this.$refs.flowForm.clearValidate();
            this.dialogVisible = false
        },
        confirm() {
            this.$refs.flowForm.validate(valid => {
                if (valid) {
                     this.$emit("save",{...this.currentFlow} );
                    this.close()
                }
            });
        },
        changeFlowCode(val) {
            let value = val.trim();
            if (value) {
                processDefinitionApi.checkProcKey(value).then(duplicated => {
                    this.duplicatedFlowCode = duplicated;
                    this.$refs.flowForm.validateField('flowCode');
                }).catch(err => this.error(err.message[0]));
            }

        },
        inputFlowCode(val) {
            if (this.duplicatedFlowCode && val.trim()) {
                this.changeFlowCode(val);
            }
        },

        getBizTypes() {
            processDefinitionApi.getBizTypes().then(res => {
                if (res) {
                    this.flowTypes = res;
                }
            }).catch(err => this.error(err))
        }
    },
    mounted() {
        this.getBizTypes();
    },
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
    padding: 20px 20px 0px;
}
</style>
