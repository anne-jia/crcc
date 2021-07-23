<!--  operation-definition-->
<template>
    <el-dialog @open='opened' @close='close' append-to-body :title='getTitle' v-el-drag-dialog :visible.sync='dialogVisible' :close-on-click-modal='false' width='480px'>
        <el-form ref="flowForm" status-icon :model="currentFlow" :rules="validateRules" label-width="88px">
            <el-form-item label="流程类型" prop="typeId">
                <el-select :disabled="state!='copy'" v-model="currentFlow.typeId" default-first-option style="width:100%">
                    <el-option v-for="type in flowTypes" v-bind:key="type.id" :label="type.typeName" :value="type.id">
                        <span class="select-option">{{type.typeName}}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="编制公司" prop="companyName">
                <el-select :disabled="state!='copy'" :value="currentFlow.companyName" default-first-option filterable @change="changeCompany" style="width:100%">
                      <el-option
                        v-for="item in companyList"
                        :key="item.id"
                        :label="item.pathName"
                        :disabled='!(item.hasPermission)'
                        :value="item"
                        >
                        </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="流程标识" prop="flowCode">
                <el-input v-model="currentFlow.flowCode" clearable @change="changeFlowCode" @input="inputFlowCode" maxlength="64"></el-input>
            </el-form-item>
            <el-form-item label="流程名称" prop="flowName">
                <el-input v-model="currentFlow.flowName" clearable maxlength="128"></el-input>
            </el-form-item>
            <el-form-item label="是否公开" prop="general">
                  <el-select v-model="currentFlow.general" placeholder="请选择是否公开"  style="width:100%">
                    <el-option
                    v-for="item in optionsGeneral"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                    </el-option>
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
                companyId: "",
                companyName: "",
                companyPath:'',

                general:false,
                //拷贝
                flowToCopy:{},
            },
            duplicatedFlowCode: false,
            //流程类型 表格数据
            flowTypes: [],
              //有权限公司列表
            companyList:[],
            // 是否公开
            optionsGeneral:[
                {
                    value: false,
                    label: '否'  
                }, {
                    value: true,
                    label: '是'  
                },
            ],
            validateRules: {
                   typeId:[{  
                    required: true,
                    transform,
                    message: "流程类型不能为空",
                    trigger: "change"
                }],
                flowCode: [{
                        required: true,
                        transform,
                        message: "请填写流程标识",
                        trigger: "change"
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
                        trigger: "change"
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (this.duplicatedFlowCode) {
                                callback(new Error("流程标识已被使用，请重新输入"));
                            } else {
                                callback();
                            }
                        },
                        trigger: "change"
                    }
                ],
                companyName:[{  
                    required: true,
                    message: "编制公司不能为空",
                    trigger: "change"
                }],
                flowName: [{
                    required: true,
                    transform,
                    message: "请填写流程名称",
                    trigger: "change"
                }],
                general:[{  
                    required: true,
                    message: "是否公开不能为空",
                    trigger: "change"
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
             //更改选中公司
        changeCompany(val){
            let company={
                companyId:val.id,
                companyName:val.pathName,
                companyPath:val.path
            }
            this.currentFlow ={...this.currentFlow,...company}
            // this.choseType={...this.choseType,...company};
        },
        close() {
            this.$refs.flowForm.clearValidate();
            this.$refs.flowForm.resetFields();
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
