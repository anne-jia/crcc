<template>
  <div>
    <el-card shadow="never">
      <div slot="header">
        <svg-icon icon-class="search" />
        <span style="margin-left:.25em;">条件检索</span>
      </div>
      <el-row>
        <el-col :span="24">
          <span>模糊查询</span>
          <el-input placeholder="编号·名称" v-model="keyword" style="width: 190px;margin-left: 1em;"></el-input>
          <el-button style="margin-left: 10px;" type="primary" @click="loadTypePage(1, 10)">搜索</el-button>
          <el-button @click="keyword=''">重置</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-row style="padding: 8px 0;">
      <el-button type="primary" plain @click="addType" :disabled="isEditing">新增</el-button>
      <el-button plain @click="editType" :disabled="isEditing || currentType.isSysDef == '1'">编辑</el-button>
      <el-button plain @click="deleteType" :disabled="isEditing || currentType.isSysDef == '1'">删除</el-button>
      <el-button plain @click="saveType" :disabled="!isEditing">保存</el-button>
    </el-row>
    <el-container>
      <el-aside style="padding: 0; width: 30%;">
        <el-card shadow="never" style="height:100%;">
          <div slot="header">
            <span>流程类型</span>
          </div>
          <el-table
            ref="typeTable"
            :data="typePage.list"
            stripe
            border
            highlight-current-row
            @row-click="onTypeRowClick"
          >
            <el-table-column prop="typeCode" label="编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="typeName" label="名称" show-overflow-tooltip></el-table-column>
          </el-table>
          <el-pagination
            style="float: right;"
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 50, 100]"
            :current-page="typePage.pageNum"
            :page-size="typePage.pageSize"
            :total="typePage.total"
            @size-change="onPageSizeChange"
            @current-change="onPageNumChange"
          ></el-pagination>
        </el-card>
      </el-aside>
      <el-main style="padding: 0;padding-left: 8px;">
        <el-card shadow="never">
          <div slot="header">
            <span>基本信息</span>
          </div>
          <el-form
            ref="typeForm"
            :model="currentType"
            label-width="60px"
            style="width: 750px;"
            :rules="formRules"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="编号" prop="typeCode">
                  <el-input v-model="currentType.typeCode" :disabled="!isEditing" maxlength="32" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="名称" prop="typeName">
                  <el-input v-model="currentType.typeName" :disabled="!isEditing" maxlength="64" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否预制">
                  <el-input :value="isTypeSysDef" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单据预览" prop="bizPage">
                  <el-input v-model="currentType.bizPage" :disabled="!isEditing" maxlength="256" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <el-row style="padding: 8px 0;" v-if="currentType.id">
          <el-button type="primary" plain @click="addCol">增加列</el-button>
        </el-row>
        <el-table :data="extendCols" border stripe highlight-current-row v-if="currentType.id">
          <el-table-column prop="field" label="标识"></el-table-column>
          <el-table-column prop="label" label="字段名"></el-table-column>
          <el-table-column prop="width" label="列宽"></el-table-column>
          <el-table-column prop="order" label="排序"></el-table-column>
          <el-table-column prop="align" label="对齐方式">
            <template
              slot-scope="{ row }"
            >{{ row.align == 'left' ? '居左' : row.align == "center" ? '居中' : '居右' }}</template>
          </el-table-column>
          <el-table-column label="操作" width="80" header-align="center" align="center">
            <template slot-scope="{ row }">
              <i class="el-icon-edit" style="margin-right: 10px;" @click="editCol(row)"></i>
              <i class="el-icon-delete" @click="deleteCol(row)"></i>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <column-edit-card ref="colEdit" @on-column-saved="onColSaved"></column-edit-card>
  </div>
</template>

<script>
import FlowTypeService from "@/api/flow-type-service";
import ColumnEditCard from "./components/extend-col-card";

