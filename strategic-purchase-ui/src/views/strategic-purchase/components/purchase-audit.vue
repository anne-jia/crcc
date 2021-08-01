<template>
  <el-drawer
    title="我是标题"
    :visible.sync="particularsdrawer"
    size="100%"
    :before-close="handleClose"
    @open="open"
  >
    <span />
    <el-row class="framwork">
      <el-col class="headerform" :span="24">
        <!-- 基本信息 -->
        <el-container>
          <el-main>
            <div class="container-box scrollBar">
              <!-- <horizontalLine title="基本信息"></horizontalLine> -->
              <el-form
                ref="ruleForm"
                :model="formData"
                disabled
                label-position="left"
              >

                <el-col :span="8">
                  <el-form-item label="签订日期" prop="signDate">
                    <el-input v-model="formData.signDate" />
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="1">
                  <el-form-item label="单据日期 " prop="startDate">
                    <el-input v-model="formData.startDate" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="协议编号" prop="code">
                    <el-input :value="formData.code" />
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="1">
                  <el-form-item label="协议名称" prop="name">
                    <el-input v-model="formData.name" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="开始日期" prop="startDate">
                    <el-input v-model="formData.startDate" />
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="1">
                  <el-form-item label="结束日期" prop="endDate">
                    <el-input v-model="formData.endDate" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="币种" prop="currencyCode">
                    <el-input v-model="formData.currencyCode" />
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="1">
                  <el-form-item label="汇率" prop="exchangeRate">
                    <el-input v-model="formData.exchangeRate" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="部门名称" prop="creator">
                    <el-input v-model="formData.creator" />
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="1">
                  <el-form-item label="采购主管" prop="manageOrgName">
                    <el-input v-model="formData.manageOrgName" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label="采购方联系人"
                    prop="manageConcat"
                  >
                    <el-input v-model="formData.manageConcat" />
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="1">
                  <el-form-item label="采购方电话" prop="concatTelephone">
                    <el-input v-model="formData.concatTelephone" />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="供应商" prop="supplierName">
                    <el-input v-model="formData.supplierName" />
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="1">
                  <el-form-item label="供应商联系人" prop="supplerConcat">
                    <el-input v-model="formData.supplerConcat" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="供应商地址" prop="supplierAddress">
                    <el-input v-model="formData.supplierAddress" />
                  </el-form-item>
                </el-col>
                <el-col :span="8" :offset="1">
                  <el-form-item
                    label="供应商电话"
                    prop="supplierConcatTelephone"
                  >
                    <el-input
                      v-model="formData.supplierConcatTelephone"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="协议金额" prop="protocolMoney">
                    <el-input v-model="formData.protocolMoney" />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="查询标记" prop="targetTypeCode">
                    <el-input v-model="formData.targetTypeCode" />
                  </el-form-item>
                </el-col>

                <el-col :span="8" :offset="1">
                  <el-form-item label="备注" prop="note">
                    <el-input v-model="formData.note" />
                  </el-form-item>
                </el-col>

              </el-form>
              <template>
                <el-tabs v-model="activeName" type="card">
                  <el-tab-pane label="分录信息" name="first">
                    <el-table :data="purDetails" style="width: 100%" border>

                      <el-table-column
                        prop="sortPath"
                        label="物料分类编号"
                        width="130"
                      />
                      <el-table-column
                        prop="sortName"
                        label="物料分类名称"
                        width="130"
                      />
                      <el-table-column
                        prop="materialCode"
                        label="物料编号"
                        width="130"
                      />
                      <el-table-column
                        prop="materialName"
                        label="物料名称"
                        width="130"
                      />
                      <el-table-column
                        prop="spec"
                        label="规格型号"
                        width="130"
                      />
                      <el-table-column prop="unitId" label="计量单位" />
                      <el-table-column prop="needNumber	" label="数量" />
                      <el-table-column prop="unitPrice" label="含税单价" />
                      <el-table-column
                        prop="unUnitPrice"
                        width="100"
                        label="不含税单价"
                      />
                      <el-table-column prop="taxRate" label="税率" />
                      <el-table-column prop="unitMoeny" label="含税金额" />
                      <el-table-column prop="unUnitMoeny" label="不含税金额" />
                      <el-table-column prop="note" label="备注" />
                    </el-table>
                  </el-tab-pane>
                  <el-tab-pane label="覆盖范围" name="second">
                    <el-table :data="purRanges" style="width: 100%" border>
                      <el-table-column
                        prop="manageOrgId"
                        label="组织编号"
                        width="180"
                      />
                      <el-table-column
                        prop="manageOrgName"
                        label="组织单位"
                        width="180"
                      />
                    </el-table>
                  </el-tab-pane>
                  <el-tab-pane label="供应商分录">
                    <el-table
                      :data="purSuppliers"
                      style="width: 100%"
                      border
                      height="240px"
                    >
                      <el-table-column prop="code" label="供应商编号" />
                      <el-table-column prop="name" label="供应商名称" />
                    </el-table>
                  </el-tab-pane>
                </el-tabs>
              </template>
            </div>
          </el-main>
        </el-container>
      </el-col>
    </el-row>
  </el-drawer>
