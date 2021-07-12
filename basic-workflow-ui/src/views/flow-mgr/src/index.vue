<template>
  <div class="flow-manage">
    <div class="flow-list">
      <el-scrollbar
        style="height:100%;width:100%;"
        wrapStyle="height: calc(100% + 17px);"
        viewStyle="padding-right: 4px;padding-bottom: 5px;"
        :noresize="false"
      >
        <el-card shadow="never">
          <div slot="header">
            <svg-icon icon-class="search" />
            <span style="margin-left:.25em;">条件检索</span>
          </div>
          <el-row>
            <el-col :span="24">
              <span>模糊查询</span>
              <el-input
                placeholder="标识·名称"
                v-model="keyword"
                style="width: 190px;margin-left: 1em;"
              ></el-input>
              <el-button style="margin-left: 10px;" type="primary" @click="loadFlowPage(1, 10)">搜索</el-button>
              <el-button @click.native.prevent="keyword=''">重置</el-button>
            </el-col>
          </el-row>
        </el-card>
        <el-row style="padding: 8px 0;">
          <el-button type="primary" @click="addFlow" plain>定义流程</el-button>
        </el-row>
        <el-container>
          <el-aside style="padding: 0; width: 30%;">
            <el-card shadow="never" style="height:100%">
              <div slot="header">
                <span style="margin-left:.25em;">流程类型</span>
              </div>
              <el-table
                ref="typeTable"
                :data="typePage.list"
                border
                stripe
                highlight-current-row
                @row-click="onTypeClick"
              >
                <el-table-column prop="typeCode" label="编号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="typeName" label="名称" show-overflow-tooltip></el-table-column>
              </el-table>
              <el-pagination
                style="float: right;"
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[10, 20, 50, 100]"
                :current-page="typePage.pageNum"
                :page-size="typePage.pageSize"
                :total="typePage.total"
                @size-change="onTypePageSizeChange"
                @current-change="onTypePageNumChange"
              ></el-pagination>
            </el-card>
          </el-aside>
          <el-main style="padding: 0;padding-left: 8px;">
            <el-card shadow="never" style="height:100%">
              <div slot="header">
                <span style="margin-left:.25em;">流程定义</span>
              </div>
              <el-table ref="flowTable" :data="flowDefinitions" border stripe highlight-current-row>
                <el-table-column prop="procKey" label="标识" show-overflow-tooltip></el-table-column>
                <el-table-column prop="procName" label="名称" show-overflow-tooltip></el-table-column>
                <el-table-column width="80" header-align="center" align="center" label="状态">
                  <template slot-scope="{row}">
                    <el-switch
                      :width="36"
                      :value="row.state"
                      active-value="1"
                      inactive-value="0"
                      @change="setProcState(row)"
                    ></el-switch>
                  </template>
                </el-table-column>
                <el-table-column prop="lastModifier" width="130" label="最后修改人"></el-table-column>
                <el-table-column prop="lastModifyTime" width="150" label="最后修改时间"></el-table-column>
                <el-table-column
                  prop="currentVersion"
                  label="当前版本"
                  width="80"
                  header-align="center"
                  align="center"
                ></el-table-column>
                <el-table-column width="100" header-align="center" align="center" label="操作">
                  <template slot-scope="{ row }">
                    <el-button type="text" @click="editFlow(row)">编辑</el-button>
                    <el-button type="text" @click="copyFlow(row)">复制</el-button>
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
            </el-card>
          </el-main>
        </el-container>
      </el-scrollbar>
    </div>

    <bpmn-modeler ref="flowEditor" :class="flowEditorClass" @flow-edit-complete="onFlowEditFinish"></bpmn-modeler>

    <flow-add-card ref="flowAddCard" @flow-add="onFlowAdd" @flow-copy="onFlowCopy"></flow-add-card>
  </div>
</template>

<script>
import FlowService from "@/api/flow-mgr-service";
import FlowTypeService from "@/api/flow-type-service";
import FlowAddCard from "./components/flow-add-card";
import BpmnModeler from "@/views/bpmn-modeler";