export default {
  name: "FlowType",

  components: {
    ColumnEditCard
  },

  data() {
    let transform = function(value) {
      return value ? value.trim() : "";
    };
    return {
      currentType: {},
      isEditing: false,
      extendCols: [],
      keyword: "",
      typePage: {
        pageNum: 1,
        pageSize: 0,
        total: 0
      },
      formRules: {
        typeCode: [
          { required: true, transform, message: "请填写编号", trigger: "blur" },
          {
            pattern: /^[A-Za-z0-9]+$/,
            message: "请使用数字或英文字母",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              this.currentType.typeCode = this.currentType.typeCode
                ? this.currentType.typeCode.trim()
                : "";
              this.currentType.typeName = this.currentType.typeName
                ? this.currentType.typeName.trim()
                : "";
              FlowTypeService.isCodeUsed(this.currentType).then(duplicated => {
                if (duplicated) {
                  callback(new Error("编号已被使用"));
                } else {
                  callback();
                }
              });
            },
            trigger: "blur"
          }
        ],

        typeName: [
          { required: true, transform, message: "请填写名称", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              this.currentType.typeCode = this.currentType.typeCode
                ? this.currentType.typeCode.trim()
                : "";
              this.currentType.typeName = this.currentType.typeName
                ? this.currentType.typeName.trim()
                : "";
              FlowTypeService.isNameUsed(this.currentType).then(duplicated => {
                if (duplicated) {
                  callback(new Error("名称已被使用"));
                } else {
                  callback();
                }
              });
            },
            trigger: "blur"
          }
        ]
      }
    };
  },

  computed: {
    isTypeSysDef() {
      return this.currentType && this.currentType.isSysDef == "1" ? "是" : "否";
    }
  },

  watch: {
    isEditing(val) {
      if (!val) {
        if (this.$refs.typeForm) {
          this.$refs.typeForm.clearValidate();
        }
      }
    }
  },

  methods: {
    loadTypePage(page, size, sel) {
      var cond = { keyword: this.keyword ? this.keyword.trim() : "" };
      FlowTypeService.loadTypes(page, size, cond).then(ret => {
        this.typePage = ret;
        this.currentType = {};
        this.extendCols = [];

        if (ret.list && ret.list.length > 0) {
          let row = ret.list.find(t => t.id == sel);
          row ? this.selectType(row) : this.selectType(ret.list[0]);
        }
      });
    },
    onPageSizeChange(size) {
      this.loadTypePage(1, size);
    },

    onPageNumChange(page) {
      this.loadTypePage(page, this.typePage.pageSize);
    },

    onTypeRowClick(row) {
      this.selectType(row);
    },

    selectType(type) {
      this.$refs.typeTable.setCurrentRow(type);
      this.currentType = JSON.parse(JSON.stringify(type));
      this.loadExtendCol(type.id);
      this.isEditing = false;
    },

    addType() {
      this.currentType = {
        id: "",
        typeCode: "",
        typeName: "",
        bizPage: ""
      };
      this.extendCols = [];
      this.isEditing = true;
    },

    editType() {
      this.isEditing = true;
    },

    deleteType() {
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
          FlowTypeService.deleteType(this.currentType.id)
            .then(() => {
              this.loadTypePage(1, 10);
            })
            .catch(err => {
              this.error(err.message[0]);
            });
        })
        .catch(() => {
          return;
        });
    },

    saveType() {
      this.$refs.typeForm.validate(valid => {
        if (valid) {
          FlowTypeService.saveType(this.currentType)
            .then(() => {
              if (this.currentType.id) {
                this.loadTypePage(1, 10, this.currentType.id);
              } else {
                this.loadTypePage(1, 10);
              }
            })
            .catch(err => {
              this.error(err.message[0]);
            });
        }
      });
    },

    loadExtendCol(typeId) {
      FlowTypeService.loadCol(typeId).then(ret => {
        this.extendCols = ret.map(c => {
          let obj = JSON.parse(c.taskColInfo);
          obj.id = c.id;
          return obj;
        });
      });
    },

    addCol() {
      this.$refs.colEdit.add(this.currentType);
    },

    onColSaved() {
      this.loadExtendCol(this.currentType.id);
    },

    editCol(row) {
      this.$refs.colEdit.edit(this.currentType, row);
    },

    deleteCol(row) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          FlowTypeService.deleteCol(row.id)
            .then(() => {
              this.loadExtendCol(this.currentType.id);
            })
            .catch(err => {
              this.error(err.message[0]);
            });
        })
        .catch(() => {
          return;
        });
    }
  },

  mounted() {
    this.loadTypePage(1, 10);
  }
};
</script>
