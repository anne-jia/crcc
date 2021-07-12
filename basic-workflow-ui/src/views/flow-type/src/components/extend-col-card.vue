<template>
  <el-dialog
    title="增加扩展列"
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
      :model="currentColumn"
      :rules="validateRules"
      label-width="80px"
    >
      <el-form-item label="标识" prop="field">
        <el-input v-model="currentColumn.field" maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="字段名" prop="label">
        <el-input v-model="currentColumn.label" maxlength="10"></el-input>
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
      <el-button plain @click="showDialog = false">取消</el-button>
      <el-button type="primary" plain @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import FlowTypeService from "@/api/flow-type-service";

export default {
  name: "ExtendColCard",

  data() {
    let transform = function(value) {
      return value ? value.trim() : "";
    };
    return {
      showDialog: false,
      currentType: null,
      currentColumn: {
        field: "",
        label: "",
        width: "",
        order: "",
        align: "left"
      },
      validateRules: {
        field: [
          {
            required: true,
            transform,
            message: "请填写列标识",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              FlowTypeService.isColumnDuplicate({
                id: this.currentColumn.id,
                flowTypeId: this.currentType.id,
                taskColInfo: `"field":"${value}"`
              }).then(duplicated => {
                if (duplicated) {
                  callback(new Error("标识已存在"));
                } else {
                  callback();
                }
              });
            },
            trigger: "blur"
          }
        ],
        label: [
          {
            required: true,
            transform,
            message: "请填写字段名",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              FlowTypeService.isColumnDuplicate({
                id: this.currentColumn.id,
                flowTypeId: this.currentType.id,
                taskColInfo: `"label":"${value}"`
              }).then(duplicated => {
                if (duplicated) {
                  callback(new Error("字段名已存在"));
                } else {
                  callback();
                }
              });
            },
            trigger: "blur"
          }
        ],
        width: [
          {
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
        order: [
          {
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
    };
  },

  methods: {
    add(type) {
      this.currentType = type;
      this.currentColumn = {
        field: "",
        label: "",
        width: "100",
        order: "",
        align: "left"
      };
      this.clearValidate();
      this.showDialog = true;
    },

    edit(type, col) {
      this.currentType = type;
      this.currentColumn = JSON.parse(JSON.stringify(col));
      this.clearValidate();
      this.showDialog = true;
    },

    clearValidate() {
      if (this.$refs.flowForm) {
        this.$refs.flowForm.clearValidate();
      }
    },

    confirm() {
      this.$refs.flowForm.validate(valid => {
        if (valid) {
          let colInfo = {
            id: this.currentColumn.id,
            flowTypeId: this.currentType.id,
            taskColInfo: JSON.stringify(this.currentColumn)
          };
          FlowTypeService.saveColInfo(colInfo)
            .then(() => {
              this.$emit("on-column-saved");
              this.showDialog = false;
            })
            .catch(err => {
              this.error(err.message[0]);
            });
        }
      });
    }
  }
};
</script>

<style>
</style>
