<template>
  <div>
    <take-a-rest v-show="flowTypes && flowTypes.length == 0" @on-refresh="loadTypes"></take-a-rest>
    <el-container v-show="flowTypes.length > 0">
      <el-header height="auto" style="padding:0">
        <el-row style="padding: 0px 0px 8px 0;">
          <el-button type="primary" @click="loadTypes" plain>刷新</el-button>
        </el-row>
      </el-header>
      <el-container>
        <el-aside style="padding: 0; width: 300px;">
          <el-card shadow="never" style="height:100%;">
            <div slot="header">
              <span>流程类型</span>
            </div>
            <el-table
              ref="typeTable"
              :data="flowTypes"
              border
              stripe
              highlight-current-row
              :show-header="false"
              @row-click="onTypeClick"
            >
              <el-table-column prop="typeName">
                <template slot-scope="{ row }">
                  <div style="display:flex; justify-content: space-between;">
                    <div class="nowrap-ellipsis">{{ row.typeName }}</div>
                    <el-tag type="'primary" disable-transitions>{{row.taskNum}}</el-tag>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-aside>
        <el-main style="padding: 0;padding-left: 8px;">
          <el-table ref="flowTable" :data="taskList" border stripe highlight-current-row>
            <el-table-column
              v-for="col in extendCols"
              v-bind:key="col.field"
              :prop="col.field"
              :label="col.label"
              :width="col.width"
              :header-align="col.align"
              :align="col.align"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column prop="_procName_" label="所属流程" min-width="200" show-overflow-tooltip></el-table-column>
            <el-table-column prop="_name_" label="任务名称" min-width="200" show-overflow-tooltip></el-table-column>
            <el-table-column
              prop="_createTime_"
              label="创建时间"
              min-width="160"
              header-align="center"
              align="center"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="操作" width="100" header-align="center" align="center">
              <template slot-scope="{ row }">
                <el-button type="text" @click="showStatus(row)">进度</el-button>
                <el-button type="text" @click="handleTask(row)">处理</el-button>
              </template>
            </el-table-column>
          </el-table>
          <flow-viewer ref="fvr"></flow-viewer>
          <flow-process ref="flp" @task-completed="onTaskCompleted"></flow-process>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import TaskProcessService from "@/api/task-process-service";
import FlowViewer from "./components/flow-viewer";
import FlowProcess from "./components/flow-process";
import TakeARest from "./components/task-a-rest";

export default {
  name: "TaskList",

  components: {
    FlowViewer,
    FlowProcess,
    TakeARest
  },

  data() {
    return {
      flowTypes: false,
      taskList: [],
      extendCols: []
    };
  },

  methods: {
    loadTypes(sel) {
      !!this.flowTypes && (this.flowTypes = []);
      this.taskList = [];
      TaskProcessService.loadFlowTypes()
        .then(tps => {
          this.flowTypes = tps;
          if (tps && tps.length > 0) {
            let row = tps.find(t => t.id == sel);
            row ? this.selectType(row) : this.selectType(tps[0]);
          }
        })
        .catch(err => {
          this.error(err.message[0]);
        });
    },

    selectType(type) {
      this.$refs.typeTable.setCurrentRow(type);
      this.extendCols = type.columns
        .map(col => JSON.parse(col.taskColInfo))
        .sort((a, b) => {
          return parseInt(a.order) - parseInt(b.order);
        });
      this.loadTasks();
    },

    loadTasks() {
      TaskProcessService.loadTasks(this.currentFlowType.id)
        .then(ret => {
          this.taskList = ret;
        })
        .catch(err => {
          this.error(err.message[0]);
        });
    },

    onTypeClick(type) {
      this.selectType(type);
    },

    onTaskCompleted() {
      this.loadTypes(this.currentFlowType.id);
    },

    showStatus(task) {
      this.$refs.fvr.open(task._procInstId_);
    },

    handleTask(task) {
      this.$refs.flp.open(
        {
          id: task._id_,
          name: task._name_,
          createTime: task._createTime_,
          procInstId: task._procInstId_,
          procName: task._procName_,
          taskDefKey: task._taskDefKey_
        },
        this.currentFlowType
      );
    }
  },

  computed: {
    currentFlowType() {
      return this.$refs.typeTable.store.states.currentRow;
    }
  },

  mounted() {
    this.loadTypes();
  }
};
</script>

<style lang="scss">
.nowrap-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 237px;
}
</style>

