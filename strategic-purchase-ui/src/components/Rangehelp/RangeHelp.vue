<template>
  <el-dialog
    custom-class="help-supplier-list"
    @open="open"
    @close="close"
    append-to-body
    title="组织信息"
    v-el-drag-dialog
    :visible="showRangeHelpDialog"
    :close-on-click-modal="false"
    width="640px"
  >
    <div class="treeBox scrollBar">
      <el-tree
        ref="treefindrange"
        lazy
        :load="loadNode"
        :props="props"
        :highlight-current="true"
        node-key="id"
        :expand-on-click-node="false"
        :data="treeData"
        :default-expanded-keys="expendedKeys"
        :default-checked-keys="defaultCheckedKeys"
        @check-change="checkChangeNode"
        show-checkbox
        :check-strictly="true"
        @check="selectCheck"
      />
    </div>
    <template slot="footer">
      <el-button @click="cancelClick">取 消</el-button>
      <el-button type="primary" @click="confirmClick">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import Prodictlog from "@/api/Purchase";
export default {
  components: {},
  props: {
    checkedNodes: {
      type: Array,
      default: function() {
        return [];
      }
    },
    rootNode: {
      type: Object,
      default: function() {
        return {
          id: "",
          name: "",
          isLeaf: "",
          pathName: ""
        };
      }
    },
    title: {
      type: String,
      default: "应用范围"
    }
  },
  data() {
    return {
      treeData: [], // tree数据
      expendedKeys: [],
      showRangeHelpDialog: false, // 弹框打开关闭
      checkedNodesList: [],
      defaultExpandedKeys: [],
      props: {
        id: "id",
        label: "name",
        children: "children",
        isLeaf: "isLeaf"
      }
    };
  },
  methods: {
    open() {},
    close() {},
    //选中状态改变了，看是否是初始状态的值
    checkChangeNode(data, state, childState) {
      let index = this.checkedNodesList.findIndex(item => item.id == data.id);
      if (!state) {
        if (index != -1) {
          this.checkedNodesList.splice(index, 1);
        }
      } else {
        if (index == -1) {
          this.checkedNodesList.push(data);
        }
      }
    },

    loadNode(node, resolve) {
      if (node.level === 0) {
        this.expendedKeys.push(this.rootNode.id);
        this.treeData = [
          {
            ...this.rootNode,
            ...{
              children: []
            }
          }
        ];
      } else {
        Prodictlog.child({
          authOrgId: node.data.id,
          authOrgPathName: node.data.pathName,
          isLeaf: node.data.isLeaf,
          deepType: 2
        })
          .then(data => {
            console.log(data);
            return resolve(data);
          })
          .catch(err => {
            this.error(err.message[0]);
          });
      }
    },
    // 选择行获取数据
    selectCheck(data, checked, indeterminate) {
      const newSelectedRangeDatas = [];
      checked.checkedNodes.map(item => {
        const obj = {};
        obj.manageOrgName = item.pathName;
        obj.manageOrgId = item.id;
        newSelectedRangeDatas.push(obj);
      });
      this.selectedRangeDatas = newSelectedRangeDatas;
    },
    // 取消
    cancelClick() {
      this.showRangeHelpDialog = false;
    },
    // 确认
    confirmClick() {
      this.$emit("getRowRangeData", this.selectedRangeDatas);
      this.cancelClick();
    }
  },
  computed: {
    //获取默认选中的key
    defaultCheckedKeys() {
      let newArr = [];
      this.checkedNodesList.map(item => {
        newArr.push(item.id);
      });
      return newArr;
    },
    //获取默认选中列表
    getcheckedNodesList() {
      this.checkedNodes.map(item => {
        this.checkedNodesList.push({
          id: item.userId,
          name: item.userName
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep.el-dialog__wrapper > .el-dialog {
  // height: 500px;
  margin-top: 10vh !important;

  .el-dialog__body {
    padding: 0px 0px 8px;
    .treeBox {
      overflow: scroll;
      height: 300px;
    }
  }
}

.rangeBox {
  .treeBox {
    height: 30vh;
    overflow-y: auto;
  }
}

// 弹框底部按钮样式
</style>
