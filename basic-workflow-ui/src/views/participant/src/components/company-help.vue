<template>
  <help-dialog
    class="company-help"
    helpTitle="选择系统组织"
    :display.sync="dialogVisible"
    @help-search="queryByCond"
    @help-ok="confirmHelp"
  >
    <div slot="data" style="border:1px solid #ebeef5">
      <el-tree
        style="height: 300px; overflow-y: auto;"
        ref="companyTree"
        node-key="id"
        show-checkbox
        check-strictly
        :data="treeData"
        :filter-node-method="filterMethod"
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
    </div>
  </help-dialog>
</template>

<script>
import ParticipantService from "@/api/participant-service";

export default {
  name: "CompanyHelp",

  data() {
    return {
      dialogVisible: false,
      treeData: []
    };
  },
  methods: {
    showHelp(existed) {
      this.queryKeyword = "";
      this.treeData = [];
      ParticipantService.loadCompanyTree("1").then(data => {
        this.treeData = data;
        this.$refs.companyTree.setCheckedKeys(existed);
      });
      this.dialogVisible = true;
    },

    confirmHelp() {
      let nodes = this.$refs.companyTree.getCheckedNodes();
      this.$emit(
        "on-company-selected",
        nodes.map(n => {
          return {
            id: n.data.id,
            name: n.data.companyName
          };
        })
      );
      this.dialogVisible = false;
    },

    queryByCond(keyword) {
      this.$refs.companyTree.filter(keyword);
    },

    filterMethod(value, data) {
      return data.label.toUpperCase().indexOf(value) >= 0;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.company-help {
  .company-label {
    margin-left: 4px;
    width: calc(100% - 20px);
    display: inline-block;
    vertical-align: top;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
