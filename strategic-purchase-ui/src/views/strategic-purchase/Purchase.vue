<template>
  <div class="purchase">
    <div class="header">
      <el-button plain @click="drawerFn('新增')">
        <span>新增</span>
      </el-button>
      <el-button plain @click="modification('修改')">
        <span>修改</span>
      </el-button>
      <el-button plain @click="deleteFn">

        <span>删除</span>
      </el-button>
      <el-button plain @click="enablePurchaseFn">
        <span>启用</span>
      </el-button>
      <el-button plain @click="disablePurchaseFn">
        停用
      </el-button>

      <el-button plain @click="auditPurchaseFn">
        <span>审核</span>
      </el-button>
      <el-button plain @click="getAuditNoPurchase">
        <span>驳回</span>
      </el-button>
    </div>
    <div class="el-main">
      <div class="center">
        <div class="unti-serach">
          <el-form ref="ruleForm1" :model="ruleForm1" label-width="100px" class="demo-ruleForm">
            <el-form-item label="采购组织" prop="manageOrgName">
              <el-input
                v-model="ruleForm1.manageOrgName"
                placeholder="请选择采购组织"
                suffix-icon="el-icon-more"
                @focus="variation"
                @blur="dialogTableVisible=false"
              />
              <el-dialog title="选择组织" :visible.sync="dialogTableVisible" class="dialogs">
                <el-table :data="organization" width="100%" border stripe @row-click="dialogTableFn">
                  <el-table-column property="authOrgFullPathName" label="组织名称" width="100%" />
                </el-table>
              </el-dialog>
            </el-form-item>
            <el-form-item label="审核状态" prop="auditState">
              <el-select v-model="ruleForm1.auditState" placeholder="请选择活动区域" :disabled="disabled" @change="stateFn">
                <el-option label="待审核" value="0" />
                <el-option label="审核通过" value="1" />
                <el-option label="审核中" value="2" />
                <el-option label="驳回" value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="模糊查询">
              <el-input v-model="filterTexts" style="width:190px" placeholder="分类编号、分类名称、别名" />

            </el-form-item>

            <el-form-item label="申请日期">
              <div class="block">
                <el-date-picker
                  v-model="value1"
                  :disabled="disabled"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  class="inputs"
                />
              </div>
            </el-form-item>
            <el-button type="primary" style="height: 30px; padding:4px  10px " @click="inquireFn">查询</el-button>
          </el-form>
        </div>
      </div>
      <div class="bottom">
        <template>
          <el-table
            class=" tablelist scrollBar"
            :data="tableData"
            style="width: 100%"
            border
            stripe
            :highlight-current-row="true"
            @row-click="pageFn"
          >
            <el-table-column
              :index="table_index"
              type="index"
              label="序号"
              width="50"
              prop="rowNum"
            />
            <el-table-column
              prop="code"
              label="单据编号"
              width="180"
            />
            <el-table-column
              prop="name"
              label="协议名称"
              header-align="center"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <el-link @click="openViewDialog(scope.row)">
                  {{ scope.row.name }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="protocolCode"
              label="协议类型"
            />
            <el-table-column
              prop="signDate"
              label="签订日期"
            />
            <el-table-column
              prop="protocolCode"
              label="签订年度"
            />
            <el-table-column
              prop="currencyName"
              label="币种"
            />
            <el-table-column
              prop="protocolCode"
              label="开始日期"
            />
            <el-table-column
              prop="supplerConcat"
              label="截止日期"
            />
            <el-table-column
              prop="state"
              label="状态"
              header-align="center"
              align="left"
              :show-overflow-tooltip="true"
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
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{
                  scope.row.auditState == 0
                    ? "待审核"
                    : scope.row.auditState == 1
                      ? "审核通过"
                      : scope.row.auditState == 2
                        ? "审核中"
                        : "驳回"
                }}
              </template>
            </el-table-column>
          </el-table>
          <!--          添加弹框数据,查询详情-->
          <purchaseAudit
            ref="purchaseAudit"
            :chose-info="auditData"
            :dialog-fram-audit="dialogFramAudit"
            @close="closeFramwork"
            @getPagingDatas="getPagingDatas"
          />

          <!--          分页插件-->
          <pagination
            pagination
            scroll-to-element-class-name=".tablelist"
            :total="pasges.total"
            :page-size="pasges.pageSize"
            :current-page="pasges.pageNum"
            @pagination="handle"
          />
        </template>
      </div>
    </div>

    <div class="up">
      <drawer-purchase ref="drawerPurchase" :organization="organization" :verdict="characters" :manage-org-name-data="manageOrgNameData" @reflash="getPagingDatas" />
    </div>

  </div>

