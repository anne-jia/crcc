<template>
  <el-dialog
    title="新增流程定义"
    :visible.sync="showDialog"
    width="700px"
    append-to-body
    v-draggable
    :close-on-click-modal="false"
  >
    <el-card shadow="never">
      <div slot="header">
        <svg-icon icon-class="search" />
        <span style="margin-left:.25em;">条件检索</span>
      </div>
      <el-row>
        <el-col :span="24">
          <span>模糊查询</span>
          <el-input placeholder="标识·名称·类型" v-model="keyword" style="width: 190px;margin-left: 1em;"></el-input>
          <el-button style="margin-left: 10px;" type="primary" @click="loadFlowPage(1, 10)">搜索</el-button>
          <el-button @click.native.prevent="keyword=''">重置</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-table
      ref="flowTable"
      :data="flowDefinitions"
      height="235"
      stripe
      highlight-current-row
      style="margin-top:8px;"
    >
      <el-table-column type="selection" reserve-selection></el-table-column>
      <el-table-column prop="procKey" label="标识" show-overflow-tooltip></el-table-column>
      <el-table-column prop="procName" label="名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="typeName" label="类型" show-overflow-tooltip></el-table-column>
    </el-table>
    <el-row style="margin-top: 1em;">
      <el-col :span="24" style="text-align: right;">
        <el-pagination
          style="float: right;"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100]"
          :current-page="flowPage.pageNum"
          :page-size="flowPage.pageSize"
          :total="flowPage.total"
          @size-change="onPageSizeChange"
          @current-change="onPageNumChange"
        ></el-pagination>
      </el-col>
    </el-row>
    <div slot="footer" style="text-align: right;">
      <el-button plain @click="showDialog = false">取消</el-button>
      <el-button type="primary" plain @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import CompanyFlowService from "@/api/company-flow-service";

export default {
  name: "FlowAddCard",

  data() {
    return {
      showDialog: false,
      flowTypes: [],
      keyword: "",
      excludeCompanyId: "",
      flowPage: {
        pageNum: 1,
        pageSize: 0,
        total: 0
      }
    };
  },

  methods: {
    loadFlowPage(page, rows) {
      let condition = {};
      this.keyword = this.keyword ? this.keyword.trim() : "";
      if (this.keyword) {
        condition.keyword = this.keyword;
      }
      if (this.excludeCompanyId) {
        condition.exclusionId = this.excludeCompanyId;
      }
      CompanyFlowService.loadHelpFlows(page, rows, condition)
        .then(ret => {
          this.flowPage = ret;
        })
        .catch(err => {
          this.error(err.message[0]);
        });
    },

    onPageSizeChange(size) {
      this.loadFlowPage(1, size);
    },

    onPageNumChange(page) {
      this.loadFlowPage(page, this.flowPage.pageSize);
    },

    show(company) {
      this.keyword = "";
      this.excludeCompanyId = company.id;
      this.loadFlowPage(1, 10);
      if (this.$refs.flowTable) {
        this.$refs.flowTable.clearSelection();
      }
      this.showDialog = true;
    },

    confirm() {
      if (this.selectedFlow.length == 0) {
        this.warn("请选择要引入的流程");
        return;
      }
      this.$emit("flow-selected", this.selectedFlow);
      this.showDialog = false;
    }
  },

  computed: {
    selectedFlow() {
      return this.$refs.flowTable.selection;
    },

    flowDefinitions() {
      return this.flowPage.list;
    }
  }
};
</script>