export default {
  name: "FlowMgr",

  components: {
    FlowAddCard,
    BpmnModeler
  },

  data() {
    return {
      flowTypes: [],
      typePage: {
        pageNum: 1,
        pageSize: 0,
        total: 0
      },
      showEditor: false,
      keyword: "",
      flowPage: {
        pageNum: 1,
        pageSize: 0,
        total: 0
      }
    };
  },

  methods: {
    loadTypes(page, size) {
      FlowTypeService.loadTypes(page, size, {})
        .then(ret => {
          this.typePage = ret;

          if (ret.list && ret.list.length > 0) {
            this.$refs.typeTable.setCurrentRow(ret.list[0]);
            this.loadFlowPage(1, 10);
          }
        })
        .catch(err => {
          this.error(err.message[0]);
        });
    },

    onTypePageSizeChange(size) {
      this.loadTypes(1, size);
    },

    onTypePageNumChange(page) {
      this.loadTypes(page, this.flowPage.pageSize);
    },

    loadFlowPage(page, rows) {
      let condition = {};
      if (this.currentFlowType) {
        condition.typeId = this.currentFlowType.id;
      }
      this.keyword = this.keyword ? this.keyword.trim() : "";
      if (this.keyword) {
        condition.keyword = this.keyword;
      }
      FlowService.getFlowPage(page, rows, condition)
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

    onTypeClick() {
      this.loadFlowPage(1, 10);
    },

    addFlow() {
      if (!this.currentFlowType) {
        this.warn("请选择流程类型");
        return;
      }
      this.$refs.flowAddCard.add(this.typePage.list, this.currentFlowType.id);
    },

    onFlowAdd(flowInfo) {
      this.$refs.flowEditor.createDiagram(flowInfo, () => {
        this.showEditor = true;
      });
    },

    onFlowCopy(flowInfo) {
      this.$refs.flowEditor.copyDiagram(flowInfo, () => {
        this.showEditor = true;
      });
    },

    editFlow(row) {
      this.$refs.flowEditor.editDiagram(row, () => {
        this.showEditor = true;
      });
    },

    copyFlow(row) {
      this.$refs.flowAddCard.copy(this.typePage.list, row);
    },

    setProcState(row) {
      if (row.state == "1") {
        this.$confirm("确定要停用当前流程吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        })
          .then(() => {
            let flow = {
              id: row.id,
              procDefId: row.procDefId,
              state: "0"
            };
            FlowService.setFlowState(flow)
              .then(() => {
                row.state = "0";
              })
              .catch(err => {
                this.error(err.message[0]);
              });
          })
          .catch(() => {
            return;
          });
      } else {
        this.$confirm("确定要启用当前流程吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        })
          .then(() => {
            let flow = {
              id: row.id,
              procDefId: row.procDefId,
              state: "1"
            };
            FlowService.setFlowState(flow)
              .then(() => {
                row.state = "1";
              })
              .catch(err => {
                this.error(err.message[0]);
              });
          })
          .catch(() => {
            return;
          });
      }
    },

    onFlowEditFinish(typeId) {
      this.showEditor = false;
      let type = this.typePage.list.find(t => t.id == typeId);
      if (type) {
        this.$refs.typeTable.setCurrentRow(type);
      }
      if (this.currentFlowType) {
        this.loadFlowPage(1, 10);
      }
    }
  },

  computed: {
    flowEditorClass() {
      return {
        modelerHidden: !this.showEditor
      };
    },

    currentFlowType() {
      return this.$refs.typeTable.store.states.currentRow;
    },

    currentFlow() {
      return this.$refs.flowTable.store.states.currentRow;
    },

    flowDefinitions() {
      return this.flowPage.list;
    }
  },

  mounted() {
    this.loadTypes(1, 10);
  }
};
</script>

<style lang="scss">
.flow-manage {
  position: relative;
  height: calc(100vh - 120px);

  .flow-list {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  .modelerHidden {
    left: 100%;
  }
}
</style>
