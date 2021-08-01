<template>
  <div class="log-box">
    <el-form inline ref="orgForm" :model="form" class="log">
      <el-form-item   label="操作类型">
        <el-select v-model="form.orgCodevalue" @change="changeOpType" clearable placeholder="操作类型" class="form-select">
          <el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模糊查询">
        <el-input ref="formInput" v-model="form.name" @keyup.enter.native="searchTextSysLog($event)"  maxlength="60"
                  @clear="clearSearch($event)" placeholder="操作人员、操作内容" class="form-name" clearable></el-input>
      </el-form-item>
      <el-form-item label="操作时间">
        <el-date-picker
          v-model="form.date"
          @change="searchSysLogDate($event)"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:244px">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="text" @click="handleClickSearch()" style="background:rgba(229,242,255,.7)"
                   icon="el-icon-search">查询
        </el-button>
      </el-form-item>
    </el-form>
    <el-row class="log-table org-table">
      <el-col>
        <el-table ref="orgLogTable"
                  :row-class-name="tableRowClassName"
                  :data="orgLogData"
                  v-loading="listLoading"
                  empty-text="暂无数据" border lazy highlight-current-row
                  :style="setStyle?{minWidth: 'auto'} :{minWidth: '805px'}" class-name="org-log-table">
          <!-- <el-table-column type="selection" width="34" align="center" class-name="checkboxs"></el-table-column> -->
          <el-table-column label="序号" width="50" align="center" prop="tableIndex" :show-overflow-tooltip="true">
            <template slot-scope="{row}">
              <span>{{ row.tableIndex }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="操作人员" width="100" header-align="center" align="left"
                           :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="logTime" label="操作时间" align="center" width="165"></el-table-column>
          <el-table-column prop="optionName" label="操作类型" header-align="center" align="left" width="130">
            <template slot-scope="props">
              {{ props.row.optionName }}
            </template>
          </el-table-column>
          <el-table-column prop="bizTypeOpDesc" label="操作内容" header-align="center" align="left"
                           :show-overflow-tooltip="true" class-name="table-opaction">
            <template slot-scope="scope">
                        <span v-if="Array.isArray(scope.row.bizTypeOpDesc)" class="bizTypeOpDesc">
                            {{ scope.row.bizTypeOpDesc[0] }}
                        </span>
              <span v-else>
                            {{ scope.row.bizTypeOpDesc }}
                        </span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :style="setStyle?{minWidth: 'auto'} :{minWidth: '805px'}">
        <pagination v-show="total>0" scrollToElementClassName='.org-table' :total="total" :pageSize="pageSize"
                    :currentPage="currentPage" @pagination="pageLoader">
        </pagination>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import matSysLogService from '@/api/sys-log-service'
import TableAddMixin from '../mixin/tableAddMixin'

export default {
  data() {
    return {
      // 表格数据
      orgLogData: [],
      listLoading: true,
      // 分页
      currentPage: 1,
      pageSize: 20,
      total: 0,
      form: {
        name: "",
        date: "",
        orgCodevalue: '',
      },
      // 操作类型的下拉选项内容
      options: [],

    }
  },
  props: {
    tabProps: Object,

  },
  mixins: [TableAddMixin],

  mounted() {
    this.getSelectOpaction();
  },
  computed: {
    setStyle() {
      if (this.orgLogData) {
        if (this.orgLogData.length <= 20 || this.pageSize === 20) {
          return true
        } else {
          return false
        }
      }

    }
  },
  methods: {

    pageLoader(data) {
      this.pageSize = data.pageSize
      this.currentPage = data.currentPage
      this.loaderTable();
    },
    // input的回车时候搜索
    searchTextSysLog(e) {
      // 失去焦点
      this.currentPage = 1;
      this.pageSize = 20;
      e.target.blur();
      this.loaderTable();
    },
    // 清空按钮时触发
    clearSearch(e) {
      if (!this.$refs.formInput.focused) {
        this.changeOpType();
      }
    },
    //当操作类型和人员搜索框为空时候选中就触发查询
    searchSysLogDate(e) {
      if (!(this.form.orgCodevalue || this.form.name)) {
        this.changeOpType();
      }
    },

    handleClickSearch() {
      this.changeOpType();
    },
    // 下拉选项数据
    getSelectOpaction() {
      matSysLogService.getOpType4OrgLog().then(res => {
        this.options = [{
          code: "",
          name: "全部"
        }, ...res]
      })
    },
    changeOpType() {
      this.currentPage = 1;
      this.pageSize = 20;
      this.loaderTable();
    },

    // 表格数据加载
    loaderTable() {
      let logTimeStart = '', logTimeEnd = '';
      if (this.form.date) {
        logTimeStart = this.form.date[0];
        logTimeEnd = this.form.date[1];
      }
      let req = {
        page: this.currentPage,
        size: this.pageSize,
        authOrgId: this.tabProps.currentEngineerOrg.id,
        logTimeStart: logTimeStart,
        logTimeEnd: logTimeEnd,
        bizTypeOpCode: this.form.orgCodevalue,
        fuzzyQuery: this.form.name
      }
      /**
       * page 当前页码
       * size 页面大小
       * orgId 组织树id
       * logTimeStart 查询开始时间
       * logTimeEnd 查询的中止时间
       * bizTypeOpCode :操作类型
       * bizTypeOpDesc ：人员，事项的所需字
       */
      matSysLogService.getOrgLog(req).then(res => {
        if (res.list) {
          this.addOptionName(res.list, req.page, req.size, this.options);
          this.orgLogData = res.list;
          this.total = res.total;
        }
        this.listLoading = false

      }).catch(err => {
        console.warn(err);
      })
    },

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/sys-log.scss";

</style>
