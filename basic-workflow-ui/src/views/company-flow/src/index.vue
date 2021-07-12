<template>
  <div class="company-flow">
    <el-card shadow="never">
      <div slot="header">
        <svg-icon icon-class="search" />
        <span style="margin-left:.25em;">条件检索</span>
      </div>
      <el-row>
        <el-col :span="24">
          <span>模糊查询</span>
          <el-input placeholder="类型·标识·名称" v-model="keyword" style="width: 190px;margin-left: 1em;"></el-input>
          <el-button
            style="margin-left: 10px;"
            type="primary"
            @click="loadCompanyFlowPage(1, 10)"
          >搜索</el-button>
          <el-button @click.native.prevent="keyword=''">重置</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-row style="padding: 8px 0;">
      <el-button type="primary" @click="importFlow" plain>引入流程</el-button>
    </el-row>
    <el-container>
      <el-aside style="width: 30%; padding: 0;">
        <el-card shadow="never" style="height:100%">
          <div slot="header">
            <span style="margin-left:.25em;">系统组织</span>
          </div>
          <el-tree
            ref="companyTree"
            :data="companyTree"
            :expand-on-click-node="false"
            :default-expanded-keys="['all']"
            node-key="id"
            highlight-current
            @node-click="onCompanySelect"
          >
            <span slot-scope="{ node, data }" style="width:calc(100% - 30px);">
              <svg-icon v-if="data.data && data.data.isDetail == 1" icon-class="file" />
              <svg-icon v-else-if="node.expanded" icon-class="folder-open" />
              <svg-icon v-else icon-class="folder" />
              <span
                class="company-label"
                :style="{ 'color': data.data.isAuth ? '#606266' : '#C0C4CC' }"
                :title="node.label"
              >{{ node.label }}</span>
            </span>
          </el-tree>
        </el-card>
      </el-aside>
      <el-main style="padding:0px; margin-left: 8px;">
        <el-table ref="flowTable" :data="flowDefinitions" border stripe highlight-current-row>
          <el-table-column prop="typeName" label="类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="procKey" label="标识" show-overflow-tooltip></el-table-column>
          <el-table-column prop="procName" label="名称" show-overflow-tooltip></el-table-column>
          <el-table-column width="80" header-align="center" align="center" label="状态">
            <template slot-scope="{row}">
              <el-switch
                :width="36"
                :value="row.state"
                active-value="1"
                inactive-value="0"
                disabled
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column width="60" label="操作" header-align="center" align="center">
            <template slot-scope="{ row }">
              <i class="el-icon-delete" @click="removeFlow(row)"></i>
            </template>
          </el-table-column>
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
      </el-main>
    </el-container>
    <select-flow ref="flowHelper" @flow-selected="onFlowSelected"></select-flow>
  </div>
</template>

<script>
import CompanyFlowService from "@/api/company-flow-service";
import SelectFlow from "./components/select-flow-dialog";
import { setTimeout } from "timers";

export default {
  name: "CompanyFlow",

  components: {
    SelectFlow
  },

  data() {
    return {
      companyTree: [],
      keyword: "",
      flowPage: {
        pageNum: 1,
        pageSize: 0,
        total: 0
      }
    };
  },

  methods: {
    importFlow() {
      if (!this.currentCompany) {
        this.warn("请选择要引入的组织");
        return;
      }
      this.$refs.flowHelper.show(this.currentCompany);
    },

    loadCompanies() {
      CompanyFlowService.getCompanyTree().then(tree => {
        this.companyTree = tree;

        if (tree && tree.length > 0) {
          setTimeout(() => {
            this.$refs.companyTree.setCurrentKey(tree[0].data.id);
            this.loadCompanyFlowPage(1, 10);
          });
        }
      });
    },

    loadCompanyFlowPage(page, size) {
      let cond = {};
      if (this.currentCompany) {
        cond.companyId = this.currentCompany.id;
      }
      this.keyword = this.keyword ? this.keyword.trim() : "";
      if (this.keyword) {
        cond.keyword = this.keyword;
      }
      CompanyFlowService.getCompanyFlowPage(page, size, cond)
        .then(ret => {
          this.flowPage = ret;
        })
        .catch(err => {
          this.error(err.message[0]);
        });
    },

    onPageSizeChange(size) {
      this.loadCompanyFlowPage(1, size);
    },

    onPageNumChange(page) {
      this.loadCompanyFlowPage(page, this.flowPage.size);
    },

    onCompanySelect() {
      this.loadCompanyFlowPage(1, 10);
    },

    onFlowSelected(selectedFlows) {
      let companyFlow = {
        procKey: selectedFlows.map(f => f.procKey).join(","),
        companyId: this.currentCompany.id
      };
      CompanyFlowService.saveCompanyFlow(companyFlow).then(() => {
        this.info("关联成功");
        this.loadCompanyFlowPage(1, 10);
      });
    },

    removeFlow(flow) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          CompanyFlowService.removeFlow(flow.companyFlowId).then(() => {
            this.info("操作成功");
            this.loadCompanyFlowPage(1, 10);
          });
        })
        .catch(() => {
          return;
        });
    }
  },

  computed: {
    currentCompany() {
      let currentNode = this.$refs.companyTree.store.currentNode;
      return currentNode && currentNode.data ? currentNode.data.data : null;
    },
    flowDefinitions() {
      return this.flowPage.list;
    }
  },

  mounted() {
    this.loadCompanies();
  }
};
</script>

