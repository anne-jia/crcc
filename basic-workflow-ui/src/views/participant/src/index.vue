<template>
  <el-dialog
    title="设置参与者"
    :visible.sync="showDialog"
    width="1000px"
    append-to-body
    :close-on-click-modal="false"
    top="8vh"
    class="pt-setting"
    v-draggable
  >
    <el-container style="height:500px">
      <el-header style="height:auto;padding: 0 0 8px 0;">
        <el-button type="primary" plain @click="addExp">添加</el-button>
      </el-header>
      <el-container>
        <el-aside style="border:1px solid #ebeef5;" width="250px">
          <el-table
            ref="expTable"
            :show-header="false"
            :data="expressionList"
            highlight-current-row
            @row-click="selectCurrent"
          >
            <el-table-column type="index" width="30"></el-table-column>
            <el-table-column prop="expressionDesc">
              <template slot-scope="{row, $index}">
                <div style="display:flex; justify-content:space-between">
                  <span>{{row.expressionDesc}}</span>
                  <div>
                    <el-button type="text" icon="el-icon-edit" @click="editExp"></el-button>
                    <el-button type="text" icon="el-icon-delete" @click="removeItem($index)"></el-button>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-aside>
        <el-main style="padding: 0 8px; overflow:hidden;">
          <el-card shadow="never" style="margin-bottom:8px;">
            <el-form label-width="80px">
              <el-form-item label="生效条件">
                <el-col :span="21">
                  <el-input
                    v-model="currentExpression.validateCondition"
                    placeholder="可填写此设置的生效条件"
                    :disabled="disabled"
                  ></el-input>
                </el-col>
                <el-col :span="2" style="text-align: center">
                  <el-button
                    type="text"
                    icon="el-icon-setting"
                    @click="selectConditionVar"
                    :disabled="disabled"
                  ></el-button>
                </el-col>
              </el-form-item>
            </el-form>
          </el-card>
          <el-row :gutter="10">
            <el-col :span="16">
              <el-card shadow="never">
                <div slot="header" class="clearfix">
                  <span>范围</span>
                </div>
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-table :data="currentExpression.sysCompany" :height="290">
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
                              @click="currentExpression.sysCompany.splice($index, 1)"
                            ></el-button>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-col>
                  <el-col :span="12">
                    <el-table :data="currentExpression.sysJob" :height="290">
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
                              @click="currentExpression.sysJob.splice($index, 1)"
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
                <div slot="header" class="clearfix">
                  <span>人员</span>
                </div>
                <el-table :data="currentExpression.sysUser" :height="290">
                  <el-table-column label="人员">
                    <template slot="header" slot-scope="{}">
                      <el-button
                        type="text"
                        icon="el-icon-plus"
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
                          @click="currentExpression.sysUser.splice($index, 1)"
                        ></el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
      <el-footer>
        <el-row style="padding-top:8px;text-align: center;">
          <el-button plain @click="showDialog=false">取消</el-button>
          <el-button type="primary" plain @click="confirm">确认</el-button>
        </el-row>
      </el-footer>
    </el-container>
    <var-dialog ref="varHelp"></var-dialog>
    <company-help ref="companyHelp" @on-company-selected="onCompanySelected"></company-help>
    <job-help ref="jobHelp" @on-job-selected="onJobSelected"></job-help>
    <user-help ref="userHelp" @on-user-selected="onUserSelected"></user-help>
    <expression-add
      ref="expAdd"
      @expression-add="onExpressionAdd"
      @expression-edit="onExpressionEdit"
    ></expression-add>
  </el-dialog>
</template>

<script>
import VarDialog from "./components/variable-select";
import CompanyHelp from "./components/company-help";
import JobHelp from "./components/job-help-dialog";
import UserHelp from "./components/user-help-dialog";
import ExpressionAdd from "./components/expression-add-card";
import { setTimeout } from "timers";

