<template>
  <div class="box">
    <div v-show="!showOpactionFramework" class="framework">
      <el-form
        ref="searchFormData"
        :model="searchFormData"
        inline
        class="search-form"
      >
        <el-form-item label="采购组织" prop="manageOrgName">
          <el-input
            v-model="searchFormData.manageOrgName"
            placeholder="请选择采购组织"
            @focus="showHelpOrgPurchase"
          >
            <i class="el-icon-more" slot="suffix" @click="showHelpOrgPurchase">
            </i>
          </el-input>
        </el-form-item>
        <el-form-item label="审核状态" prop="auditState">
          <el-select
            v-model="searchFormData.auditState"
            placeholder="请选择审核状态"
          >
            <el-option
              v-for="item in auditStateOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模糊查询">
          <el-input
            v-model="searchFormData.filterText"
            style="width: 210px"
            clearable
            placeholder="分类编号、分类名称、别名"
          />
        </el-form-item>

        <el-form-item label="申请日期">
          <el-date-picker
            v-model="searchTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 243px"
            @change="changeTimes"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="opaction-btn">
        <el-button plain @click="showEditFramwork('add')"> 新增 </el-button>
        <el-button plain @click="showEditFramwork('update')"> 修改 </el-button>
        <el-button plain @click="deleteFramwork"> 删除 </el-button>
        <el-button plain @click="enablePurchaseFn"> 启用 </el-button>
        <el-button plain @click="disablePurchaseFn"> 停用 </el-button>
        <el-button plain @click="auditPurchaseFn"> 审核 </el-button>
        <el-button plain @click="rejectPurchaseFn"> 驳回 </el-button>
      </div>
      <div class="tablebox scrollBar">
        <el-table
          :data="tableData.list"
          border
          stripe
          highlight-current-row
          @row-click="changeChoseFramework"
        >
          <el-table-column
            :index="tableIndex"
            type="index"
            label="序号"
            width="50"
          />
          <el-table-column prop="code" label="单据编号" align="center" />
          <el-table-column
            prop="name"
            label="协议名称"
            header-align="center"
            align="left"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <el-link @click="showEditFramwork('view', row)">
                {{ row.name }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="protocolCode"
            header-align="center"
            align="left"
            label="协议类型"
            show-overflow-tooltip
          />
          <el-table-column
            prop="signDate"
            align="center"
            label="签订日期"
            show-overflow-tooltip
          />
          <el-table-column
            prop="protocolCode"
            align="center"
            label="签订年度"
            show-overflow-tooltip
          />
          <el-table-column
            prop="currencyName"
            header-align="center"
            align="left"
            label="币种"
            show-overflow-tooltip
          />
          <el-table-column
            prop="state"
            label="状态"
            header-align="center"
            align="left"
            how-overflow-tooltip
          >
            <template slot-scope="scope">
              {{
                scope.row.state == 0
                  ? "停用"
                  : scope.row.state == 1
                  ? "启用"
                  : scope.row.state == 9
                  ? "草稿"
                  : "暂存"
              }}
            </template>
          </el-table-column>
          <!-- 审核状态 0.待审核 1.审核通过 2.审核中 3.驳回 -->
          <el-table-column
            prop="auditState"
            label="审核状态"
            header-align="center"
            align="left"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              {{ getTableAuditState(row) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="supplierName"
            header-align="center"
            align="left"
            show-overflow-tooltip
            label="供应商名称"
          />
          <el-table-column
            prop="supplerConcat"
            header-align="center"
            align="left"
            show-overflow-tooltip
            label="供应商联系人"
          />
          <el-table-column
            prop="supplierConcatTelephone"
            header-align="center"
            align="left"
            show-overflow-tooltip
            label="供应商联系电话"
          />
          <el-table-column
            prop="supplierConcatTelephone"
            header-align="center"
            align="left"
            show-overflow-tooltip
            label="供应商地址"
          />
          <el-table-column
            prop="startDate"
            align="center"
            show-overflow-tooltip
            label="开始日期"
          />
          <el-table-column
            prop="endDate"
            align="center"
            show-overflow-tooltip
            label="结束日期"
          />
        </el-table>
        <pagination
          scroll-to-element-class-name=".tablebox"
          :total="tableData.total"
          :page-size="tableData.pageSize"
          :current-page="tableData.pageNum"
          @pagination="pagination"
        />
      </div>

      <help-org-purchase
        ref="helpOrgPurchase"
        @getChosePurchase="getChosePurchase"
      ></help-org-purchase>
    </div>
    <opaction-framework
      ref="opactionFramework"
      :class="showOpactionFramework ? 'show' : 'hide'"
      v-show="showOpactionFramework"
      @closeOpaction="closeOpactionFramewok"
      :opactionState="opactionState"
    />
  </div>
</template>

<script>
import frameworkAPI from "@/api/framework-service";
import opactionFramework from "./components/opaction-framework.vue";
//采购组织
import helpOrgPurchase from "./components/help-components/help-org-purchase.vue";
export default {
  name: "framework",
  components: {
    opactionFramework,
    helpOrgPurchase
  },
  data() {
    return {
      //审核状态字典
      auditStateOptions: [],
      //查询条件
      searchFormData: {
        manageOrgName: "铁建",
        auditState: "",
        manageOrgId: "00001",
        //模糊查询
        filterText: "",
        pageNum: 1,
        pageSize: 20,
        startDate: "",
        endDate: ""
      },
      searchTime: [],
      //选中的采购组织
      chosePurchase: {},
      //框架协议表格
      tableData: {
        list: [],
        total: 0,
        pageNum: 1,
        pageSize: 20
      },
      //add ,update,view
      opactionState: "add",
      //框架协议当前行
      selectFramework: {
        name: "",
        id: ""
      },
      showOpactionFramework: true
    };
  },
  mounted() {
    this.queryAuditStatus();
  },
  methods: {
    //显示审核状态
    getTableAuditState(row) {
      let filter = this.auditStateOptions.filter(
        item => (item.code = row.auditState)
      );
      if (filter.length > 0) {
        return filter.name;
      } else {
        return "";
      }
    },
    //获取申请日期
    changeTimes(value) {
      if (value) {
        this.searchFormData.startDate = value[0];
        this.searchFormData.endDate = value[1];
      } else {
        this.searchFormData.startDate = "";
        this.searchFormData.endDate = "";
      }
    },
    //获取选中的采购组织
    getChosePurchase(value) {
      this.searchFormData.manageOrgName = value.authOrgName;
      this.chosePurchase = { ...value };
      this.searchFormData.manageOrgId = value.authOrgId;
    },

    // 序号
    tableIndex(index) {
      return (this.tableData.pageNum - 1) * this.tableData.pageSize + index + 1;
    },
    // 选择某一行框架协议
    changeChoseFramework(row) {
      this.selectFramework = { ...row };
    },

    //显示采购组织帮助弹窗
    showHelpOrgPurchase() {
      this.$refs.helpOrgPurchase.dialogVisible = true;
    },
    // 修改显示侧拉框
    showEditFramwork(state) {
      this.opactionState = state;
      this.$refs.opactionFramework.purchaseData.manageOrgId = this.searchFormData.manageOrgId;
      this.$refs.opactionFramework.purchaseData.manageOrgName = this.searchFormData.manageOrgName;
      this.showOpactionFramework = true;
    },
    closeOpactionFramewok(state) {
      if (state) {
      }
      this.showOpactionFramework = false;
    },

    // 查看数据时单个框架协议详情数据
    getViewdDtailsData() {
      frameworkAPI
        .getViewdDtails(data)
        .then(res => {})
        .catch(err => {
          this.error(err.message[0]);
        });
    },
    //框架协议分页查询
    pagination(pageInfo) {
      let data = {
        pageNum: pageInfo.currentPage,
        pageSize: pageInfo.pageSize
      };
      let value = { ...this.searchFormData, ...data };
      this.getManageInfo(value);
    },

    // 获取框架协议表格数据
    getManageInfo(value) {
      if (value.manageOrgId && value.auditState != "") {
        frameworkAPI
          .getManageInfo(value)
          .then(res => {
            if (res) {
              this.tableData = res;
            }
          })
          .catch(err => {
            this.error(err.message[0]);
          });
      }
    },

    // 删除
    deleteFramwork() {
      this.$confirm("确定删除框架协议吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          frameworkAPI
            .deleteById(selectFramework.id)
            .then(res => {
              this.info("删除成功");
              this.getManageInfo(this.searchFormData);
            })
            .catch(err => {
              this.error(err.message[0]);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 提交审核
    auditPurchaseFn() {
      frameworkAPI
        .auditFramework(data)
        .then(res => {
          this.getManageInfo(this.pasges.currentPage);
        })
        .catch(err => {
          this.error(err.message[0]);
        });
    },
    // 审核驳回
    rejectPurchaseFn() {
      frameworkAPI
        .auditNoFramework(data)
        .then(res => {
          this.getManageInfo(this.pasges.currentPage);
        })
        .catch(err => {
          this.error(err.message[0]);
        });
    },
    // 启用
    enablePurchaseFn() {
      this.$confirm("确定启动框架协议吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          frameworkAPI
            .enableFramework(selectFramework.id)
            .then(res => {
              this.info("启动成功");
              this.getManageInfo(this.searchFormData);
            })
            .catch(err => {
              this.error(err.message[0]);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消启动框架协议"
          });
        });
    },

    // 停用
    disablePurchaseFn() {
      this.$confirm("确定停用框架协议吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          frameworkAPI
            .disableFramework(selectFramework.id)
            .then(res => {
              this.info("停用成功");
              this.getManageInfo(this.searchFormData);
            })
            .catch(err => {
              this.error(err.message[0]);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消停用框架协议"
          });
        });
    },
    // 搜索
    handleSearch() {
      this.searchFormData.filterText = this.searchFormData.filterText.trim();
      this.getManageInfo(this.searchFormData);
    },

    queryAuditStatus() {
      frameworkAPI
        .queryAuditStatus()
        .then(res => {
          if (res) {
            this.auditStateOptions = res;
            this.searchFormData.auditState = "0";
            this.getManageInfo(this.searchFormData);
          }
        })
        .catch(err => this.error(err.message[0]));
    }
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.box {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.framework {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  .opaction-btn {
    border-bottom: 1px solid #e8e8ea;
    padding: 0px 28px;
    line-height: 31px;
    min-width: 668px;

    .el-button {
      margin-top: 4px;
      margin-bottom: 4px;
    }

    .el-divider--vertical {
      height: 2.2em;
    }
  }

  .search-form {
    border-bottom: 1px solid #e8e8ea;
    padding-left: 24px;
    min-width: 668px;

    .el-form-item--mini .el-form-item__label {
      line-height: 28px;
    }

    .el-form-item {
      padding: 4px 0 4px 8px;
    }

    .el-form-item {
      margin-bottom: 0;
    }
  }

  .tablebox {
    padding: 8px;
    flex: 1;
    overflow: scroll;
  }
}
.opaction-framework.show {
  transition: transform 1.5s;
  transform: translateX(0);
  position: unset;
  top: 0px;
}
.opaction-framework.hide {
  transition: transform 1.5s;
  transform: translateX(100%);
  position: absolute;
  top: 0px;
}
</style>
