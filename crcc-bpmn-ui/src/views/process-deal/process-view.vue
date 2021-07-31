<!--  view-process-->
<template>
<<<<<<< HEAD
  <el-dialog
    @open="opened"
    @close="close"
    append-to-body
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="960px"
  >
    <template slot="title">
      <span class="el-dialog__title" style="user-select: none; cursor: default"
        >流程进度</span
      >
      <button
        type="button"
        aria-label="FullScreen"
        class="el-dialog__headerbtn"
        style="right: 40px; color: #909399"
      >
        <span
          class="dialog-full-screen"
          v-if="fullScreen"
          @click="fullScreen = false"
        >
          <svg-icon icon-class="recover-screen" />
        </span>
        <span class="dialog-full-screen" v-else @click="fullScreen = true">
          <svg-icon icon-class="fullscreen" />
        </span>
      </button>
    </template>
    <processLayout>
      <template slot="aside">
        <el-tabs v-model="activeTab" type="card" style="height: 100%">
          <el-tab-pane
            label="自由流跳转"
            name="jump"
            v-if="showFlowJump"
            class="free-jump"
          >
            <div
              style="
                padding: 0px 8px 8px 8px;
                border-bottom: 1px solid #dcdfe6;
                font-weight: 300;
              "
            >
              勾选目标任务进行自由流跳转
            </div>
            <div class="table-box">
              <el-table
                ref="nodeTable"
                :data="flowNodes"
                :show-header="false"
                stripe
                highlight-current-row
              >
                <el-table-column type="selection"></el-table-column>
                <el-table-column
                  prop="name"
                  label="勾选任务进行自由流跳转"
                  show-overflow-tooltip
                ></el-table-column>
              </el-table>
            </div>

            <div style="padding: 8px 8px 0; text-align: right">
              <el-button type="primary" plain @click="jump">跳转</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="自由流指派" name="assign" v-if="showTaskAssign">
            <el-table
              ref="taskTable"
              :data="taskList"
              height="100%"
              stripe
              highlight-current-row
            >
              <el-table-column
                prop="taskName"
                label="运行中的任务"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="assignee"
                label="办理人"
                width="90"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                label="操作"
                header-align="center"
                align="center"
                width="50"
              >
                <template slot-scope="{}">
                  <el-button type="text" @click="assign">指派</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </template>
    </processLayout>
  </el-dialog>
=======
    <el-dialog @open="opened" @close="close"  :fullscreen="fullScreen" append-to-body v-el-drag-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" width="960px">
        <template slot="title">
            <span class="el-dialog__title" style="user-select: none; cursor: default">流程进度</span>
            <button type="button" aria-label="FullScreen" class="el-dialog__headerbtn" style="right: 40px; color: #909399">
                <span class="dialog-full-screen" v-if="fullScreen" @click="fullScreen = false">
                    <svg-icon icon-class="recover-screen" />
                </span>
                <span class="dialog-full-screen" v-else @click="fullScreen = true">
                    <svg-icon icon-class="fullscreen" />
                </span>
            </button>
        </template>
        <processLayout :showAside="showAside" :width="getAsideWidth">
            <template slot="main">
                <modeler-viewer v-model="instance.definition" :status="instance.status"></modeler-viewer>
            </template>

            <template slot="aside">
                <el-tabs v-model="activeTab" type="card" style="height: 100%">
                    <el-tab-pane label="自由流跳转" name="jump"  v-show="controlTask.freeFlowSet" class="free-jump">
                        <div style="
                          padding: 0px 8px 8px 8px;
                          border-bottom: 1px solid #dcdfe6;
                          font-weight: 300;
                          line-height: 36px;
                          padding: 0px 8px;
                        ">
                            请勾选目标任务进行自由流跳转
                        </div>
                        <div class="table-box">
                            <el-table ref="nodeTable" :data="flowNodes" @selection-change="selectionChangeJupm" :show-header="false" stripe highlight-current-row>
                                <el-table-column type="selection" :selectable="selectable"></el-table-column>
                                <el-table-column prop="name" label="勾选任务进行自由流跳转" show-overflow-tooltip></el-table-column>
                            </el-table>
                        </div>

                        <div style="padding: 8px 8px 0; text-align: right">
                            <el-button type="primary" plain @click="jump" v-show="showJumpBtn">跳转</el-button>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="自由流指派" name="assign" v-show="controlTask.freeFlowAssign">
                        <el-table ref="taskTable" :data="taskList" height="100%" stripe highlight-current-row>
                            <el-table-column prop="taskName" label="运行中的任务" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="assigneeName" label="办理人" width="90" show-overflow-tooltip></el-table-column>
                            <el-table-column label="操作" header-align="center" align="center" width="50" class-name="table-btn-group">
                                <template slot-scope="{}">
                                    <el-button type="text" @click="opneChonseUser">指派</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
                <operationUser ref="operationUser" title="选择人员" @addUsers="goAssign" :sigleChose="true" />
            </template>
        </processLayout>
    </el-dialog>
>>>>>>> 12b148362cc7bfddd228cefba4549bc960391132
</template>

<script>
import processLayout from "./components/process-layout.vue";
<<<<<<< HEAD

export default {
  props: {},
  components: {
    processLayout,
  },
  data() {
    return {
      dialogVisible: false,
      fullScreen: false,
      showFlowJump: true,
      showTaskAssign: true,
    };
  },
  computed: {},
  methods: {
    opened() {},
    close() {
      this.dialogVisible = false;
    },
    jump() {},
  },
  mounted() {},
};
</script>

