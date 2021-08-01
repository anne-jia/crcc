<template>
  <div class="opaction-framework">
    <div class="opaction-header">
      <span class="title">
        <span class="code">{{ purchaseData.code }}</span>
        <span class="name">{{ purchaseData.name }}</span>
      </span>
      <span class="opaction">
        <el-button type="primary" @click="closeOpaction"> 返回 </el-button>
      </span>
    </div>

    <div class="opaction-body">
      <div class="base-info-box scrollBar">
        <div class="line-title">
          <el-divider direction="vertical" class="line"></el-divider>概要信息
        </div>
        <el-form
          ref="purchaseData"
          :model="purchaseData"
          :rules="rules"
          label-width="100px"
          :disabled="getDisableOpaction"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="协议编号" prop="code">
                <el-input v-model="purchaseData.code" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="协议名称" prop="name">
                <el-input v-model="purchaseData.name" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="协议类型" prop="protocolCode">
                <el-input
                  v-model="purchaseData.protocolCode"
                  placeholder="请选择采购组织"
                  @focus="showHelpProtocol"
                >
                  <i
                    class="el-icon-more"
                    slot="suffix"
                    @click="showHelpProtocol"
                  >
                  </i>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="协议金额" prop="protocolMoney">
                <el-input v-model="purchaseData.protocolMoney" />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="币种" prop="currencyName">
                <el-select
                  v-model="purchaseData.currencyName"
                  placeholder="请选择货币类型"
                  style="width: 100%"
                >
                  <el-option label="人民币" value="人民币" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="汇率" prop="exchangeRate">
                <el-input v-model="purchaseData.exchangeRate" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购组织" prop="manageOrgName">
                <el-input v-model="purchaseData.manageOrgName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购方联系人" prop="manageConcat">
                <el-input v-model="purchaseData.manageConcat" />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="采购方电话" prop="concatTelephone">
                <el-input v-model="purchaseData.concatTelephone" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商" prop="supplierName">
                <el-input
                  v-model="purchaseData.supplierName"
                  placeholder="请选择采购组织"
                  @focus="showHelpSupplier"
                >
                  <i
                    class="el-icon-more"
                    slot="suffix"
                    @click="showHelpSupplier"
                  >
                  </i>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商联系人" prop="supplerConcat">
                <el-input v-model="purchaseData.supplerConcat" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商电话" prop="supplierConcatTelephone">
                <el-input v-model="purchaseData.supplierConcatTelephone" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供货类型" prop="targetTypeCode">
                <el-select
                  v-model="purchaseData.targetTypeCode"
                  placeholder="请选择供货类型"
                  @change="changeGoodsType"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in goodsType"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商地址" prop="supplierAddress">
                <el-input v-model="purchaseData.supplierAddress" />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="签订日期" prop="signDate">
                <el-date-picker
                  v-model="purchaseData.signDate"
                  format="yyyy-MM-dd  "
                  value-format="yyyy-MM-dd hh:mm:ss"
                  placeholder="请选择签订日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单据日期" prop="signDate">
                <el-date-picker
                  v-model="purchaseData.signDate"
                  format="yyyy-MM-dd  "
                  value-format="yyyy-MM-dd hh:mm:ss"
                  placeholder="请选择单据日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="开始日期" prop="startDate">
                <el-date-picker
                  v-model="purchaseData.startDate"
                  format="yyyy-MM-dd  "
                  value-format="yyyy-MM-dd hh:mm:ss"
                  placeholder="请选择开始日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结束日期" prop="endDate">
                <el-date-picker
                  v-model="purchaseData.endDate"
                  format="yyyy-MM-dd  "
                  value-format="yyyy-MM-dd hh:mm:ss"
                  placeholder="请选择结束日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="备注" prop="note">
                <el-input
                  type="textarea"
                  resize="none"
                  v-model="purchaseData.note"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-tabs type="card">
        <el-tab-pane label="框架协议明细">
          <table-detail-frame
            v-model="purchaseData.purFrameworkAgDetails"
            :currentOrgId="purchaseData.manageOrgId"
            :disableOpaction="getDisableOpaction"
          ></table-detail-frame>
        </el-tab-pane>
        <el-tab-pane label="应用范围">
          <table-detail-range
            v-model="purchaseData.purFrameworkAgRanges"
            :currentOrgId="purchaseData.manageOrgId"
            :disableOpaction="getDisableOpaction"
          ></table-detail-range>
        </el-tab-pane>
      </el-tabs>
      <div class="footer">
        <el-button @click="closeOpaction">取消</el-button>
        <el-button type="primary" @click="saveFramework">保存</el-button>
        <el-button type="primary" @click="getApply()">提交</el-button>
      </div>
    </div>
    <helpSupplierList
      ref="helpSupplierList"
      @changeChose="getChoseSupplier"
    ></helpSupplierList>
    <help-protocol-type
      ref="helpProtocolType"
      @changeChose="changeChoseProtocol"
    ></help-protocol-type>
  </div>
