<template>
  <el-drawer
    :visible="drawer"
    :with-header="false"
    size="100%"
  >
    <header>
      <div class="drawerdiv">{{ ruleForm3.code }} <span>{{ ruleForm3.name }}</span></div>
      <el-button type="primary" style="width: 60px; height: 30px; padding:4px  10px " @click="cancel('ruleForm3')">返回</el-button>
    </header>
    <help-purchase ref="valueSwitchHelp" :suppliertable-data="SuppliertableData" :manage-org-name-data="manageOrgNameDatas" @getsupplerData="getsupplerData" @getMaterial="getMaterial" />
    <range-help ref="rangaleHelp" @getRowRangeData="onecoverageData" />
    <div class="bottom">
      <div class="bottom-header"><span />概要信息</div>
      <el-form ref="ruleForm3" :model="ruleForm3" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="协议编号" prop="code">
          <el-input v-model="ruleForm3.code" />
        </el-form-item>
        <el-form-item label="协议名称" prop="name">
          <el-input v-model="ruleForm3.name" />
        </el-form-item>

        <el-form-item label="协议类型" prop="protocolCode">
          <el-select v-model="ruleForm3.protocolCode" placeholder="请选择活动区域" @change="protocolselect">
            <el-option v-for="item in agreement" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>

        <el-form-item label="采购组织" prop="manageOrgName">
          <el-select v-model="ruleForm3.manageOrgName" placeholder="请选择活动区域" @change="purchaseselect">
            <el-option v-for="item in organization" :key="item.id" :label="item.name" :value="item.authOrgName" />
          </el-select>
        </el-form-item>

        <el-form-item label="币种" prop="currencyName">
          <el-select v-model="ruleForm3.currencyName" placeholder="请选择活动区域">
            <el-option label="人民币" value="人民币" />
          </el-select>
        </el-form-item>

        <el-form-item label="协议金额" prop="protocolMoney">
          <el-input v-model="ruleForm3.protocolMoney" />
        </el-form-item>

        <el-form-item label="汇率" prop="exchangeRate">

          <el-input v-model="ruleForm3.exchangeRate" />
        </el-form-item>

        <el-form-item label="签订日期" prop="signDate">
          <el-date-picker
            v-model="ruleForm3.signDate"
            type="datetime"
            format="yyyy-MM-dd hh:mm:ss"
            value-format="yyyy-MM-dd hh:mm:ss"
            placeholder="选择日期时间"
          />
        </el-form-item>

        <el-form-item label="单据日期" prop="signDate">
          <el-date-picker
            v-model="ruleForm3.signDate"
            type="datetime"
            format="yyyy-MM-dd hh:mm:ss"
            value-format="yyyy-MM-dd hh:mm:ss"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="ruleForm3.startDate"
            type="datetime"
            format="yyyy-MM-dd hh:mm:ss"
            value-format="yyyy-MM-dd hh:mm:ss"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            v-model="ruleForm3.endDate"
            type="datetime"
            format="yyyy-MM-dd hh:mm:ss"
            value-format="yyyy-MM-dd hh:mm:ss"
            placeholder="选择日期时间"
          />
        </el-form-item>

        <el-form-item label="采购方联系人" prop="manageConcat">
          <el-input v-model="ruleForm3.manageConcat" />
        </el-form-item>
        <el-form-item label="采购方电话" prop="concatTelephone">
          <el-input v-model="ruleForm3.concatTelephone" />
        </el-form-item>

        <el-form-item label="供应商" prop="supplierName.name">
          <el-select v-model="purchaseData.supplierName" :value="purchaseData.supplierName" placeholder="请选择活动区域" @change="supplierselect">
            <el-option v-for="item in SuppliertableData" :key="item.id" :label="item.name" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="供应商联系人" prop="supplerConcat">
          <el-input v-model="purchaseData.supplerConcat" />
        </el-form-item>

        <el-form-item label="供应商电话" prop="supplierConcatTelephone">
          <el-input v-model="ruleForm3.supplierConcatTelephone" />
        </el-form-item>

        <el-form-item label="供应商地址" prop="supplierAddress">
          <el-input v-model="ruleForm3.supplierAddress" />
        </el-form-item>

        <el-form-item label="查询标记" prop="targetTypeCode">
          <el-select v-model="purchaseData.targetTypeCode" placeholder="请选择活动区域" @change="queryPurSubtypesselect">
            <el-option v-for="item in queryPurSubtypesData" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="note">
          <el-input v-model="ruleForm3.note" />
        </el-form-item>
      </el-form>

      <template>

        <el-tabs type="border-card" @tab-click="open">
          <div class="btn-group">
            <el-button plain :disabled="disabled" @click="addData">
              <i class="el-icon-circle-plus-outline" />
              <span>新增</span>
            </el-button>
            <el-button plain>
              <i class="el-icon-delete" />
              <span>删除</span>
            </el-button>

            <el-switch
              v-show="switchShow"
              v-model="switchValue"
              :disabled="switchdisabled"
              inactive-text="应用覆盖"
              @change="switchFn"
            >
              />

            </el-switch></div>
          <el-tab-pane label="分录信息">
            <el-table
              :data="purchaseData.purchaseDetails"
              style="width: 100%"
              border
              height="230px"
            >
              <el-table-column
                prop="sortPath"
                label="物料分类编码"
                width="180"
              />
              <el-table-column
                prop="sortName"
                label="物料分类名称"
                width="180"
              />
              <el-table-column
                prop="unitName"
                label="计量单位"
              />
              <el-table-column
                prop="needNumber"
                label="数量"
                width="100px"
              >
                <template slot-scope="scope">
                  <span v-if="suppliesinput(scope.$index)">
                    <el-input v-model="scope.row.needNumber" placeholder="请输入内容" class="suppliesinp" />
                  </span>
                  <span v-else>{{ scope.row.needNumber }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="unitPrice"
                label="含税单价"
                width="150px"
              >
                <template slot-scope="scope">
                  <span v-if="suppliesinput(scope.$index)">
                    <el-input :key="scope.$index" v-model="scope.row.unitPrice" placeholder="请输入内容" class="suppliesinp" />
                  </span>
                  <span v-else>{{ scope.row.unitPrice }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="unUnitPrice"
                label="不含税单价"
              >
                <template slot-scope="scope">
                  <span v-if="suppliesinput(scope.$index)">
                    <el-input :key="scope.$index" v-model="scope.row.unUnitPrice" placeholder="请输入内容" class="suppliesinp" />
                  </span>
                  <span v-else>{{ scope.row.unUnitPrice }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="taxRate"
                label="税率"
              >
                <template slot-scope="scope">
                  <span v-if="suppliesinput(scope.$index)">
                    <el-input :key="scope.$index" v-model="scope.row.taxRate" placeholder="请输入内容" class="suppliesinp" />
                  </span>
                  <span v-else>{{ scope.row.taxRate }}</span>
                </template></el-table-column>
              <el-table-column
                prop="unitMoeny"
                label="含税金额"
              >
                <template slot-scope="scope">
                  <span v-if="suppliesinput(scope.$index)">
                    <el-input :key="scope.$index" v-model="scope.row.unitMoeny" placeholder="请输入内容" class="suppliesinp" />
                  </span>
                  <span v-else>{{ scope.row.unitMoeny }}</span>
                </template></el-table-column>
              <el-table-column
                prop="unUnitMoeny"
                label="不含税金额"
              >
                <template slot-scope="scope">
                  <span v-if="suppliesinput(scope.$index)">
                    <el-input :key="scope.$index" v-model="scope.row.unUnitMoeny" placeholder="请输入内容" class="suppliesinp" />
                  </span>
                  <span v-else>{{ scope.row.unUnitMoeny }}</span>
                </template></el-table-column>
              <!--              -->
              <!--              <el-table-column-->
              <!--                prop="taxRate"-->
              <!--                label="生产厂家"-->
              <!--              >-->
              <!--                <template slot-scope="scope">-->
              <!--                  <span v-if="suppliesinput(scope.$index)">-->
              <!--                    <el-input :key="scope.$index" v-model="scope.row.taxRate" placeholder="请输入内容" class="suppliesinp" />-->
              <!--                  </span>-->
              <!--                  <span v-else>{{ scope.row.taxRate }}</span>-->
              <!--                </template></el-table-column>-->
              <!--              <el-table-column-->
              <!--                prop="taxRate"-->
              <!--                label="厂家型号"-->
              <!--              >-->
              <!--                <template slot-scope="scope">-->
              <!--                  <span v-if="suppliesinput(scope.$index)">-->
              <!--                    <el-input :key="scope.$index" v-model="scope.row.taxRate" placeholder="请输入内容" class="suppliesinp" />-->
              <!--                  </span>-->
              <!--                  <span v-else>{{ scope.row.taxRate }}</span>-->
              <!--                </template></el-table-column>-->
              <el-table-column
                prop="note"
                label="备注"
              /></el-table>
          </el-tab-pane>
          <el-tab-pane label="覆盖范围">
            <el-table
              :data="purchaseData.purchaseRanges"
              style="width: 100%"
              border
              height="230px"
            >
              <el-table-column
                prop="rowNum"
                label="序号"
                width="50%"
              />
              <el-table-column
                prop="manageOrgName"
                label="组织名称"
                width="50%"
              />

            </el-table>
          </el-tab-pane>
          <el-tab-pane label="供应商分录">
            <el-table
              :data="purchaseData.purSupplierRanges"
              style="width: 100%"
              border
              height="230px"
            >
              <el-table-column
                prop="code"
                label="供应商编号"
              />
              <el-table-column
                prop="name"
                label="供应商名称"
              />

            </el-table>
          </el-tab-pane>
        </el-tabs>

      </template>
      <div class="footer">

        <el-button type="primary" style="height: 30px; padding:4px  10px;margin-top: 5px " @click="cancel('ruleForm3')">取消</el-button>
        <el-button type="primary" style="height: 30px; padding:4px  10px ;margin-top: 5px" @click="temporaryFn('ruleForm3')">保存</el-button>
        <el-button type="primary" style="height: 30px; padding:4px  10px;margin-top: 5px; " @click="getInsertData('ruleForm3')">确定</el-button>
      </div>
    </div>

  </el-drawer>
</template>

<script>
import Prodictlog from '@/api/Purchase'
import helpPurchase from './help-purchase'
import RangeHelp from '@/components/Rangehelp/RangeHelp'
export default {
  name: 'DrawerPurchase',
  components: {
    helpPurchase,
    RangeHelp

  },
  props: ['organization', 'verdict'],
  data() {
    return {
      switchShow: false,
      drawer: false,
      disabled: false,
      purchaseData: {
        // 分录信息
        purchaseDetails: [],
        // 覆盖范围
        purchaseRanges: [],
        // 供应商
        purSupplierRanges: [],
        targetTypeCode: '',
        'id': '',
        'name': '',
        'code': '',
        'protocolCode': '',
        'manageOrgId': '',
        'manageOrgName': '',
        'concatTelephone': '',
        'signDate': '',
        'currencyCode': '',
        'currencyName': '',
        'startDate': '',
        'endDate': '',
        'supplierId': '',
        'supplierName': '',
        'supplerConcat': '',
        'supplierConcatTelephone': '',
        'supplierAddress': '',
        'note': '',
        'creator': '',
        'createTime': '',
        'lastModifier': '',
        'lastModifyTime': '',
        'state': 0,
        'auditState': '',
        'isDel': 0,
        'rowNum': 0
      },
      ruleForm2: {
        manageOrgName: ''

      },
      ruleForm3: {
        manageOrgName: '',
        code: '',
        name: '',
        note: '',
        signDate: '',
        startDate: '',
        endDate: '',
        supplierAddress: '',
        supplierConcatTelephone: '',
        supplerConcat: '',
        supplierName: '',
        concatTelephone: '',
        manageConcat: '',
        exchangeRate: '',
        currencyName: '',
        supplierId: '',
        protocolCode: '',
        protocolMoney: '',
        targetTypeCode: '',
        targetTypeCodes: ''
      },
      withinDialog: '分录信息',
      coverageserial: '',
      switchdisabled: false,
      indexs: '',
      switchValue: true,
      agreement: [],
      characters: '',
      valueSwitch: 0,
      SuppliertableData: [],
      queryPurSubtypesData: [],
      manageOrgNameDatas: [],
      coverageDataId: [],
      coverageData: [],
      filterText: '',
      sortId: '',
      supplerpasges: {
        currentPage: 1,
        total: 0,
        pageSize: 20
      },
      pasges: {
        currentPage: 1,
        total: 0,
        pageNum: 1,
        pageSize: 20
      },
      rules: {
        code: [
          { required: true, message: '协议编号不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '协议名称不为空', trigger: 'blur' }
        ],
        signDate: [
          { required: true, message: '请选签订择日期', trigger: 'blur' }
        ],
        currencyName: [
          { required: true, message: '请选择币种', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ],
        supplierName: [
          { required: true, message: '请选择供应商', trigger: 'blur' }
        ],
        protocolCode: [
          { required: true, message: '请选择协议类型', trigger: 'blur' }
        ],
        manageOrgName: [
          { required: true, message: '请选择采购单位名称', trigger: 'blur' }
        ],
        exchangeRate: [
          { required: true, message: '请选择汇率', trigger: 'blur' }
        ],
        protocolMoney: [
          { required: true, message: '请选择协议金额', trigger: 'blur' }
        ]

      }
    }
  },
  created() {
    this.getSupplierData(1)
    this.getQueryPurSubtypesData()
  },
  methods: {
    getMaterial(data) {
      console.log(data)
      this.purchaseData.purchaseDetails = data
      console.log(data[0].id)
      this.sortId = data[0].id
    },
    getsupplerData(data) {
      console.log(data)
      this.purchaseData.purSupplierRanges = data
      console.log(this.purchaseData.purchaseDetails)
    },

    // 物料输入框
    suppliesinput(i) {

      return {

      }
    },
    // 获取查询标的类型
    getQueryPurSubtypesData() {
      Prodictlog.getQueryPurSubtypes().then(res => {
      
        this.queryPurSubtypesData = res
      })
    },
    queryPurSubtypesselect(i) {
      this.targetTypeCode = i.code
    },

    // 获取供应商数据
    getSupplierData(i) {
      var data = { pageNum: i, pageSize: this.supplerpasges.pageSize, filterText: this.filterText }
      Prodictlog.getSupplier(data).then(res => {
      
        this.SuppliertableData = res.list
        this.supplerpasges.total = res.total
        this.supplerpasges.currentPage = res.currentPageSize
      }).catch(err => {
        this.error(err.message[0])
      })
    },
    // 协议类型下拉框
    protocolselect(i) {
      this.protocolCode = i
      console.log(this.ruleForm3.targetTypeCode)
    },
    // 采购组织下拉框
    purchaseselect(i) {
      this.manageOrgName = i
    },
    // 获取协议类型数据
    getPurProDictData() {
      Prodictlog.getPurProDict().then(res => {
        this.agreement = res
      }).catch(err => {
        this.error(err.message[0])
      })
    },
    open(tab) {
      if (tab.index === '0') {
        this.$refs.valueSwitchHelp.judge = '分录信息'
        this.$refs.valueSwitchHelp.valueSwitch = 0
        this.withinDialog = '分录信息'
        this.switchShow = false
        this.disabled = false
      } else if (tab.index === '1') {
        this.withinDialog = '覆盖信息'
        this.switchShow = true
        this.switchValue = true
        this.$refs.valueSwitchHelp.judge = '覆盖信息'
        this.$refs.valueSwitchHelp.modal = false
        this.$refs.valueSwitchHelp.valueSwitch = 1
        console.log(this.coverageDataId.authOrgId)

        this.getCoverageData()
      } else if (tab.index === '2') {
        this.withinDialog = '供应商分录'
        this.disabled = false
        this.$refs.valueSwitchHelp.judge = '供应商分录'
        this.$refs.valueSwitchHelp.valueSwitch = 2
        this.switchShow = false
      }
    },
    // 获取覆盖范围数据
    getCoverageData() {
      Prodictlog.getCurrentOrgInfo(this.coverageDataId.authOrgId).then(res => {
      
        if (res) {
          this.coverageData = { ...this.coverageDataId, ...res }
        }
        this.$refs.rangaleHelp.loadFirstNode(this.coverageData)
      })
    },
    // 选择一条覆盖范围数据
    onecoverageData(data) {
      console.log(data)
      this.purchaseData.purchaseRanges = data
      this.coverageserial = (data.length + 1).toString()
    },
    // 判断页面
    addData() {
      if (this.$refs.valueSwitchHelp.judge === '分录信息' || this.$refs.valueSwitchHelp.judge === '供应商分录') {
        this.$refs.valueSwitchHelp.innerVisible = true
        console.log(1)
      } else {
        // this.$refs.rangaleHelp.modal = false
        // this.$refs.valueSwitchHelp.modal = true
        console.log(2)
      }
    },
    // 快关控制覆盖范围
    switchFn() {
      if (this.switchValue === true) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    // // 获取二级弹框的数据
    // fn(checkedData) {
    //   this.$refs.valueSwitchHelp.innerVisible = false
    //   this.purchaseData.purchaseDetails = checkedData
    //   this.supplierId = checkedData.id
    //   this.sortId = checkedData[0].id
    //   this.sortName = checkedData[0].name
    // },
    // closefn(inner) {
    //   this.$refs.valueSwitchHelp.innerVisible = inner
    // },
    // 输入框供应商
    supplierselect(row) {
      console.log(row)
      this.purchaseData.supplierId = row.id
      this.purchaseData.supplierName = row.name
      this.supplerConcat = row.name
    },
    // 取消
    cancel(formName) {
      this.purchaseData.purchaseDetails = []
      this.purchaseData.purchaseRanges = []
      this.purchaseData.purSupplierRanges = []
      this.drawer = false
      this.$refs[formName].clearValidate()
      this.ruleForm3 = {
        manageOrgName: '',
        code: '',
        name: '',
        note: '',
        supplierAddress: '',
        supplierConcatTelephone: '',
        supplerConcat: '',
        supplierName: '',
        concatTelephone: '',
        manageConcat: '',
        exchangeRate: '',
        currencyName: '',
        protocolMoney: ''

      }
      this.$emit('reflash')
    },
    // 暂存
    temporaryFn(ruleForm2) {
      var data = {
        name: this.ruleForm3.name,
        code: this.ruleForm3.code,
        signDate: this.ruleForm3.signDate,
        currencyName: this.ruleForm3.currencyName,
        startDate: this.ruleForm3.startDate,
        endDate: this.ruleForm3.endDate,
        supplierId: this.purchaseData.supplierId,
        supplierName: this.purchaseData.supplierName,
        note: this.ruleForm3.note,
        protocolCode: '0',
        purchaseDetails: [
          {
            materialId: this.purchaseData.purchaseDetails.id,
            materialName: this.purchaseData.purchaseDetails.name,
            materialCode: this.purchaseData.purchaseDetails.code,
            sortId: this.sortId
          }
        ]
      }
      Prodictlog.getInsertTemporary(data).then(res => {
      

        this.drawer = false
        this.cancel(ruleForm2)
      }).catch(err => {
        this.error(err.message[0])
      })
    },
    // // 获取分页数据
    // getPagingDatas(i) {
    //   var datas = {
    //     pageSize: this.pasges.pageSize,
    //     pageNum: i,
    //     auditState: this.ruleForm1.auditState,
    //     filterText: this.filterTexts
    //   }
    //   Prodictlog.getPagingData(datas).then(res => {
    //   
    //     this.tableData = res.list
    //     this.pasges.total = res.total
    //   }).catch(err => {
    //     this.error(err.message[0])
    //   })
    // },
    // 判断新增还是修改添加数据
    getInsertData(ruleForm2) {
      var that = this
      if (this.verdict === '新增') {
        console.log(1)
        this.$refs[ruleForm2].validate((valid) => {
          if (valid) {
            var data = {
              name: this.ruleForm3.name,
              code: this.ruleForm3.code,
              signDate: this.ruleForm3.signDate,
              currencyName: this.ruleForm3.currencyName,
              startDate: this.ruleForm3.startDate,
              endDate: this.ruleForm3.endDate,
              supplierId: this.purchaseData.supplierId,
              supplierName: this.purchaseData.supplierName,
              note: this.ruleForm3.note,
              targetTypeCode: this.purchaseData.targetTypeCode,
              protocolCode: '0',
              purchaseDetails: [
                {
                  materialId: this.purchaseData.purchaseDetails.id,
                  materialName: this.purchaseData.purchaseDetails.name,
                  materialCode: this.purchaseData.purchaseDetails.code,
                  sortId: this.sortId
                }
              ]

            }
            Prodictlog.getInsert(data).then(res => {
            
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              that.cancel(ruleForm2)
            }).catch(err => {
              this.error(err.message[0])
            })
          } else {
            return false
          }
        })
      } else {
        var datab = {
          id: this.indexs,
          name: this.ruleForm3.name,
          code: this.ruleForm3.code,
          signDate: this.ruleForm3.signDate,
          currencyName: this.ruleForm3.currencyName,
          startDate: this.ruleForm3.startDate,
          endDate: this.ruleForm3.endDate,
          supplierId: this.purchaseData.supplierId,
          supplierName: this.purchaseData.supplierName,
          note: this.ruleForm3.note,
          targetTypeCode: this.purchaseData.targetTypeCode,
          protocolCode: '0',
          auditState: '0',
          purchaseDetails: [
            {
              materialId: this.purchaseData.purchaseDetails[0].id,
              materialName: this.purchaseData.purchaseDetails[0].name,
              materialCode: this.purchaseData.purchaseDetails[0].code,
              sortId: this.sortId
            }
          ]
        }
        Prodictlog.getUpdate(datab).then(res => {
        
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          that.cancel(ruleForm2)
        }).catch(err => {
          this.error(err.message[0])
          console.log(err)
        })
      }
    }
  }
}
</script>

<style scoped>
  /deep/.el-main{
    height: calc(100vh - 120px);
  }
  /deep/.app-main{
    height: calc(100vh - 160px);
  }
  header{
    background: #fff;
    display: flex;
    height: 60px;

    align-items: center;
    border-bottom: 1px solid #e8e8ea;
    position: relative;
  }
  header>.drawerdiv{
    line-height: 30px;
  }
  header>.el-button{
    position: absolute;
    right: 50px;
  }
  button{
    padding: 4px 0 4px 28px;
    color: #004098;
    border: none;
    background: none;
  }
  .bottom{
    display: flex;
    flex-wrap: wrap;
  }
  .btn-group{
    padding: 4px 4px 0 30px;
  }
  /deep/.center>.unti-serach>.el-form{

    display: flex;
    flex-wrap: wrap;
    padding: 4px 0 4px 16px;
  }
  /deep/.center>.unti-serach>.el-form>.el-form-item>.el-form-item__label{
    text-align: center;
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
  /deep/.center>.el-form>.el-form-item--mini{
    margin-top: 15px;
    margin-bottom: 15px;
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
  .btn-group{

    color: #1989fa;
    border-bottom: 1px solid #e8e8ea;
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
    padding: 4px 10px 4px 10px;
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
  .drawerdiv{
    height: 30px;
    line-height: 16px;
    text-indent: 30px;
    font-size: 16px;
  }
  .drawerdiv>span{
    color: #1f83f7;
  }
  .bottom-header{
    height: 50px;
    line-height: 50px;
    display: flex;
    flex-wrap: wrap;
    width: 100%;

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
  /deep/.el-switch{
    margin-left: 15px;
  }
  /deep/.footer{
    width: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
  }
  /deep/.footer>.el-button{
    background: #1890ff;
    color:#ffffff;
  }

</style>