<style lang='scss' scoped>
::v-deep .el-dialog__body {
  padding: 8px;
  height: 480px;
  .el-tabs {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .el-tabs__content {
    flex: 1;
  }
  .free-jump {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 8px;
    .table-box {
      flex: 1;
      padding: 8px 0px;
    }
  }
  .el-table::before {
    height: 0px;
  }
  .el-table__empty-block {
    border-right: none;
  }
=======
// import modelerViewer from "@/components/crcc-bpmn/modeler-readonly/readonly-modeler.vue";

import camundaApi from "@/api/camunda-api";
import processInstanceApi from "@/api/process-instance-api";

import operationUser from "@/views/process-bpmn/components/take-part-components/operation-users.vue";

export default {
    props: {
        id: String,
        showAside:{
            type:Boolean,
            default:true
        },
    },
    components: {
        processLayout,
        // modelerViewer,
        operationUser
    },
    data() {
        return {
            dialogVisible: false,
            fullScreen: false,
            controlTask: {
                //自由指派
                freeFlowAssign: false,
                //自由跳转
                freeFlowSet: false
            },
           showJumpBtn:false,
            //自由跳转
            flowNodes: [],
            activeTab: "jump",
            //自由指派中，运行中的任务
            taskList: [],
            //流程内容
            instance: {
                definition: "",
                status: []
            }
        };
    },
    computed: {
     
        getAsideWidth(){
          return  this.fullScreen? '380px':"260px"
        },
        getInstanceStatus(){
           return  this.instance.status.filter(item=>item.state=="running")
        //    return  this.instance.status.filter(item=>item.state=="fin")

        }
    },
    methods: {
        opened() {
            this.$nextTick(async () => {
                this.loadInstanceInfo(this.id);
                this.getAuths();
            });
        },
        selectionChangeJupm(selection){
            if(selection.length>0){
                this.showJumpBtn =true
            }else{
                this.showJumpBtn =false

            }
        },
        //控制是否可选则
        selectable(row, index) {
            let newTask = row.id.replace('#multiInstanceBody','');
           if(this.getInstanceStatus.length>0){
            let find=   this.getInstanceStatus.findIndex(item=>item.task==newTask);
            
            if(find==-1){
                return true
            }else{
                return false
            }

           }else{
               return true
           }
        },
            
        //打开人员的弹框
        opneChonseUser() {
            this.$refs.operationUser.dialogVisible = true;
        },
        //自由指派 指派给指定的人
        goAssign(value) {
            let selectedTask = this.$refs.taskTable.store.states.currentRow;
            processInstanceApi
                .assign({
                    taskId: selectedTask.taskId,
                    assignee: value[0].id
                })
                .then(() => {
                    this.info("执行完毕");
                    this.loadInstanceInfo(this.id);
                    this.running(this.id);
                })
                .catch(err => this.error(err.message[0]));
        },
        //自由跳转的项
        jump() {
            let selected = this.$refs.nodeTable.selection;
            if (!selected || selected.length == 0) {
                this.warn("请选择要跳转的任务");
                return;
            }
            let jumpInfo = {
                instId: this.id,
                taskIds: selected.map(s => s.id).join(",")
            };
            processInstanceApi
                .jump(jumpInfo)
                .then(() => {
                    this.info("执行成功");
                    this.loadInstanceInfo(this.id);
                    this.$refs.nodeTable.clearSelection();
                    this.getFreeNodes(this.id);
                })
                .catch(err => this.error(err.message[0]));
        },

        //获取流程图
        loadInstanceInfo(id) {
            camundaApi
                .loadInstanceInfo(id)
                .then(res => {
                    if (res && JSON.stringify(res) != "{}") {
                        this.instance = res;
                    }
                })
                .catch(err => this.error(err.message[0]));
        },
        //获取自由跳转
        getFreeNodes(id) {
            processInstanceApi
                .getFreeNodes(id)
                .then(res => {
                    if (res) {
                        this.flowNodes = res;
                    }
                })
                .catch(err => this.error(err.message[0]));
        },
        //自由流指派中当前运行中的任务
        running(id) {
            processInstanceApi
                .running(id)
                .then(res => {
                    if (res) {
                        this.taskList = res;
                    }
                })
                .catch(err => this.error(err.message[0]));
        },
        //当前用户是否拥有自由跳转
        getAuths() {
            processInstanceApi
                .getAuths()
                .then(res => {
                    if (res) {
                        this.controlTask = res;
                        //根据返回值觉得是否请求自由跳转&&自由指派的接口；
                        if (res.freeFlowAssign) {
                            //自由指派
                            this.running(this.id);
                        }
                        if (res.freeFlowSet) {
                            //自由跳转
                            this.getFreeNodes(this.id);
                        }
                    }
                })
                .catch(err => this.error(err.message[0]));
        },
        close() {
            this.dialogVisible = false;
            this.$emit('close');
        }
    },
 
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header{
    .dialog-full-screen{
            margin-right: 12px;
    }
}
::v-deep .el-dialog__body {
    padding: 8px;
    height: 480px;

    .el-tabs {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .el-tabs__header {
        margin: 0px;
    }

    .el-tabs__content {
        flex: 1;
    }
    .el-tab-pane{
        height: 100%;
    }
    .free-jump {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding-bottom: 8px;

        .table-box {
            flex: 1;
            padding: 0px 0px 8px;
        }
    }

    .el-table::before {
        height: 0px;
    }

    .el-table__empty-block {
        border-right: none;
    }
}
::v-deep .el-dialog.is-fullscreen{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    left: 0px !important;
    top: 0px  !important;
     .el-dialog__body{
         flex: 1;
    }
>>>>>>> 12b148362cc7bfddd228cefba4549bc960391132
}
</style>
