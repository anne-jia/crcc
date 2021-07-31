<!--  index-->
<template>
<<<<<<< HEAD
  <el-row class="process-instance-list">
    <el-col :span="6">
      <crcc-card
        title="流程类型"
        v-loading="loadingTypes"
        className="process-types"
        :scroll="true"
      >
        <div
          :class="procTypes.list.length > 0 ? 'types-list' : 'empty types-list'"
        >
          <el-table
            ref="typeTable"
            :data="procTypes.list"
            stripe
            highlight-current-row
            :show-header="false"
            @row-click="selectType"
          >
            <el-table-column prop="typeName" align="left" show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="instNum"
              width="60px"
              header-align="center"
              align="left"
              class-name="tag-group"
            >
              <template slot-scope="{ row }">
                <el-tag v-showPopver="{ text: row.instNum }">{{
                  row.instNum ? row.instNum : 0
                }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </crcc-card>
    </el-col>
    <el-col :span="18">
      <crcc-card
        title="实例详细列表"
        v-loading="loadingProcessDetails || loadingTypes"
        className="process-details"
        :scroll="true"
      >
        <div>
          <el-table
            ref="instanceTable"
            :data="instances.list"
            border
            stripe
            highlight-current-row
          >
            <el-table-column
              prop="id"
              label="实例标识"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="procName"
              label="名称"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="startTime"
              label="发起时间"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="startUser"
              label="发起人"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              label="操作"
              width="100"
              header-align="center"
              align="center"
              class-name="table-btn-group"
            >
              <template slot-scope="{ row }">
                <el-button type="text" @click="showStatus(row)">查看</el-button>
                <el-button type="text" @click="deleteInst(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </crcc-card>
    </el-col>
    <processView ref="processView"></processView>
  </el-row>
=======
    <el-row class='process-instance-list'>
        <el-col :span="6">
            <crcc-card title="流程类型" v-loading="loadingTypes" className="process-types" :scroll='true'>
                <div :class="procTypes.list.length>0? 'types-list' : 'empty types-list'">
                    <el-table ref="typeTable" :data="procTypes.list" stripe highlight-current-row :show-header="false" @row-click="selectType">
                        <el-table-column prop="typeName" align="left" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="instNum" width="60px" header-align="center" align="left" class-name="tag-group" >
                            <template slot-scope="{row}">
                                <el-tag  v-showPopver='{text:row.instNum}'>{{row.instNum?row.instNum:0}}</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </crcc-card>
        </el-col>
        <el-col :span="18">
            <crcc-card title="实例详细列表" v-loading="loadingProcessDetails || loadingTypes" className="process-details" :scroll='true'>
                <div>
                    <el-table ref="instanceTable" :data="instances.list" border stripe highlight-current-row>
                        <el-table-column prop="id" label="实例标识" align="left" header-align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="procName" label="名称" align="left" header-align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="startCompanyName" label="发起公司" align="left" header-align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="startUser" label="发起人" align="left" header-align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="startTime" label="发起时间" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column label="操作" width="100"  align="center" class-name="table-btn-group">
                            <template slot-scope="{ row }">
                                <el-button type="text" @click="showStatus(row)">查看</el-button>
                                <el-button type="text" @click="deleteInst(row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </crcc-card>
        </el-col>
        <processView ref="processView" :id='currentDetailRow.id'></processView>
    </el-row>
>>>>>>> 12b148362cc7bfddd228cefba4549bc960391132
</template>

<script>
import crccCard from "@/components/crcc-main/crcc-card/index.vue";
import processView from "../process-deal/process-view.vue";
import processInstanceApi from "@/api/process-instance-api";

import showPopver from "@/directive/show-popver";

export default {
  components: {
    crccCard,
    processView,
  },
  directives: {
    showPopver,
  },
  data() {
    return {
      loadingTypes: false,
      loadingProcessDetails: false,
      procTypes: {
        list: [],
        pageSize: 20,
        pageNum: 0,
        total: 0,
      },
      instances: {
        list: [1, 2],
        pageSize: 20,
        pageNum: 0,
        total: 0,
      },
    };
  },
  computed: {
    //当前选中行的数据
    currentFlowType() {
      return this.$refs.typeTable.store.states.currentRow;
    },
<<<<<<< HEAD
  },
  methods: {
    // 流程类型获取当前行
    getProcTypes() {
      this.loadingTypes = true;
      processInstanceApi
        .getProcTypes()
        .then((res) => {
          if (res) {
            if (res.length > 0) {
              this.procTypes.list = res;
              this.selectType(res[0]);
            }
          }
        })
        .catch((err) => this.error(err.message[0]))
        .finally(() => (this.loadingTypes = false));
=======
    directives:{
        showPopver
    },
    data() {
        return {
            loadingTypes:false,
            loadingProcessDetails:false,
            procTypes: {
                list: [],
                pageSize: 20,
                pageNum: 0,
                total: 0
            },
            instances: {
                list: [],
                pageSize: 20,
                pageNum: 0,
                total: 0
            },
            currentDetailRow:{
                id:''
            },
        }
>>>>>>> 12b148362cc7bfddd228cefba4549bc960391132
    },
    //切换选中流程类型
    selectType(type) {
      this.$refs.typeTable.setCurrentRow(type);
      this.loadProcInsts();
    },
<<<<<<< HEAD
    //加载实例详情裂隙
    loadProcInsts() {
      this.loadingProcessDetails = true;
      processInstanceApi
        .getInstancesPage(this.currentFlowType.id)
        .then((res) => {
          if (res) {
            this.instances.list = res;
          }
        })
        .catch((err) => this.error(err.message[0]))
        .finally(() => (this.loadingProcessDetails = false));
=======
    methods: {
        // 流程类型获取当前行
        getProcTypes(){
            this.loadingTypes=true
            processInstanceApi.getProcTypes().then(res=>{
                if(res){
                    if(res.length>0){
                        this.procTypes.list =res;
                        this.selectType(res[0]);
                    }
                }

            }).catch(err=>this.error((err.message[0]))).finally(()=>this.loadingTypes=false)
        },
        //切换选中流程类型
        selectType(type) {
            this.$refs.typeTable.setCurrentRow(type);
            this.loadProcInsts();
        },
        //加载实例详情裂隙
        loadProcInsts(){
            this.loadingProcessDetails =true
           processInstanceApi.getInstancesPage(this.currentFlowType.id).then(res=>{
               if(res){
               this.instances.list = res;
               }
           }).catch(err=>this.error(err.message[0])).finally(()=>this.loadingProcessDetails=false)
        },
        //查看当前实例详情
        showStatus(row) {
            this.currentDetailRow =row;
            this.$refs.processView.dialogVisible=true;
        },
        //删除当前实例
        deleteInst(row) {
               this.$confirm("确定要删除当前实例吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "info"
                }).then(()=>{
                    processInstanceApi.deleteInst(row.id).then(res=>{
                        this.loadProcInsts()
                    }).catch(err=>this.error[err.message[0]])
                }).catch(()=>{return})
        }

>>>>>>> 12b148362cc7bfddd228cefba4549bc960391132
    },
    //查看当前实例详情
    showStatus(row) {
      this.$refs.processView.dialogVisible = true;
    },
    //删除当前实例
    deleteInst(row) {
      this.$confirm("确定要删除当前实例吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          processInstanceApi
            .deleteInst(row.id)
            .then((res) => {
              this.loadProcInsts();
            })
            .catch((err) => this.error[err.message[0]]);
        })
        .catch(() => {
          return;
        });
    },
  },
  mounted() {
    this.getProcTypes();
  },
};
</script>

<style lang="scss" scoped>
$borderColor: #dcdfe6;

.el-row {
  height: 100%;
  min-width: 850px;

  .el-col {
    height: 100%;
  }

  .el-col + .el-col {
    border-left: 1px solid $borderColor;
  }
  .el-table {
    .el-tag {
      width: 84%;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .empty.types-list {
    border: none;
  }
  .types-list {
    border: 1px solid $borderColor;
    border-bottom: none;

    ::v-deep .el-table {
      &::before {
        height: 0px;
      }

      .el-table__empty-block {
        border: none;
      }
    }
  }
}
</style>