</template>

<script>
import Prodictlog from '@/api/Purchase'
import purchaseAudit from './components/purchase-audit.vue'
import drawerPurchase from './components/drawer-purchase'
export default {
  name: 'Purchase',
  components: {
    purchaseAudit,
    drawerPurchase
  },
  data() {
    return {
      // 添加弹框数据
      dialogFramAudit: {},
      // 选中哪一行的数据
      auditData: {},
      purchaseData: {
        // 分录信息
        purchaseDetails: [],
        // 覆盖范围
        purchaseRanges: [],
        // 供应商
        purSupplierRanges: [],
        'id': '525496572402728960',
        'name': '云南之旅',
        'code': '002',
        'protocolCode': '0500',
        'manageOrgId': '1',
        'manageOrgName': '测试数据',
        'concatTelephone': '17852256028',
        'signDate': '',
        'currencyCode': '2222',
        'currencyName': '测试数据',
        'startDate': '2021-05-13 10:17:45',
        'endDate': '2021-05-14 10:17:45',
        'supplierId': '1',
        'supplierName': '1',
        'supplerConcat': '1',
        'supplierConcatTelephone': '1',
        'supplierAddress': '1',
        'note': '1',
        'creator': '贾珂珂',
        'createTime': '2021-06-25 14:59:04',
        'lastModifier': '贾珂珂',
        'lastModifyTime': '2021-07-06 15:27:53',
        'state': 0,
        'auditState': '1',
        'isDel': 0,
        'rowNum': 0
      },
      nosuppliesinp: '', // 不含税单价
      taxinp: '', // 税率
      taxincludedinp: '', // 含税金额
      notaxincludedinp: '', // 不含税金额
      manufacturersinp: '', // 生产厂家
      modelinp: '', // 厂家型号
      needNumber: '', // 数量
      pricetext: '', // 含税单价
      dialogTableVisible: false,
      serialindex: '',
      sortName: '',
      characters: '',
      filterTexts: '',
      indexs: '',
      filterText: '',
      disabled: true,
      supplierId: '',
      protocolCode: '',
      manageOrgName: '',
      withinDialog: '',
      organization: [],
      manageOrgNameData: [],
      supplierName: '',
      activeName: 'first',
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      value5: '',
      index: '',
      input: '',
      ruleForm1: {
        manageOrgName: '',
        protocolCode: '',
        auditState: '',
        supplierName: ''
      },
      agreement: [],
      tableData: [],
      manageInfo: [],
      selectSupplierData: [],
      tableDatas: [],
      pasges: {
        currentPage: 1,
        total: 0,
        pageNum: 1,
        pageSize: 20
      }
    }
  },
  created() {
    this.getAuthOrgNameData()
  },
  methods: {
    // 查看弹窗
    openViewDialog(row) {
      // 赋值给引用弹框的数据dialogFramAudit
      this.dialogFramAudit = { ...row }
      this.auditData = row
      // console.log(row);
      this.$refs.purchaseAudit.particularsdrawer = true
    },
    // 关闭详情弹窗
    closeFramwork() {
      this.$refs.purchaseAudit.particularsdrawer = false
    },
    // 序号
    table_index(index) {
      return (this.pasges.pageNum - 1) * this.pasges.pageSize + index + 1
    },
    variation() {
      this.dialogTableVisible = true
      if (this.dialogTableVisible === true) {
        this.disabled = false
      }
    },
    stateFn() {
      this.getPagingDatas(1)
    },
    // 选择某一行
    pageFn(row) {
      console.log(row)
      this.$refs.drawerPurchase.ruleForm3 = {
        id: row.id,
        code: row.code,
        name: row.name,
        signDate: row.signDate,
        currencyName: row.currencyName,
        startDate: row.startDate,
        endDate: row.endDate,
        supplierId: row.supplierId,
        supplierName: row.supplierName,
        note: row.note,
        protocolCode: row.protocolCode,
        manageOrgName: row.manageOrgName,
        exchangeRate: row.exchangeRate,
        concatTelephone: row.concatTelephone,
        supplerConcat: row.supplerConcat,
        supplierAddress: row.supplierAddress,
        supplierConcatTelephone: row.supplierConcatTelephone,
        targetTypeCode: row.targetTypeCode
      }
      this.indexs = row.id
      this.$refs.drawerPurchase.indexs = row.id
    },
    // 修改显示侧拉框
    modification(i) {
      this.characters = i
      this.$refs.drawerPurchase.drawer = true
    },
    // 获取详情数据
    getViewdDtailsData() {
      var data = this.indexs
      Prodictlog.getViewdDtails(data).then(res => {
      
        this.tableDatas = res
        this.ruleForm3 = {
          manageOrgName: res.manageOrgName,
          code: res.code,
          name: res.name,
          note: res.note,
          signDate: res.signDate,
          supplierAddress: res.supplierAddress,
          supplierConcatTelephone: res.supplierConcatTelephone,
          supplerConcat: res.supplerConcat,
          supplierName: res.supplierName,
          concatTelephone: res.concatTelephone,
          manageConcat: res.manageConcat,
          exchangeRate: res.exchangeRate,
          currencyName: res.currencyName,
          supplierId: res.supplierId,
          protocolMoney: res.protocolMoney
        }
      }).catch(err => {
        this.error(err.message[0])
      })
    },
    handle(v) {
      this.pasges.pageNum = v.currentPage
      this.pasges.pageSize = v.pageSize
      this.getPagingDatas(v.currentPage)
    },
    drawerFn(i) {
      this.$refs.drawerPurchase.ruleForm3 = {
        id: '',
        code: '',
        name: '',
        signDate: '',
        currencyName: '',
        startDate: '',
        endDate: '',
        supplierId: '',
        supplierName: '',
        note: '',
        protocolCode: '',
        manageOrgName: '',
        exchangeRate: '',
        concatTelephone: '',
        supplerConcat: '',
        supplierAddress: '',
        supplierConcatTelephone: '',
        targetTypeCode: ''
      }
      if (this.ruleForm1.manageOrgName === '') {
        this.$message.error('请先选择采购组织')
        return false
      } else {
        this.characters = i
        this.$refs.drawerPurchase.drawer = true

        // if (this.manageOrgNameData.authOrgId.includes('@')) {
        //   this.$refs.drawerPurchase.switchdisabled = true
        // } else {
        //   this.$refs.drawerPurchase.switchdisabled = false
        // }
      }
    },

    // 获取分页数据
    getPagingDatas(i = 1) {
      var datas = {
        pageSize: this.pasges.pageSize,
        pageNum: i,
        auditState: this.ruleForm1.auditState,
        filterText: this.filterTexts
      }
      Prodictlog.getPagingData(datas).then(res => {
      
        this.tableData = res.list
        this.pasges.total = res.total
      }).catch(err => {
        this.error(err.message[0])
      })
    },

    // 获取采购组织数据
    getAuthOrgNameData() {
      Prodictlog.getAuthOrgName().then(res => {
      
        this.organization = res
        console.log(this.organization)
      }).catch(err => {
        this.error(err.message[0])
      })
    },
    // 删除
    deleteFn() {
      var data = this.indexs
      Prodictlog.getDelete(data).then(res => {
      
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getPagingDatas(this.pasges.currentPage)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }).catch(err => {
        this.error(err.message[0])
      })
    },
    // 提交审核
    auditPurchaseFn() {
      var data = this.indexs
      Prodictlog.auditPurchase(data).then(res => {
      
        this.getPagingDatas(this.pasges.currentPage)
      }).catch(err => {
        this.error(err.message[0])
      })
    },
    // 审核驳回
    getAuditNoPurchase() {
      var data = this.indexs
      Prodictlog.auditNoPurchase(data).then(res => {
      
        this.getPagingDatas(this.pasges.currentPage)
      }).catch(err => {
        this.error(err.message[0])
      })
    },
    // 启用
    enablePurchaseFn() {
      var data = this.indexs
      Prodictlog.getEnablePurchase(data).then(res => {
      
        this.$message({
          message: '启用成功',
          type: 'success'
        })
        this.getPagingDatas(this.pasges.currentPage)
      }).catch(err => {
        this.error(err.message[0])
      })
    },

    // 停用
    disablePurchaseFn() {
      var data = this.indexs
      Prodictlog.getDisablePurchase(data).then(res => {
      
        this.$message({
          message: '停用成功',
          type: 'success'
        })
        this.getPagingDatas(this.pasges.currentPage)
      }).catch(err => {
        this.error(err.message[0])
      })
    },

    // 选择采购组织
    dialogTableFn(row) {
      console.log(row)
      this.manageOrgNameData = row
      console.log(this.manageOrgNameData)
      console.log(row)
      this.$refs.drawerPurchase.coverageDataId = row
      this.getPagingDatas(this.pasges.currentPage)
      this.ruleForm1.manageOrgName = row.authOrgName
      this.dialogTableVisible = false
    },
    // 搜索
    inquireFn() {
      if (this.filterTexts === '') {
        this.getViewdDtailsData()
        this.getPagingDatas(this.pasges.currentPage)
      } else {
        this.getPagingDatas(this.pasges.currentPage)
      }
    }

  }
}
</script>

