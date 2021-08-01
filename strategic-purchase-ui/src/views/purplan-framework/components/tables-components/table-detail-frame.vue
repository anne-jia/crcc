<!--  detail-table-->
<template>
  <div class="detail-box">
    <div class="btn-group">
      <el-button plain @click="addDetail" :disabled="disableOpaction">
        新增
      </el-button>
      <el-button plain :disabled="disableOpaction"> 删除 </el-button>
    </div>
    <div class="table-box">
      <el-form :model="DetailsFormData" :rules="rules">
        <el-table
          :data="value"
          border
          stripe
          highlight-current-row
          :cell-class-name="setEditCellClassName"
          :row-class-name="setEditRowClassName"
          @current-change="editSuppliesDetail"
        >
          <el-table-column
            :index="tableIndex"
            type="index"
            label="序号"
            width="50"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sortPath"
            label="物料分类编码"
            min-width="140px"
            header-align="center"
            align="left"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sortName"
            label="物料分类名称"
            min-width="140px"
            header-align="center"
            align="left"
            show-overflow-tooltip
          />
          <el-table-column
            prop="unitName"
            label="计量单位"
            header-align="center"
            label-class-name="is-required"
            align="left"
            show-overflow-tooltip
            :width="getEditWidth"
          >
            <template slot-scope="{ $index, row }">
              <el-form-item prop="unitName" v-if="row.isEdit">
                <el-input
                  clearable
                  :key="$index"
                  v-model="row.unitName"
                  placeholder="计量单位"
                />
              </el-form-item>
              <span v-else>{{ row.unitName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="needNumber"
            label="数量"
            header-align="center"
            align="left"
            label-class-name="is-required"
            :width="getEditWidth"
            show-overflow-tooltip
          >
            <template slot-scope="{ $index, row }">
              <el-form-item
                prop="needNumber"
                v-if="row.isEdit"
                :index="(row.indx = $index)"
              >
                <el-input
                  clearable
                  :key="$index"
                  v-model="row.needNumber"
                  placeholder="数量"
                />
              </el-form-item>

              <span v-else :index="(row.indx = $index)">{{
                row.needNumber
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="unitPrice"
            label="含税单价"
            header-align="center"
            align="left"
            label-class-name="is-required"
            :width="getEditWidth"
            show-overflow-tooltip
          >
            <template slot-scope="{ $index, row }">
              <el-form-item prop="unitPrice" v-if="row.isEdit">
                <el-input
                  clearable
                  :key="$index"
                  v-model="row.unitPrice"
                  placeholder="含税单价"
                />
              </el-form-item>

              <span v-else>{{ row.unitPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="unUnitPrice"
            label="不含税单价"
            header-align="center"
            align="left"
            label-class-name="is-required"
            :width="getEditWidth"
            show-overflow-tooltip
          >
            <template slot-scope="{ $index, row }">
              <el-form-item prop="unUnitPrice" v-if="row.isEdit">
                <el-input
                  clearable
                  :key="$index"
                  v-model="row.unUnitPrice"
                  placeholder="不含税单价"
                />
              </el-form-item>

              <span v-else>{{ row.unUnitPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="taxRate"
            label="税率"
            header-align="center"
            align="left"
            label-class-name="is-required"
            :width="getEditWidth"
            show-overflow-tooltip
          >
            <template slot-scope="{ $index, row }">
              <el-form-item prop="taxRate" v-if="row.isEdit">
                <el-input
                  clearable
                  :key="$index"
                  v-model="row.taxRate"
                  placeholder="税率"
                />
              </el-form-item>
              <span v-else>{{ row.taxRate }}</span>
            </template></el-table-column
          >
          <el-table-column
            prop="unitMoeny"
            label="含税金额"
            header-align="center"
            align="left"
            label-class-name="is-required"
            :width="getEditWidth"
            show-overflow-tooltip
          >
            <template slot-scope="{ $index, row }">
              <el-form-item prop="unitMoeny" v-if="row.isEdit">
                <el-input
                  clearable
                  :key="$index"
                  v-model="row.unitMoeny"
                  placeholder="含税金额"
                />
              </el-form-item>
              <span v-else>{{ row.unitMoeny }}</span>
            </template></el-table-column
          >
          <el-table-column
            prop="unUnitMoeny"
            label="不含税金额"
            header-align="center"
            align="left"
            label-class-name="is-required"
            :width="getEditWidth"
            show-overflow-tooltip
          >
            <template slot-scope="{ $index, row }">
              <el-form-item prop="unUnitMoeny" v-if="row.isEdit">
                <el-input
                  clearable
                  :key="$index"
                  v-model="row.unUnitMoeny"
                  placeholder="不含税金额"
                />
              </el-form-item>

              <span v-else>{{ row.unUnitMoeny }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="manuFacturers"
            label="制造商"
            header-align="center"
            align="left"
            :width="getEditWidth"
            show-overflow-tooltip
          >
            <template slot-scope="{ $index, row }">
              <el-form-item prop="manuFacturers" v-if="row.isEdit"
                ><el-input
                  clearable
                  :key="$index"
                  v-model="row.manuFacturers"
                  placeholder="制造商"
                />
              </el-form-item>
              <span v-else>{{ row.manuFacturers }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="factoryModel"
            label="厂家型号"
            header-align="center"
            align="left"
            :width="getEditWidth"
            show-overflow-tooltip
          >
            <template slot-scope="{ $index, row }">
              <el-form-item prop="factoryModel" v-if="row.isEdit">
                <el-input
                  clearable
                  :key="$index"
                  v-model="row.factoryModel"
                  placeholder="厂家型号"
                />
              </el-form-item>

              <span v-else>{{ row.factoryModel }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="note"
            label="备注"
            header-align="center"
            align="left"
            :width="getEditWidth"
            show-overflow-tooltip
          >
            <template slot-scope="{ $index, row }">
              <el-form-item prop="note" v-if="row.isEdit"
                ><el-input
                  clearable
                  :key="$index"
                  v-model="row.note"
                  placeholder="备注"
                />
              </el-form-item>

              <span v-else>{{ row.note }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>

    <mat-code-help
      ref="matCodeHelp"
      :currentOrgId="getCurrentOrgId"
      @saveCheckedValue="checkedSupplies"
    ></mat-code-help>
  </div>
</template>

<script>
//物料列表
import matCodeHelp from "@/components/MatCodeHelp/MatCodeHelp.vue";
export default {
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: {
      type: Array,
      default: function() {
        return [];
      }
    },
    currentOrgId: String,
    disableOpaction: {
      type: Boolean,
      default: false
    }
  },
  components: {
    matCodeHelp
  },
  computed: {
    getCurrentOrgId() {
      return this.currentOrgId.includes("@")
        ? this.currentOrgId.splict("@")[0]
        : this.currentOrgId;
    },
    getEditWidth() {
      return this.disableOpaction ? "" : "180px";
    }
  },
  data() {
    return {
      //框架信息协议明细
      DetailsFormData: {
        materialName: "",
        materialCode: "",
        spec: "",
        unitName: "",
        sortName: "",
        sortPath: "",
        needNumber: "",
        unitPrice: "",
        unUnitPrice: "",
        taxRate: "",
        unitMoeny: "",
        manuFacturers: "",
        factoryModel: "",
        note: ""
      },
      currentIndex: "",
      rules: {
        needNumber: [
          {
            required: true,
            message: "数量不能为空",
            trigger: "change"
          }
        ],
        unitPrice: [
          {
            required: true,
            message: "含税单价不能为空",
            trigger: "change"
          }
        ],
        unUnitPrice: [
          {
            required: true,
            message: "不含税单价不能为空",
            trigger: "change"
          }
        ],
        taxRate: [
          {
            required: true,
            message: "税率不能为空",
            trigger: "change"
          }
        ],
        unitMoeny: [
          {
            required: true,
            message: "含税金额不能为空",
            trigger: "change"
          }
        ],
        unitMoeny: [
          {
            required: true,
            message: "不含税金额不能为空",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    addDetail() {
      this.$refs.matCodeHelp.dialogVisible = true;
    },
    // 获取选中的物料
    checkedSupplies(data) {
      if (data.length > 0) {
        let newData = data.concat(this.value);
        this.$emit("change", newData);
      }
    },
    editSuppliesDetail(currentRow, oldCurrentRow) {
      if (this.disableOpaction) return;
      if (oldCurrentRow) {
        oldCurrentRow.isEdit = false;
      }
      console.log(currentRow);
      this.currentIndex = currentRow.index;
      this.DetailsFormData = currentRow;
      currentRow.isEdit = true;
    },
    setEditCellClassName({ row, columnIndex }) {
      if (this.disableOpaction) return;
      return row.isEdit && columnIndex > 2 ? "edit-cell" : "";
    },
    setEditRowClassName({ row }) {
      if (this.disableOpaction) return;
      return row.isEdit ? "edit-row" : "";
    },
    // 序号
    tableIndex(index) {
      return index + 1;
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
$borderColor: #dcdfe6;

.detail-box {
  height: 100%;
  width: 100%;

  .btn-group {
    padding: 0px 8px 8px 8px;
    border-bottom: 1px solid $borderColor;

    .el-tooltip.el-button {
      padding: 0px 8px;
    }
  }

  ::v-deep .table-box {
    padding: 8px;
    box-sizing: border-box;

    .el-table .el-table__row.edit-row {
      .cell {
        height: 46px;
        line-height: 23px;
      }

      .edit-cell .cell.el-tooltip {
        width: 178px;
      }
    }
    .cell.is-required:after {
      content: "*";
      color: #ff4949;
      margin-left: 2px;
    }
  }
}
</style>