</template>

<script>
import frameworkService from "@/api/framework-service";
import helpSupplierList from "./help-components/help-supplier-list";
import helpProtocolType from "./help-components/help-protocol-type";

import tableDetailFrame from "./tables-components/table-detail-frame.vue";
import tableDetailRange from "./tables-components/table-detail-range.vue";

export default {
  name: "DrawerPurchase",
  components: {
    helpSupplierList,
    helpProtocolType,
    tableDetailFrame,
    tableDetailRange
  },
  props: {
    organization: Array,
    //操作类型 add ,update,view
    opactionState: {
      type: String,
      default: "view"
    }
  },

  data() {
    return {
      //框架协议的数据
      purchaseData: {
        //供货区域
        targetTypeCode: "",
        id: "",
        name: "",
        code: "",
        protocolCode: "",
        manageOrgId: "00001",
        manageOrgName: "",
        concatTelephone: "",
        signDate: "",
        currencyCode: "",
        currencyName: "",
        startDate: "",
        endDate: "",
        supplierId: "",
        supplierName: "",
        supplerConcat: "",
        supplierConcatTelephone: "",
        supplierAddress: "",
        note: "",
        creator: "",
        createTime: "",
        lastModifier: "",
        lastModifyTime: "",
        state: 0,
        auditState: "",
        isDel: 0,
        rowNum: 0,
        // 框架协议明细框架协议明细
        purFrameworkAgDetails: [
          {
            materialName: "",
            materialCode: "",
            spec: "",
            unitName: "",
            sortName: "11",
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
          {
            materialName: "",
            materialCode: "",
            spec: "",
            unitName: "",
            sortName: "11",
            sortPath: "",
            needNumber: "",
            unitPrice: "",
            unUnitPrice: "",
            taxRate: "",
            unitMoeny: "",
            manuFacturers: "",
            factoryModel: "",
            note: ""
          }
        ],
        // 应用范围
        purFrameworkAgRanges: []
      },
      //协议类型字典
      protocolType: [],
      //供货类型字典
      goodsType: [],

      rules: {
        code: [
          {
            required: true,
            message: "协议编号不能为空",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "协议名称不为空",
            trigger: "blur"
          }
        ],
        signDate: [
          {
            required: true,
            message: "请选签订择日期",
            trigger: "blur"
          }
        ],
        currencyName: [
          {
            required: true,
            message: "请选择币种",
            trigger: "blur"
          }
        ],
        startDate: [
          {
            required: true,
            message: "请选择开始时间",
            trigger: "blur"
          }
        ],
        endDate: [
          {
            required: true,
            message: "请选择结束时间",
            trigger: "blur"
          }
        ],
        supplierName: [
          {
            required: true,
            message: "请选择供应商",
            trigger: "blur"
          }
        ],
        protocolCode: [
          {
            required: true,
            message: "请选择协议类型",
            trigger: "blur"
          }
        ],
        manageOrgName: [
          {
            required: true,
            message: "请选择采购单位名称",
            trigger: "blur"
          }
        ],
        exchangeRate: [
          {
            required: true,
            message: "请选择汇率",
            trigger: "blur"
          }
        ],
        protocolMoney: [
          {
            required: true,
            message: "请选择协议金额",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {},
  mounted() {
    //获取供货类型
    this.getQueryPurSubtypesData();
  },
  computed: {
    getDisableOpaction() {
      return this.opactionState == "view";
    }
  },
  methods: {
    changeGoodsType(i) {},

    // 协议类型下拉框
    changeProtocol(i) {
      this.protocolCode = i;
    },
    // 采购组织下拉框
    purchaseselect(i) {
      this.manageOrgName = i;
    },

    // 暂存
    saveFramework() {
      console.log(this.purchaseData);

      // frameworkService
      //   .getInsertTemporary(data)
      //   .then((res) => {
      //     this.drawer = false;
      //   })
      //   .catch((err) => {
      //     this.error(err.message[0]);
      //   });
    },
    // 判断新增还是修改添加数据
    getApply() {
      this.$refs.purchaseData.validate(valid => {
        if (valid) {
          if (this.opactionState === "add") {
            this.insertFramework();
          } else {
            this.updateFramework();
          }
        } else {
          return false;
        }
      });
    },

    insertFramework() {
      frameworkService
        .insert(this.purchaseData)
        .then(() => {
          this.info("新增成功");
          this.cancel();
        })
        .catch(err => {
          this.error(err.message[0]);
        });
    },
    updateFramework() {
      frameworkService
        .update(this.purchaseData)
        .then(res => {
          this.info("修改成功");
          this.cancel();
        })
        .catch(err => {
          this.error(err.message[0]);
        });
    },
    // 获取查询供货类型
    getQueryPurSubtypesData() {
      frameworkService
        .getQueryPurSubtypes()
        .then(res => {
          if (res) {
            this.goodsType = res;
          }
        })
        .catch(err => this.error(err.message[0]));
    },
    //关闭
    closeOpaction(state = false) {
      this.$emit("closeOpaction", state);
    },
    //打开供应商帮助
    showHelpSupplier() {
      if (this.opactionState == "view") return;

      this.$refs.helpSupplierList.dialogVisible = true;
    },
    showHelpProtocol() {
      if (this.opactionState == "view") return;
      this.$refs.helpProtocolType.dialogVisible = true;
    },
    //打开获取选中的供应商
    getChoseSupplier(value) {
      this.purchaseData.supplierId = value.id;
      this.purchaseData.supplierName = value.name;
    },
    //更改协议类型
    changeChoseProtocol(value) {}
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
$borderColor: #dcdfe6;
$backgroundColor: #1890ff;
$minWidth: 918px;
.opaction-framework {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .opaction-header {
    padding: 10px 20px 10px 20px;
    line-height: 30px;
    border-bottom: 1px solid $borderColor;
    .title {
      .code {
        color: #333333;
        font-size: 16px;
        display: inline-block;
        margin-right: 4px;
      }

      .name {
        color: $backgroundColor;
      }
    }
    .opaction {
      float: right;
    }
  }

  .opaction-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: scroll;
    @include scrollBar;

    .base-info-box {
      box-sizing: border-box;
      padding: 8px 20px 0px 20px;
      min-width: $minWidth;
      // overflow: scroll;
      .line-title {
        line-height: 20px;
        margin: 20px 0;
      }

      .line.el-divider {
        width: 4px;
        background-color: $backgroundColor;
      }
    }
    .el-tabs {
      min-width: $minWidth;
      min-height: 240px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      overflow: hidden;
    }

    .el-tabs__content {
      flex: 1;
      overflow: scroll;
      @include scrollBar;

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
    .footer {
      border-top: 1px solid $borderColor;
      height: 40px;
      min-width: $minWidth;

      line-height: 40px;
      text-align: center;
    }
  }
}
</style>
