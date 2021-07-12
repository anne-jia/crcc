<template>
  <help-dialog
    helpTitle="选择岗位"
    :display.sync="showDialog"
    @help-search="query"
    @help-ok="addRoleJob"
  >
    <div slot="data" style="border:1px solid #ebeef5">
      <el-table
        style="width: 100%"
        ref="jobTable"
        height="250"
        :data="jobList"
        highlight-current-row
        row-key="id"
      >
        <el-table-column type="selection" width="35" reserve-selection></el-table-column>
        <el-table-column prop="code" label="编号"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
      </el-table>
      <el-row style="margin: 8px 0;">
        <el-col :span="24" style="text-align: right;">
          <el-pagination
            style="float: right;"
            layout="total, sizes, prev, pager, next"
            :page-sizes="[5, 20, 50, 100]"
            :current-page="jobPage.pageNum"
            :page-size="jobPage.pageSize"
            :total="jobPage.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </el-col>
      </el-row>
    </div>
  </help-dialog>
</template>

<script>
import ParticipantService from "@/api/participant-service";

export default {
  name: "JobHelpDialog",

  data() {
    return {
      showDialog: false,
      keyword: "",
      jobPage: {
        pageNum: 1,
        pageSize: 0,
        total: 0
      },
      oldSelection: []
    };
  },

  methods: {
    showHelp(selected) {
      this.oldSelection = [].concat(selected);
      this.jobPage = {
        pageNum: 1,
        pageSize: 0,
        total: 0
      };
      this.keyword = "";
      if (this.$refs.jobTable) {
        this.$refs.jobTable.clearSelection();
      }
      this.loadJobs(1, 5);
      this.showDialog = true;
    },

    loadJobs(page, rows) {
      let cond = {
        pageNum: page,
        pageSize: rows,
        orderBy: "create_time desc",
        json: JSON.stringify({
          keyword: this.keyword ? this.keyword.trim() : ""
        })
      };
      ParticipantService.loadJobHelpData(cond).then(page => {
        this.jobPage = page;

        if (this.oldSelection.length > 0) {
          page.list.forEach(job => {
            let index = this.oldSelection.findIndex(old => old.id == job.id);
            if (index >= 0) {
              this.$refs.jobTable.toggleRowSelection(job);
              this.oldSelection.splice(index, 1);
            }
          });
        }
      });
    },

    handleSizeChange(size) {
      this.loadJobs(1, size);
    },

    handleCurrentChange(page) {
      this.loadJobs(page, this.jobPage.pageSize);
    },

    query(kw) {
      this.keyword = kw;
      this.loadJobs(1, this.jobPage.pageSize);
    },

    addRoleJob() {
      let wholeSelection = []
        .concat(this.$refs.jobTable.selection)
        .concat(this.oldSelection);
      this.$emit(
        "on-job-selected",
        wholeSelection.map(job => {
          return {
            id: job.id,
            name: job.name
          };
        })
      );
      this.showDialog = false;
    }
  },

  computed: {
    jobList() {
      return this.jobPage.list;
    }
  }
};
</script>