<template>
  <help-dialog
    :display.sync="showDialog"
    helpTitle="选择用户"
    place-holder="用户编号/名称"
    width="700px"
    @help-search="query"
    @help-ok="addJobUser"
  >
    <el-container style="border:1px solid #ebeef5" slot="data">
      <el-aside style="width: 250px; border-right:1px solid #ebeef5">
        <el-tree
          ref="companyTree"
          :data="companyData"
          :expand-on-click-node="false"
          :default-expanded-keys="['all']"
          node-key="id"
          highlight-current
          @node-click="onCompanyClick"
        >
          <span slot-scope="{ node, data }">
            <svg-icon v-if="data.data && data.data.isDetail == 1" icon-class="file" />
            <svg-icon v-else-if="node.expanded" icon-class="folder-open" />
            <svg-icon v-else icon-class="folder" />
            <span
              :style="{ 'color': data.data.isAuth ? '#606266' : '#C0C4CC', 'margin-left':'4px' }"
            >{{ node.label }}</span>
          </span>
        </el-tree>
      </el-aside>
      <el-main>
        <el-table
          ref="userTable"
          style="width: 100%"
          height="300"
          :data="userPage.list"
          row-key="userId"
          fit
          border
          stripe
          highlight-current-row
        >
          <el-table-column type="selection" width="45" reserve-selection v-if="multiSelect"></el-table-column>
          <el-table-column prop="userCode" label="用户编号" min-width="120"></el-table-column>
          <el-table-column prop="userName" label="用户名称" min-width="150"></el-table-column>
        </el-table>
        <el-row style="text-align: right; margin: 8px 0;">
          <el-pagination
            style="float: right;"
            layout="total, sizes, prev, pager, next"
            :page-sizes="[10, 20, 50, 100]"
            :current-page="userPage.pageNum"
            :page-size="userPage.pageSize"
            :total="userPage.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </el-row>
      </el-main>
    </el-container>
  </help-dialog>
</template>

<script>
import ParticipantService from "@/api/participant-service";

export default {
  name: "UserHelp",

  props: {
    multiSelect: {
      type: Boolean,
      default: true
    },
    dataAuth: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      showDialog: false,
      keyword: "",
      companyData: [],
      currentCompany: null,
      userPage: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        list: []
      },
      oldSelection: []
    };
  },

  methods: {
    showHelp(selected) {
      this.oldSelection = [].concat(selected);
      this.currentCompany = null;
      this.userPage = {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        list: []
      };
      this.keyword = "";
      this.companyData = [];
      if (this.$refs.userTable) {
        this.$refs.userTable.clearSelection();
      }
      this.loadCompanies();
      this.showDialog = true;
    },

    loadCompanies() {
      ParticipantService.loadCompanyTree(this.dataAuth ? "1" : "0").then(
        data => {
          this.companyData = [
            {
              label: "全部",
              id: "all",
              data: {
                id: "all",
                isAuth: true
              },
              children: data
            }
          ];
          this.currentCompany = this.companyData[0];
          this.loadUsers(1, 10);
        }
      );
    },

    onCompanyClick(data) {
      if (this.currentCompany !== data) {
        this.currentCompany = data;
        this.loadUsers(1, 10);
      }
    },

    query(keyword) {
      this.keyword = keyword;
      this.loadUsers(1, this.userPage.pageSize);
    },

    loadUsers(page, size) {
      let companyIds = [];
      this.getCompanyIds(this.currentCompany, companyIds);
      let keyword = this.keyword ? this.keyword : "";
      let cond = {
        pageNum: page,
        pageSize: size,
        orderBy: "create_time desc",
        json: JSON.stringify({
          userState: 1,
          searchParam: keyword,
          companyIds: companyIds.join(",")
        })
      };

      ParticipantService.getUserList(cond).then(page => {
        this.userPage = page;

        if (this.oldSelection.length > 0) {
          page.list.forEach(user => {
            let index = this.oldSelection.findIndex(
              old => old.userCode == user.userCode
            );
            if (index >= 0) {
              this.$refs.userTable.toggleRowSelection(user);
              this.oldSelection.splice(index, 1);
            }
          });
        }
      });
    },

    getCompanyIds(treeNode, tempArr) {
      if (
        treeNode &&
        treeNode.data &&
        treeNode.data.isAuth &&
        treeNode.id != "all"
      ) {
        tempArr.push(treeNode.data.id);
      }
      if (treeNode.children && treeNode.children.length > 0) {
        treeNode.children.forEach(child => this.getCompanyIds(child, tempArr));
      }
    },

    handleSizeChange(size) {
      this.loadUsers(1, size);
    },

    handleCurrentChange(page) {
      this.loadUsers(page, this.userPage.pageSize);
    },

    addJobUser() {
      if (this.multiSelect) {
        let wholeSelection = []
          .concat(this.$refs.userTable.selection)
          .concat(this.oldSelection);
        this.$emit(
          "on-user-selected",
          wholeSelection.map(user => {
            return {
              userCode: user.userCode,
              userName: user.userName
            };
          })
        );
      } else {
        this.$emit(
          "on-user-selected",
          this.$refs.userTable.store.states.currentRow
        );
      }

      this.showDialog = false;
    }
  }
};
</script>