<!--  <el-drawer-->
<!--    v-el-drag-dialog-->
<!--    class="audit-dialog"-->
<!--    title="战略采购详细信息"-->
<!--    :visible="visible"-->
<!--    width="960px"-->
<!--    -->
<!--    @close="handleClose()"-->
<!--  >-->
<!--   -->
<!--  </el-drawer>-->
</template>
<script>
// import horizontalLine from "@/components/StepBox/horizontal-line.vue";
import prodictAudit from '@/api/purchase-audit '

export default {
  props: {
    dialogFramAudit: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      particularsdrawer: false,
      disabled1: true,
      // 分录信息
      activeName: 'first',
      // 分录信息数据
      purDetails: [],
      // 覆盖范围
      purRanges: [],
      // 供应商分录
      purSuppliers: [],
      // 弹窗
      visible: false,
      disabled: true,
      selecttvisible: true,

      // 查询条件
      searchData: {},
      formData: {
        signDate: '', // 签订日期
        startDate: '', // 开始时间
        name: '', // 名称
        code: '', // 编号
        endDate: '', // 结束时间
        currencyCode: '', // 币种
        exchangeRate: '', // 汇率
        manageOrgName: '', // 采购方姓名
        manageConcat: '', // 采购方联系人
        concatTelephone: '', // 采购方电话
        supplierName: '', // 供应商姓名
        supplerConcat: '', // 供应商联系人
        supplierConcatTelephone: '', // 供应商电话
        supplierAddress: '', // 供应商地址
        protocolMoney: '', // 协议金额
        note: '' // 备注
      }
    }
  },
  mounted() {},
  methods: {
    // 获取详情数据
    open() {
      prodictAudit
        .getViewdDtails(this.dialogFramAudit.id)
        .then((res) => {
          if (res) {
            this.formData = { ...res }
            this.purDetails = [...res.purchaseDetails]
            this.purRanges = [...res.purchaseRanges]
            // this.purSuppliers=[...res.purSupplierRanges];
           
          }
        })
        .catch((err) => {
          // this.error(err.message[0])
          console.log(err)
        })
    },

    // 关闭事件
    handleClose(done) {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
/deep/.el-form{
  display: flex;
  flex-wrap: wrap;
}
/deep/.el-form>.el-form-item--mini{
  width: 30% !important;
  margin-bottom: 18px;
}
/deep/.el-form-item {

  display: flex;
}
/deep/.el-form>.el-form-item>.el-form-item__label{
  text-align: center;
}
  /deep/.el-col-offset-1{
    margin-left: 0px!important;
  }
  /deep/.el-form-item__label{
    width: 100px;
  }
</style>

