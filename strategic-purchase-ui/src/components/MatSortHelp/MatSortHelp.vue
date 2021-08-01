<template>
  <div title="物料帮助" modal :close-on-click-modal="false" custom-class="mathelp-list" width="560px">
    <div class="query-form clearfix">
      <el-form :inline="true" class="form-inline-left" @submit.native.prevent>
        <el-form-item label="模糊查询">
          <el-input v-model="filterText" style="width:236px" placeholder="分类编号、分类名称、别名" @keyup.enter.native="queryFilterData" />
        </el-form-item>
        <el-form-item class="mat-btn-group">
          <el-button type="text" style="background: rgba(229, 242, 255, 0.7);" :disabled="!currentOrgId" icon="el-icon-search" @click="queryFilterData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <mat-sort-tree v-if="showDialog" ref="matSortTree" :current-org-id="currentOrgId" style="height: 315px" @onTreeNodeClick="onTreeNodeClick" />

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelClick">取 消</el-button>
      <el-button type="primary" @click="confirmClick">确 定</el-button>
    </span>
  </div>
</template>

<script>
import MatSortTree from '@/components/MatSortTree/MatSortTree'

export default {
  name: 'MatSortHelp',
  components: {
    MatSortTree
  },
  props: {
    currentOrgId: String
  },
  data() {
    return {
      showDialog: false,
      currentOrgId: '',
      filterText: '',
      // 选中物料分类当前行
      currentSortData: {}
    }
  },

  methods: {
    showHelp(currentOrgId) {
      this.currentOrgId = currentOrgId
    },
    queryFilterData() {
      this.$refs.matSortTree.getMatSortPathByFilterText(
        this.filterText.trim()
      )
    },
    onTreeNodeClick(currentSortData) {
      this.currentSortData = currentSortData
    },
    /**
         * 保存选中物料分类数据
         */
    confirmClick() {
      this.filterText = ''
      this.showDialog = false
      this.$emit('saveMatSort', this.currentSortData)
    },
    cancelClick() {
      this.filterText = ''
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped  >
.mathelp-list {
    // min-width: 750px;
    // height: 480px;
    .categoryWithMaterial {
        width: 40%;
        height: 370px;
        float: left;
    }
    .categoryWithoutMaterial {
        width: 45%;
        height: 370px !important;
        float: left;
    }
   
    .el-main {
        height: 380px;
        padding: 0;
        padding-left: 8px;
    }
}
// el-card和eldiagol间距
::v-deep.el-dialog__wrapper .el-dialog__body {
    padding-top: 23px;
}
</style>
