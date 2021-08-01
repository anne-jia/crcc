<template>
  <el-dialog
    width="80%"
    height="70%"
    :title="judge"
    :visible.sync="innerVisible"
    append-to-body
    :modal="modal"
  >
    <mat-code-help v-if="valueSwitch===0" :current-org-id="currentOrgId" @saveCheckedValue="fn" @closeDialog="closefn" />

    <template v-if="valueSwitch===2">
      <el-form :inline="true" class="form-inline-left" @submit.native.prevent>
        <el-form-item label="模糊查询">
          <el-input v-model="filterText" style="width:190px" placeholder="分类编号、分类名称、别名" />
        </el-form-item>
        <el-form-item class="mat-btn-group">
          <el-button style="background: rgba(229, 242, 255, 0.7); padding:4px  10px " icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-button style="background: rgba(229, 242, 255, 0.7); padding:4px  10px " class="btns" @click="supplerFn">确定</el-button>
      </el-form>
      <el-table
        ref="multipleTable"
        :data="SuppliertableData"
        style="width: 100%"
        border
        @select="selectFns"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="code"
          label="供应商编号"
          width="180"
        />
        <el-table-column
          prop="name"
          label="供应商名称"
          width="180"
        />
        <el-table-column
          prop="address"
          label="供应商地址"
        />
      </el-table>
      <el-pagination
        :current-page="supplerpasges.currentPage"
        :page-sizes="[20,50]"
        :page-size="supplerpasges.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="supplerpasges.total"
        @current-change="supplerhandle"
      />
    </template>
  </el-dialog>
</template>

<script>
import MatCodeHelp from '@/components/MatCodeHelp/MatCodeHelp'
import Prodictlog from '@/api/Purchase'

export default {
  name: 'HelpPurchase',
  components: {
    MatCodeHelp

  },
  props: ['SuppliertableData', 'manageOrgNameData'],
  data() {
    return {
      // 供应商
      purSupplierRanges: [],
      coverageDataId: '',
      defaultProps: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      judge: '分录查询',
      modal: true,
      outerVisible: false,
      innerVisible: false,
      valueSwitch: 0,
      filterText: '',
      currentOrgId: '00001',
      purchaseDetails: [],
      selectSupplierData: [],
      manageOrgNameDatas: [],
      supplerpasges: {
        currentPage: 1,
        total: 0,
        pageSize: 20
      }
    }
  },
  created() {

  },
  methods: {

    getSupplierData(i) {
      var data = { pageNum: i, pageSize: this.supplerpasges.pageSize, filterText: this.filterText }
      Prodictlog.getSupplier(data).then(res => {
      
        this.purSupplierRanges = res.list
        this.supplerpasges.total = res.total
        this.supplerpasges.currentPage = res.currentPageSize
      }).catch(err => {
        this.error(err.message[0])
      })
    },
    selectFns(row) {
      console.log(row)
      this.selectSupplierData = row
      console.log(this.selectSupplierData)
    },
    // // 获取覆盖范围数据
    // manageOrgNameDataFn() {
    //   console.log(this.$refs.rangeHelp)
    //   this.manageOrgNameDatas = this.manageOrgNameData
    //
    //   this.$refs.rangeHelp.loadFirstNode(this.manageOrgNameDatas)
    // },
    // 获取二级弹框的数据
    fn(checkedData) {
      this.innerVisible = false
      this.purchaseDetails = checkedData
      this.supplierId = checkedData.id
      this.sortId = checkedData[0].id
      this.sortName = checkedData[0].name
      console.log(this.purchaseDetails)
      this.$emit('getMaterial', this.purchaseDetails)
    },
    closefn() {
      this.innerVisible = false
    },
    // 添加供应商分录
    supplerFn() {
      this.purSupplierRanges = this.selectSupplierData
      console.log(this.purSupplierRanges)
      this.$emit('getsupplerData', this.purSupplierRanges)
      this.innerVisible = false

      this.toggleSelection()
    },
    // 取消供应商选择
    toggleSelection() {
      this.$refs.multipleTable.clearSelection()
    },
    // 供应商分录分页器
    supplerhandle() {
      console.log(this.characters)
    }
    // 获取覆盖范围数据
    // loadNode(node, resolve) {
    //   console.log(node)
    //   console.log(resolve)
    //   if (node.level === 0) {
    //     Prodictlog.getCurrentOrgInfo(this.coverageDataId).then(res => {
    //     
    //       this.fatherParems = res
    //     })
    //     this.coverageData = {
    //       id: this.coverageDataId,
    //       name: this.fatherParems.name,
    //       isLeaf: this.fatherParems.isLeaf,
    //       deepType: 2
    //     }
    //     // return resolve([{ name: res.name }, { name: 'region2' }])
    //   } else {
    //
    //   }
    // }
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
    border-bottom: 1px solid #e8e8ea;
  }
  .center{
    background: #fff;
    border-bottom: 1px solid #e8e8ea;
  }
  button{
    padding: 4px 0 4px 28px;
    color: #004098;
    border: none;
    background: none;
  }
  .btn-group{
    padding: 4px 4px 0 30px;
  }
  /deep/.center>.unti-serach>.el-form{
    width: 900px;
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
</style>
