<template>
  <el-dialog
    title="消息设置"
    :visible.sync="showDialog"
    width="800px"
    append-to-body
    :close-on-click-modal="false"
    top="8vh"
    v-draggable
    class="flw-message"
  >
    <el-tabs v-model="activeTab">
      <el-tab-pane name="basic" label="基本设置">
        <el-card class="box-card" shadow="never" style="margin-bottom:8px">
          <div slot="header">
            <span>通用设置</span>
          </div>
          <el-row style="padding:8px 0 8px 16px">
            <el-checkbox v-model="messageSetting.sendMessage" label="启动流程进度消息"></el-checkbox>
          </el-row>
          <el-row style="padding:8px 0 8px 16px" v-if="showCandidateUserOption">
            <el-checkbox
              :disabled="!messageSetting.sendMessage"
              v-model="messageSetting.recipients.candidateUsers"
              label="发送给当前节点的所有参与者"
            ></el-checkbox>
          </el-row>
        </el-card>
        <el-card class="box-card" shadow="never" style="margin-bottom:8px">
          <div slot="header">
            <span>抄送人</span>
          </div>
          <el-row :gutter="10">
            <el-col :span="16">
              <el-card shadow="never">
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-table :data="messageSetting.recipients.sysCompany" :height="170">
                      <el-table-column label="系统组织">
                        <template slot="header" slot-scope="{}">
                          系统组织
                          <el-button
                            type="text"
                            icon="el-icon-plus"
                            style="margin-left: 10px;"
                            @click="selectCompany"
                            :disabled="disabled"
                          ></el-button>
                          <el-button
                            type="text"
                            icon="el-icon-setting"
                            :disabled="disabled"
                            @click="selectCompanyVar"
                          ></el-button>
                        </template>
                        <template slot-scope="{ row, $index }">
                          <div style="display:flex; justify-content:space-between">
                            <div class="row-nowrap" :title="row.name">{{row.name}}</div>
                            <el-button
                              type="text"
                              icon="el-icon-delete"
                              @click="messageSetting.recipients.sysCompany.splice($index, 1)"
                            ></el-button>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-col>
                  <el-col :span="12">
                    <el-table :data="messageSetting.recipients.sysJob" :height="170">
                      <el-table-column label="岗位">
                        <template slot="header" slot-scope="{}">
                          岗位
                          <el-button
                            type="text"
                            icon="el-icon-plus"
                            style="margin-left: 10px;"
                            @click="selectJob"
                            :disabled="disabled"
                          ></el-button>
                          <el-button
                            type="text"
                            icon="el-icon-setting"
                            :disabled="disabled"
                            @click="selectJobVar"
                          ></el-button>
                        </template>
                        <template slot-scope="{ row, $index }">
                          <div style="display:flex; justify-content:space-between">
                            <div class="row-nowrap" :title="row.name">{{row.name}}</div>
                            <el-button
                              type="text"
                              icon="el-icon-delete"
                              @click="messageSetting.recipients.sysJob.splice($index, 1)"
                            ></el-button>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="never">
                <el-table :data="messageSetting.recipients.sysUser" :height="170">
                  <el-table-column label="人员">
                    <template slot="header" slot-scope="{}">
                      人员
                      <el-button
                        type="text"
                        icon="el-icon-plus"
                        style="margin-left: 10px;"
                        @click="selectUser"
                        :disabled="disabled"
                      ></el-button>
                      <el-button
                        type="text"
                        icon="el-icon-setting"
                        :disabled="disabled"
                        @click="selectUserVar"
                      ></el-button>
                    </template>
                    <template slot-scope="{ row, $index }">
                      <div style="display:flex; justify-content:space-between">
                        <div class="row-nowrap" :title="row.userName">{{row.userName}}</div>
                        <el-button
                          type="text"
                          icon="el-icon-delete"
                          @click="messageSetting.recipients.sysUser.splice($index, 1)"
                        ></el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-tab-pane>
      <el-tab-pane name="template" label="自定义模板">
        <el-card class="box-card" shadow="never">
          <div slot="header">
            <span>消息模板</span>
          </div>
          <el-col :offset="3" :span="18">
            <el-form ref="form" :model="messageSetting.template" label-width="80px">
              <el-form-item label="模版选项">
                <el-checkbox v-model="messageSetting.template.enabled" label="使用自定义消息模板"></el-checkbox>
              </el-form-item>
              <el-row
                style="padding:16px; padding-left:80px; color:red; line-height:1.5em; padding-top:0"
              >
                自定义消息模版中支持使用流程变量进行替换，形如：${your_variable}
                <br />
                例如：您提交的编号为${code}的报销单有新的进度了
                <br />使用流程变量时，务必保证在提交流程时，将相应变量提交给流程实例。
              </el-row>
              <el-form-item label="消息标题">
                <el-input
                  v-model="messageSetting.template.title"
                  :disabled="!messageSetting.template.enabled"
                ></el-input>
              </el-form-item>
              <el-form-item label="消息内容" style="margin-bottom:0">
                <el-input
                  type="textarea"
                  v-model="messageSetting.template.body"
                  rows="6"
                  :disabled="!messageSetting.template.enabled"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" style="text-align: center;">
      <el-button plain @click="showDialog = false">取消</el-button>
      <el-button style="margin-left: 1.5em;" plain type="primary" @click="confirm">确定</el-button>
    </div>
    <var-dialog ref="varHelp"></var-dialog>
    <company-help ref="companyHelp" @on-company-selected="onCompanySelected"></company-help>
    <job-help ref="jobHelp" @on-job-selected="onJobSelected"></job-help>
    <user-help ref="userHelp" @on-user-selected="onUserSelected"></user-help>
  </el-dialog>
