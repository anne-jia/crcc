<!--  table-detail-rangale-->
<template>
  <div class="range-box">
    <div class="btn-group">
      <el-button plain :disabled="getOpactionDisable" @click="addDetail">
        新增
      </el-button>
      <el-button plain :disabled="getOpactionDisable" @click="delDetail">
        删除
      </el-button>
      <el-tooltip effect="dark" content="应用覆盖" placement="bottom">
        <el-button plain>
          <el-switch
            :disabled="getSwitchDisable"
            v-model="switchCover"
            @change="changeSwitch"
            >/>
          </el-switch>
        </el-button>
      </el-tooltip>
    </div>
    <div class="table-box">
      <el-table
        :data="value"
        border
        stripe
        highlight-current-row
        @row-click="changeChoseTables"
      >
        <el-table-column
          type="index"
          label="序号"
          width="50"
          align="center"
          show-overflow-tooltip
        />
        <!-- 覆盖所有采购单位 -->
        <el-table-column
          prop="manageOrgName"
          label="组织编号"
          header-align="center"
          align="left"
          show-overflow-tooltip
        />
        <el-table-column
          prop="sortPath"
          label="组织名称"
          header-align="center"
          align="left"
          show-overflow-tooltip
        />
        <!-- <el-table-column prop="sortName" label="备注" header-align="center" align="left" show-overflow-tooltip /> -->
      </el-table>
    </div>
    <range-help
      ref="rangaleHelp"
      @getRowRangeData="oneCoverageData"
      :rootNode="currentOrgInfo"
    />
  </div>
</template>

<script>
import RangeHelp from "@/components/Rangehelp/RangeHelp";
import frameworkService from "@/api/framework-service";

export default {
  props: {
    value: {
      type: Array,
      default: function() {
        return [];
      }
    },
    currentOrgId: {
      type: String,
      default: ""
    },
    disableOpaction: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: "value",
    event: "change"
  },
  components: {
    RangeHelp
  },
  watch: {
    currentOrgId: {
      handler(val, oVal) {
        if (!val) {
          return;
        }
        this.getCurrentOrgInfo(val);
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      switchCover: false,
      //应用覆盖范围
      currentRangeDate: {
        manageOrgName: "",
        sortPath: "",
        sortName: ""
      },
      //当前组织节点的数据
      currentOrgInfo: {
        code: "",
        name: "",
        fullName: "",
        layer: 1,
        sortOrder: 2,
        isLeaf: 0,
        hrCode: "",
        parentId: ""
      }
    };
  },
  computed: {
    getOpactionDisable() {
      return (
        this.currentOrgId.includes("@") ||
        this.switchCover ||
        this.disableOpaction
      );
    },
    getSwitchDisable() {
      return this.currentOrgId.includes("@") || this.disableOpaction;
    }
  },
  methods: {
    //获取新增组织信息
    addDetail() {
      this.$refs.rangaleHelp.showRangeHelpDialog = true;
    },
    delDetail() {},
    //更改选中项
    changeChoseTables(row) {},
    changeSwitch() {},
    // 选择一条覆盖范围数据
    oneCoverageData(data) {
      this.$emit("change", data);
    },
    // 获取当前组织节点信息
    getCurrentOrgInfo(id) {
      frameworkService
        .getCurrentOrgInfo(id)
        .then(res => {
          if (res) {
            this.currentOrgInfo = res;
          }
        })
        .catch(err => this.error(err.message[0]));
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
$borderColor: #dcdfe6;

.range-box {
  height: 100%;
  width: 100%;

  .btn-group {
    padding: 0px 8px 8px 8px;
    border-bottom: 1px solid $borderColor;

    .el-tooltip.el-button {
      padding: 0px 8px;
    }
  }

  .table-box {
    padding: 8px;
    box-sizing: border-box;
  }
}
</style>
