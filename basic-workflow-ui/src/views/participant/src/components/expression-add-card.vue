<template>
  <el-dialog
    title="新增参与者"
    :visible.sync="showDialog"
    width="420px"
    append-to-body
    v-draggable
    :close-on-click-modal="false"
  >
    <el-form
      style="width:380px; margin-left:auto; margin-right: auto;"
      ref="descForm"
      status-icon
      :model="currentExpression"
      :rules="validateRules"
      label-width="80px"
    >
      <el-form-item label="描述" prop="expressionDesc">
        <el-input v-model="currentExpression.expressionDesc" maxlength="128"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: right;">
      <el-button plain @click="showDialog = false">取消</el-button>
      <el-button type="primary" plain @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "FlowAddCard",

  data() {
    let transform = function(value) {
      return value ? value.trim() : "";
    };

    return {
      showDialog: false,
      expList: [],
      isAdding: true,
      currentExpression: {
        expressionDesc: ""
      },
      validateRules: {
        expressionDesc: [
          {
            required: true,
            transform,
            message: "请填写参与者描述",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (this.expList.find(exp => exp.expressionDesc == value)) {
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

  methods: {
    addOrEdit(exps, current) {
      if (this.$refs.descForm) {
        this.$refs.descForm.clearValidate();
      }
      this.currentExpression.expressionDesc = current
        ? current.expressionDesc
        : "";
      this.expList = exps;
      this.isAdding = !current;
      this.showDialog = true;
    },

    confirm() {
      this.$refs.descForm.validate(valid => {
        if (valid) {
          if (this.isAdding) {
            this.$emit("expression-add", this.currentExpression.expressionDesc);
          } else {
            this.$emit(
              "expression-edit",
              this.currentExpression.expressionDesc
            );
          }

          this.showDialog = false;
        }
      });
    }
  }
};
</script>