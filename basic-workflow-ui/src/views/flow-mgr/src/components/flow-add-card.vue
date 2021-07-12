<template>
  <el-dialog
    :title="cardTitle"
    :visible.sync="showDialog"
    width="420px"
    append-to-body
    v-draggable
    :close-on-click-modal="false"
  >
    <el-form
      style="width:380px; margin-left:auto; margin-right: auto;"
      ref="flowForm"
      status-icon
      :model="currentFlow"
      :rules="validateRules"
      label-width="80px"
    >
      <el-form-item label="流程类型">
        <el-select
          v-model="currentFlow.typeId"
          default-first-option
          :disabled="isAdding"
          style="width:100%"
        >
          <el-option
            v-for="type in flowTypes"
            v-bind:key="type.id"
            :label="type.typeName"
            :value="type.id"
          >
            <span class="select-option">{{type.typeName}}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="流程标识" prop="flowCode">
        <el-input v-model="currentFlow.flowCode" maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="流程名称" prop="flowName">
        <el-input v-model="currentFlow.flowName" maxlength="128"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: right;">
      <el-button plain @click="showDialog = false">取消</el-button>
      <el-button type="primary" plain @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import FlowService from "@/api/flow-mgr-service";

export default {
  name: "FlowAddCard",

  data() {
    let transform = function(value) {
      return value ? value.trim() : "";
    };

    return {
      showDialog: false,
      initFlowInfo: {
        typeId: "",
        flowCode: "",
        flowName: "",
        flowToCopy: {}
      },
      currentFlow: {},
      validateRules: {
        flowCode: [
          {
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
              FlowService.checkProcKey(value).then(duplicated => {
                if (duplicated) {
                  callback(new Error("流程标识已被使用，请重新输入"));
                } else {
                  callback();
                }
              });
            },
            trigger: "blur"
          }
        ],
        flowName: [
          {
            required: true,
            transform,
            message: "请填写流程名称",
            trigger: "blur"
          }
        ]
      },
      isAdding: true,
      cardTitle: "新增流程定义",
      flowTypes: []
    };
  },

  methods: {
    add(types, currentTypeId) {
      if (this.$refs.flowForm) {
        this.$refs.flowForm.clearValidate();
      }
      this.flowTypes = types;
      this.currentFlow = Object.assign({}, this.initFlowInfo, {
        typeId: currentTypeId
      });
      this.showDialog = true;
      this.isAdding = true;
      this.cardTitle = "新增流程定义";
    },

    copy(types, targetFlow) {
      this.flowTypes = [];
      FlowService.getBizTypes().then(ret => {
        this.flowTypes = ret;
      });
      this.currentFlow = Object.assign({}, this.initFlowInfo, {
        typeId: types[0].id,
        flowToCopy: targetFlow
      });
      this.showDialog = true;
      this.isAdding = false;
      this.cardTitle = "保存为";
    },

    confirm() {
      this.$refs.flowForm.validate(valid => {
        if (valid) {
          if (this.isAdding) {
            this.$emit(
              "flow-add",
              JSON.parse(JSON.stringify(this.currentFlow))
            );
          } else {
            this.$emit(
              "flow-copy",
              JSON.parse(JSON.stringify(this.currentFlow))
            );
          }
          this.showDialog = false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.select-option {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 225px;
  display: inline-block;
}
</style>