export default {
  name: "ParticipantSet",

  components: {
    VarDialog,
    CompanyHelp,
    JobHelp,
    UserHelp,
    ExpressionAdd
  },

  data() {
    return {
      showDialog: false,
      initialExpression: {
        expressionDesc: "",
        validateCondition: "",
        sysCompany: [],
        sysJob: [],
        sysUser: []
      },
      expressionList: [],
      currentExpression: {},
      modelerElement: null
    };
  },

  methods: {
    newExpression() {
      return Object.assign({}, this.initialExpression, {
        sysCompany: [],
        sysJob: [],
        sysUser: []
      });
    },

    showHelp(moddle) {
      this.showDialog = true;
      this.modelerElement = moddle.element;
      this.expressionList = moddle.participants;
      if (this.expressionList && this.expressionList.length > 0) {
        setTimeout(() => {
          this.selectCurrent(this.expressionList[0]);
        });
      } else {
        this.currentExpression = this.newExpression();
      }
    },

    addExp() {
      this.$refs.expAdd.addOrEdit(this.expressionList);
    },

    editExp() {
      this.$refs.expAdd.addOrEdit(
        this.expressionList.filter(e => e !== this.currentExpression),
        this.currentExpression
      );
    },

    onExpressionAdd(expressionDesc) {
      if (expressionDesc && expressionDesc.trim()) {
        let newItem = this.newExpression();
        newItem.expressionDesc = expressionDesc;
        this.expressionList.push(newItem);
        this.selectCurrent(newItem);
      }
    },

    onExpressionEdit(expressionDesc) {
      this.currentExpression.expressionDesc = expressionDesc.trim();
    },

    removeItem(index) {
      this.expressionList.splice(index, 1);
      setTimeout(() => {
        if (this.expressionList.length > 0) {
          this.selectCurrent(this.expressionList[0]);
        } else {
          this.currentExpression = this.newExpression();
        }
      });
    },

    selectCurrent(row) {
      this.currentExpression = row;
      this.$refs.expTable.setCurrentRow(row);
    },

    selectConditionVar() {
      this.$refs.varHelp.open(variable => {
        this.currentExpression.validateCondition += " " + variable.exp;
      });
    },

    selectCompany() {
      this.$refs.companyHelp.showHelp(
        this.currentExpression.sysCompany.map(company => company.id)
      );
    },

    onCompanySelected(companies) {
      let variables = this.currentExpression.sysCompany.filter(
        s => s.isVariable
      );
      this.currentExpression.sysCompany = []
        .concat(variables)
        .concat(companies);
    },

    selectCompanyVar() {
      this.$refs.varHelp.open(variable => {
        if (
          !this.currentExpression.sysCompany.find(s => s.id == variable.exp)
        ) {
          this.currentExpression.sysCompany.push({
            id: variable.exp,
            name: variable.label,
            isVariable: true
          });
        }
      });
    },

    selectJob() {
      var oldSelection = this.currentExpression.sysJob.filter(
        job => !job.isVariable
      );
      this.$refs.jobHelp.showHelp(oldSelection);
    },

    onJobSelected(jobs) {
      let variables = this.currentExpression.sysJob.filter(s => s.isVariable);
      this.currentExpression.sysJob = [].concat(variables).concat(jobs);
    },

    selectJobVar() {
      this.$refs.varHelp.open(variable => {
        if (!this.currentExpression.sysJob.find(j => j.id == variable.exp)) {
          this.currentExpression.sysJob.push({
            id: variable.exp,
            name: variable.label,
            isVariable: true
          });
        }
      });
    },

    selectUser() {
      var oldSelection = this.currentExpression.sysUser.filter(
        user => !user.isVariable
      );
      this.$refs.userHelp.showHelp(oldSelection);
    },

    onUserSelected(users) {
      let variables = this.currentExpression.sysUser.filter(
        user => user.isVariable
      );
      this.currentExpression.sysUser = [].concat(variables).concat(users);
    },

    selectUserVar() {
      this.$refs.varHelp.open(variable => {
        if (
          !this.currentExpression.sysUser.find(u => u.userCode == variable.exp)
        ) {
          this.currentExpression.sysUser.push({
            userCode: variable.exp,
            userName: variable.label,
            isVariable: true
          });
        }
      });
    },

    confirm() {
      let firstUnValid = this.expressionList.find(
        exp =>
          exp.sysCompany.length == 0 &&
          exp.sysJob.length == 0 &&
          exp.sysUser.length == 0
      );
      if (!this.expressionList || firstUnValid) {
        this.error(`'${firstUnValid.expressionDesc}'设置无效，请修改`);
        return;
      }

      this.$emit("on-participant-set-finished", {
        element: this.modelerElement,
        participants: this.expressionList
      });

      this.showDialog = false;
    }
  },

  computed: {
    disabled() {
      return !this.currentExpression || !this.currentExpression.expressionDesc;
    }
  }
};
</script>

<style lang="scss">
.pt-setting {
  .el-form-item {
    margin-bottom: 0;
  }

  .el-input-group__append {
    text-align: center;
  }

  .row-nowrap {
    width: 190px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>

