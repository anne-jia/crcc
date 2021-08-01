<template>
  <div class="mat-code-table-api">
    <el-form :inline="true">
      <el-form-item label="模糊查询" prop="info" class="searchInput">
        <el-input v-model="filterText" style=" width: 270px;" placeholder="物料编号、物料名称、规格型号、标签" clearable />
      </el-form-item>
      <el-form-item label="修改日期">
        <el-date-picker v-model="modifyTime" style="width: 240px" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  @click="loadMatCodePage">查询</el-button>
        <!-- <el-button type="text" @click="resetSearchForm()" style="background: rgba(229, 242, 255, 0.7); margin-left: 8px" icon="el-icon-refresh" >重置</el-button> -->
      </el-form-item>
    </el-form>
    <div class="table-box" v-loading="loading">
        <el-table ref="multipleTable" v-loading="dataListLoading" highlight-current-row style="width: 100%" border :data="dataList" empty-text="暂无数据" @select-all="selectAll" @select="select">
          <el-table-column type="selection" header-align="center" class-name="checkboxs" align="center" width="34" />
          <el-table-column prop="code" :show-overflow-tooltip="true" header-align="center" align="left" class-name="table-cell-left" label="物料编号" />
          <el-table-column prop="name" :show-overflow-tooltip="true" header-align="center" align="left" label="物料名称" />
          <el-table-column prop="spec" :show-overflow-tooltip="true" header-align="center" align="left" label="规格型号" />
          <el-table-column prop="unitName" header-align="center" align="center" width="94" label="计量单位" />
          <el-table-column prop="sortName" :show-overflow-tooltip="true" header-align="center" align="left" label="物料分类" />
          <el-table-column prop="manageOrgName" :show-overflow-tooltip="true" header-align="center" align="left" label="管理单位" />
          <el-table-column prop="lastModifyTime" :show-overflow-tooltip="true" header-align="center" align="center" width="180" label="最后修改时间" />
          <el-table-column prop="state" header-align="center" align="center" width="50" class-name="states-group" label="状态">
            <template slot-scope="scope">
              <!-- 1启用状态，2停用状态 -->
              <i v-if="scope.row.state == 0" class="el-icon-remove" />
              <i v-else-if="scope.row.state == 1" class="el-icon-success" />
              <i v-else class="el-icon-delete" />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :page-sizes="[10, 20, 50, 100]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :total="pageInfo.total" layout="total,sizes,prev,pager,next,jumper" :pager-count="5" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>
<script>
import matSortApiService from '@/api/mat-common-help-service'
export default {
  name: 'MatCodeTable',
  props: {
    currentMatSort: Object,
    currentOrgId: String,
    defaultCheckedCodes: Array
  },
  data() {
    return {
      filterText: '',
      dataListLoading: false,
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      // 设置勾选的数据
      toggleRows: [],
      // 缓存所有勾选的数据
      allSelectionsData: [],
      currentPageAllData: [],
      // 修改日期绑定参数
      modifyTime: [],
      // 展示推荐关键词
      showSmartMatch: false,
      loading: false
    }
  },
  computed: {
    dataList() {
      return this.pageInfo ? this.pageInfo.list : []
    }
  },
  watch: {
    currentMatSort: function(nval, oVal) {
      this.loadMatCodePage()
    }
  },
  mounted() {
    this.cacheDefaultCheckedCodes()
  },
  methods: {
    clearSelection() {
      this.$refs.multipleTable.clearSelection()
      this.allSelectionsData = []
    },
    loadMatCodePage() {
      if (!this.currentMatSort.id || !this.currentMatSort.parentId) {
        return
      }
      this.loading = true
      this.filterText = this.filterText.trim()
      const queryPageParam = {
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize,
        currentOrgId: this.currentOrgId,
        matSortId: this.currentMatSort.id,
        filterText: this.filterText.trim()
      }
      if (this.modifyTime && this.modifyTime.length > 0) {
        queryPageParam['lastModifyTimeStart'] = this.modifyTime[0]
        queryPageParam['lastModifyTimeEnd'] = this.modifyTime[1]
      }
      matSortApiService
        .loadMatCodePage(queryPageParam)
        .then((data) => {
          this.pageInfo = data
          if (data.list.length > 0) {
            this.toggleRows = []
            this.pageInfo.list.forEach((item) => {
              if (typeof item.tag === 'string') {
                item.tag = item.tag.split(',')
              }
              if (
                this.allSelectionsData &&
                                this.allSelectionsData.findIndex(
                                  (temItem) => temItem.id === item.id
                                ) != -1
              ) {
                this.toggleRows.push(item)
              }
            })
            // 设置选中数据
            setTimeout(() => {
              if (this.toggleRows.length > 0) {
                this.toggleRows.forEach((row) => {
                  this.$refs.multipleTable.toggleRowSelection(
                    row
                  )
                })
              }
            }, 10)
          }
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
          this.error(err.message[0])
        })
    },
    /**
         * 修改页面size触发内容
         */
    handleSizeChange(size) {
      this.pageInfo.pageSize = size
      this.pageInfo.pageNum = 1
      this.loadMatCodePage()
    },
    /**
         * 修改页码 触发分页
         */
    handleCurrentChange(page) {
      this.pageInfo.pageNum = page
      this.loadMatCodePage()
    },

    // 获取check选择的数据 "449294275553787904"
    getCheckedData() {
      return this.allSelectionsData
    },
    /**
         * 勾选单个checkBox触发事件
         */
    select(selection, row) {
      // 如果是选中数据，则插入一条数据
      if (selection.includes(row)) {
        this.allSelectionsData.push(row)
      } else {
        // 如果是取消选中，则删除这条数据
        this.allSelectionsData.splice(
          this.allSelectionsData.findIndex(
            (item) => item.id === row.id
          ),
          1
        )
      }
    },
    /**
         * 勾选全部触发事件
         */
    selectAll(selections) {
      if (selections.length == 0) {
        this.currentPageAllData.forEach((item) => {
          this.allSelectionsData.splice(
            this.allSelectionsData.findIndex(
              (item) => item.id === row.id
            ),
            1
          )
        })
        this.currentPageAllData = selections
      } else {
        this.currentPageAllData = selections
        this.currentPageAllData.forEach((item) => {
          if (
            this.allSelectionsData.findIndex(
              (allItem) => allItem.id == item.id
            ) == -1
          ) {
            this.allSelectionsData.push(
              JSON.parse(JSON.stringify(item))
            )
          }
        })
      }
    },
    /**
         * 缓存默认选中数据
         */
    cacheDefaultCheckedCodes() {
      if (
        this.defaultCheckedCodes &&
                this.defaultCheckedCodes.length > 0
      ) {
        this.allSelectionsData = JSON.parse(
          JSON.stringify(this.defaultCheckedCodes)
        )
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.mat-code-table-api{
  
  .table-box{
    padding:8px;
  }
}

</style>