</template>

<script>
import VarDialog from "@/views/participant/src/components/variable-select";
import CompanyHelp from "@/views/participant/src/components/company-help";
import JobHelp from "@/views/participant/src/components/job-help-dialog";
import UserHelp from "@/views/participant/src/components/user-help-dialog";

export default {
  name: "FlowMessage",

  components: {
    VarDialog,
    CompanyHelp,
    JobHelp,
    UserHelp
  },

  data() {
    return {
      showDialog: false,
      activeTab: "basic",
      moddleElement: null,
      showCandidateUserOption: true,
      messageSetting: {
        sendMessage: false,
        template: {
          enabled: false,
          title: "",
          body: ""
        },
        recipients: {
          candidateUsers: true,
          sysCompany: [],
          sysJob: [],
          sysUser: []
        }
      }
    };
  },

  methods: {
    showHelp(data) {
      this.moddleElement = data.element;
      this.showCandidateUserOption =
        !!this.moddleElement &&
        this.moddleElement.businessObject &&
        this.moddleElement.businessObject.$type == "bpmn:UserTask";
      if (data.setting && Object.getOwnPropertyNames(data.setting).length > 0) {
        this.messageSetting = data.setting;
      } else {
        this.messageSetting.sendMessage = false;
        this.messageSetting.template.enabled = false;
        this.messageSetting.template.title = "";
        this.messageSetting.template.body = "";
        this.messageSetting.recipients.candidateUsers = true;
        this.messageSetting.recipients.sysCompany = [];
        this.messageSetting.recipients.sysJob = [];
        this.messageSetting.recipients.sysUser = [];
      }
      this.activeTab = "basic";
      this.showDialog = true;
    },

    selectCompany() {
      this.$refs.companyHelp.showHelp(
        this.messageSetting.recipients.sysCompany.map(company => company.id)
      );
    },

    onCompanySelected(companies) {
      let variables = this.messageSetting.recipients.sysCompany.filter(
        s => s.isVariable
      );
      this.messageSetting.recipients.sysCompany = []
        .concat(variables)
        .concat(companies);
    },

    selectCompanyVar() {
      this.$refs.varHelp.open(variable => {
        if (
          !this.messageSetting.recipients.sysCompany.find(
            s => s.id == variable.exp
          )
        ) {
          this.messageSetting.recipients.sysCompany.push({
            id: variable.exp,
            name: variable.label,
            isVariable: true
          });
        }
      });
    },

    selectJob() {
      var oldSelection = this.messageSetting.recipients.sysJob.filter(
        job => !job.isVariable
      );
      this.$refs.jobHelp.showHelp(oldSelection);
    },

    onJobSelected(jobs) {
      let variables = this.messageSetting.recipients.sysJob.filter(
        s => s.isVariable
      );
      this.messageSetting.recipients.sysJob = [].concat(variables).concat(jobs);
    },

    selectJobVar() {
      this.$refs.varHelp.open(variable => {
        if (
          !this.messageSetting.recipients.sysJob.find(j => j.id == variable.exp)
        ) {
          this.messageSetting.recipients.sysJob.push({
            id: variable.exp,
            name: variable.label,
            isVariable: true
          });
        }
      });
    },

    selectUser() {
      var oldSelection = this.messageSetting.recipients.sysUser.filter(
        user => !user.isVariable
      );
      this.$refs.userHelp.showHelp(oldSelection);
    },

    onUserSelected(users) {
      let variables = this.messageSetting.recipients.sysUser.filter(
        user => user.isVariable
      );
      this.messageSetting.recipients.sysUser = []
        .concat(variables)
        .concat(users);
    },

    selectUserVar() {
      this.$refs.varHelp.open(variable => {
        if (
          !this.messageSetting.recipients.sysUser.find(
            u => u.userCode == variable.exp
          )
        ) {
          this.messageSetting.recipients.sysUser.push({
            userCode: variable.exp,
            userName: variable.label,
            isVariable: true
          });
        }
      });
    },

    confirm() {
      if (this.messageSetting.template.enabled) {
        if (!this.messageSetting.template.title) {
          this.warn("请填写消息标题");
          return;
        }
        if (!this.messageSetting.template.enabled) {
          this.warn("请填写消息内容");
          return;
        }
      }
      this.$emit("on-message-set-finished", {
        element: this.moddleElement,
        setting: this.messageSetting
      });
      this.showDialog = false;
    }
  }
};
</script>

<style lang="scss">
.flw-message {
  .el-dialog__body {
    padding: 16px;

    .el-tabs__content {
      height: 375px;
    }
  }
  .el-card {
    .el-card__header {
      background-color: #f3f3f3;
    }
  }

  .el-form-item {
    margin-bottom: 8px;
  }
}
</style>