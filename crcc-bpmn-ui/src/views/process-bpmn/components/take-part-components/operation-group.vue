<!--  add-group-->
<template>
    <el-dialog @open="opened" @close="close" append-to-body :title="getTitle" v-el-drag-dialog :visible.sync="dialogVisible" custom-class="add-group-dialog" :close-on-click-modal="false" width="380px" top="30vh">
        <div>
            <el-form ref="descForm" status-icon :model="value" :rules="validateRules" label-width="60px" @submit.native.prevent>
                <el-form-item label="描述" prop="expressionDesc">
                    <el-input v-model="value.expressionDesc" maxlength="128" clearable></el-input>
                </el-form-item>
            </el-form>
        </div>

        <span slot="footer">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="submit">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    props: {
        value:{
            type:Object,
            default: function () {
                return { expressionDesc: '' }
            }
        },
        status: String,
        participants: {
            type:Array,
             default: function () {
                return []
            }
        },
        index:Number,
    },
    components: {},
    data() {
        let transform = function (value) {
            return value ? value.trim() : "";
        };

        return {
            dialogVisible: false,
            validateRules: {
                expressionDesc: [{
                        required: true,
                        transform,
                        message: "请填写参与者描述",
                        trigger: "blur"
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (this.participants.find(exp => exp.expressionDesc == value)) {
                                callback(new Error("相同的参与者描述已存在，请修改"));
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
        getTitle() {
            switch (this.status) {
                case "add":
                    return "新增参与者分组";
                case "update":
                    return "更新参与者分组";
                default:
                    return "新增参与者分组";
            }
        }
    },
    methods: {
        opened() {},
        submit() {
            this.$refs.descForm.validate(valid => {
                if (valid) {
                    if (this.status=='add') {
                        let value ={...this.value}
                      let data =  this.participants.concat([value])
                        this.$emit("expression-change", data,value);
                    } else {
                        let data = [...this.participants]
                            data.splice(this.index,1,{...this.value})
                        this.$emit("expression-change",data,{...this.value});
                    }
                    this.close();
                } else {
                    return;
                }
            });

        },
        close() {
            this.$refs.descForm.resetFields();
            this.$refs.descForm.clearValidate();
            this.dialogVisible = false;
        }
    },
    mounted() {}
};
</script>

<style lang="scss" scoped>
::v-deep .add-group-dialog {
    .el-dialog__body {
        height: 80px;
        padding: 20px 30px 20px 10px;
    }
}
</style>