<style  scoped>

  /deep/.el-main{
     height: calc(100vh - 120px);
  }
  /deep/.app-main{
    height: calc(100vh - 160px);
  }
  .header{
    background: #fff;
    border-bottom: 1px solid #e8e8ea;
    padding: 6px 0 6px 28px;
  }
  .center{
    background: #fff;
    border-bottom: 1px solid #e8e8ea;
  }

  /deep/.center>.unti-serach>.el-form{
    display: flex;

    padding: 5px 0 4px 16px;
  }
  /deep/.center>.unti-serach>.el-form>.el-form-item>.el-form-item__label{
    width: 80px!important;
    text-align: center!important;
  }
  /deep/.center>.unti-serach>.el-form>.el-form-item>.el-form-item__content{
    margin-left: 80px!important;
    margin-right: 10px!important;
  }
  /deep/.demo-ruleForm1{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

  }
  /deep/.demo-ruleForm1>.el-form-item>.el-form-item__label{
    text-align: right;
  }
  /deep/.bottom>.demo-ruleForm>.el-form-item--mini{
    width: 30%;
    margin-left: 30px;
  }
  /deep/.center>.unti-serach>.el-form>.el-form-item{
      margin-bottom: 0px!important;
  }
  /deep/.bottom>.el-form{

    display: flex;
    flex-wrap: wrap;

  }

  /deep/.up>.el-dialog__wrapper>.el-dialog{
    width: 90%;
    height: 75%;
    margin-top: 9vh!important;
  }

  /deep/.el-dialog__body{
    height: 500px;
    padding: 0;
  }
  /deep/.el-form-item__label {
    line-height: 30px;
    text-align: left;
  }
  /deep/.el-input__inner{
    width: 192px;
  }
  /deep/.el-pagination>.el-pagination__sizes>.el-select--mini>.el-input>.el-input__inner{
    width: 100px;
  }
  /deep/.el-pagination>.el-pagination__jump>.el-pagination__editor>.el-input__inner{
    width: 40px;
  }
  /deep/.el-pagination{
    margin-right: 80px;
    padding-bottom: 20px;
  }

  /deep/.agreement>.el-form-item__content{
  display: flex;
    position: relative;
  }
  /deep/.agreement>.el-form-item__content>button{
    width: 40px;
    height: 29px;
    position: relative;
    left: 0px;
    top: 0px;

  }
  /deep/.agreement>.el-form-item__content>button>span{
    display: block;
    width: 35px;
    height: 25px;
    position: absolute;
    left: 0px;
    top: 3px;
    font-size: 20px;
  }

  /deep/.supplier>.el-form-item__content{
    display: flex;
    position: relative;
  }
  /deep/.supplier>.el-form-item__content>button{
    width: 40px;
    height: 29px;
    position: relative;
    left: -51px;
    top: 0px;

  }
  /deep/.supplier>.el-form-item__content>button>span{
    display: block;
    width: 42px;
    height: 30px;
    position: absolute;
    left: 0px;
    top: 3px;
    font-size: 20px;
  }

  /deep/.el-tabs__content{
    padding: 0;
  }
  /deep/.el-dialog__body{
    position: relative;
  }
  /deep/.el-drawer__header{
    margin-bottom: 0;
    padding: 0;
  }
  /deep/.el-button {
    height: 26px;
    width: 60px;
    line-height: 8px;
    margin: 0 4px;
  }
.dialogs{
  width: 100%;
  height: 50%;
}
  /deep/.el-table__header{
    width: 100% !important;
  }
  /deep/.el-table__body{
    width: 100% !important;
  }
  /deep/.el-drawer__header{
    height: 55px!important;
  }
  .drawerdiv>span{
    color: #1f83f7;
  }
  .bottom-header>span{
    margin-left: 26px;
    display: block;
    width: 3px;
    height:11px;
    background: #228EF8;
    margin-top: 19px;
    margin-right: 4px;
  }
  /deep/.el-form-item__label{
    padding: 0px 8px 0 0!important;
  }
  /deep/.inputs{
    width: 100%;
  }
  /deep/.cell{
    height: 100% !important;
  }
  /deep/.suppliesinp>.el-input__inner{
    width: 100% !important;
    height: 25px!important;
    border: none!important;
  }
  .bottom{
    background: #228EF8;
  }

</style>
