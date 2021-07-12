<template>
  <div>
    <take-a-rest v-show="procTypes && procTypes.length == 0" @on-refresh="loadTypes"></take-a-rest>
    <el-container v-show="procTypes.length > 0">
      <el-aside style="padding: 0; width: 300px;">
        <el-card shadow="never" style="height:100%;">
          <div slot="header">
            <span>流程类型</span>
          </div>
          <el-table
            ref="typeTable"
            :data="procTypes"
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
                  <el-tag type="'primary" disable-transitions>{{row.instNum}}</el-tag>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-aside>
      <el-main style="padding: 0;padding-left: 8px;">
        <el-table ref="instanceTable" :data="instances" border stripe highlight-current-row>
          <el-table-column prop="id" label="实例标识" show-overflow-tooltip></el-table-column>
          <el-table-column prop="procName" label="名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="startTime" label="发起时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="startUser" label="发起人" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="100" header-align="center" align="center">
            <template slot-scope="{ row }">
              <el-button type="text" @click="showStatus(row)">查看</el-button>
              <el-button type="text" @click="deleteInst(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <flow-viewer ref="flv" flowJumpEnabled></flow-viewer>
  </div>
</template>

<script>
import InstMgrService from "@/api/inst-mgr-service";
import TakeARest from "@/views/task-list/src/components/task-a-rest";
import FlowViewer from "@/views/task-list/src/components/flow-viewer";

export default {
  name: "ProcInsts",

  components: {
    TakeARest,
    FlowViewer
  },

  data() {
    return {
      procTypes: false,
      instances: []
    };
  },

  methods: {
    loadTypes(sel) {
      !!this.procTypes && (this.procTypes = []);
      InstMgrService.getProcTypes()
        .then(tps => {
          this.procTypes = tps;
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
      this.loadProcInsts();
    },

    onTypeClick(type) {
      this.selectType(type);
    },

    loadProcInsts() {
      InstMgrService.loadProcInsts(this.currentFlowType.id)
        .then(ret => {
          this.instances = ret;
        })
        .catch(err => {
          this.error(err.message[0]);
        });
    },

    showStatus(inst) {
      this.$refs.flv.open(inst.id);
    },

    deleteInst(row) {
      this.$confirm("确定要删除当前实例吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          InstMgrService.deleteInst(row.id)
            .then(() => {
              this.loadTypes(this.currentFlowType.id);
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