<!--  operation-users-->
<template>
  <el-dialog
    @open="opened"
    @close="close"
    top="20vh"
    append-to-body
    :title="title"
    custom-class="operation-users"
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="680px"
  >
    <crcc-main class="user-box" :showOpcation="false">
      <template slot="crcc-serach">
        <el-form
          ref="form"
          :model="searchForm"
          @submit.native.prevent
          label-position="right"
        >
          <el-form-item label="模糊查询" label-width="70px">
            <el-input
              v-model="searchForm.keyword"
              placeholder="人员名称"
              clearable
              @clear="clearSearch"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch()">搜索</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template slot="crcc-main">
        <div>
          <el-tree
            ref="userTree"
            :default-checked-keys="defaultCheckedKeys"
              @check="getCheckChange"
            @check-change="checkChangeNode"
            :check-strictly="true"
            :expand-on-click-node="false"
            highlight-current
            :load="loadNode"
            :data="usersTreeData"
            :key="searchTime"
            :lazy="lazy"
            show-checkbox
            :default-expand-all='defaultExpandAll'
            node-key="id"
            :default-expanded-keys="defaultExpandedKeys"
            :props="defaultProps"
          >
          </el-tree>
        </div>
      </template>
    </crcc-main>
    <span slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import processSetting from "@/api/process-setting";

export default {
  props: {
    checkedNodes: {
      type: Array,
      default: function() {
        return [];
      }
    },
    sigleChose: {
        type:Boolean,
        default:false
    },
    title: {
      type: String,
      default: "添加人员"
    }
  },
  components: {},
  data() {
    return {
      dialogVisible: false,
      lazy: true,
      defaultExpandAll:false,
      searchTime: 0,
      searchForm: {
        keyword: ""
      },
      usersTreeData: [],
      checkedNodesList: [],
      defaultExpandedKeys: [],
      defaultProps: {
        children: "children",
        label: "name",
        id: "id",
        isLeaf: "isDetail"
      }
    };
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
    getcheckedNodesList(){
     this.checkedNodes.map(item => {
        this.checkedNodesList.push({
            id:item.userId,
            name:item.userName,
          });
      });
    }
  },
  methods: {
    opened() {
      this.searchTime++;
      if (this.searchTime > 9999) {
        this.searchTime = 0;
      }
      this.getcheckedNodesList;

    },
    submit() {
        
      if(this.checkedNodesList.length>0){
        let data = [...this.checkedNodesList];
          this.$emit("addUsers", data);
          this.close();
      }else{
        this.warn('请选择人员')
      }
    },
    getCheckChange(data, checkedInfo) {
        if(this.sigleChose){
            if(checkedInfo.checkedNodes.length==2){
               this.$refs.userTree.setCheckedNodes([data]);
            }
        }else{
            let checked = checkedInfo.checkedNodes;
            this.$emit("checkChange", data, checked);
        }
        this.checkedNodesList = this.$refs.userTree.getCheckedNodes();
    },
      //选中状态改变了，看是否是初始状态的值
    checkChangeNode(data,state,childState){
      if(this.sigleChose){
        if(!state){
         this.$refs.userTree.setCheckedNodes([]);
           this.checkedNodesList=[]
        }else{
          this.$refs.userTree.setCheckedNodes([data]);
          this.checkedNodesList.push(data)
        }
      }
      else{
         let index =  this.checkedNodesList.findIndex(item=>item.id==data.id);
          if(!state){
            if(index!=-1){
                this.checkedNodesList.splice(index,1) 
            }
          }else{
            if(index==-1){
                this.checkedNodesList.push(data) 
            }
          }
      }
     
    },

    //查询
    handleSearch() {
      let name = this.searchForm.keyword.trim();
      if (name) {
        this.lazy = false;
        this.defaultExpandAll =true;
        this.searchTime++;
        processSetting
          .usersByName(name)
          .then(res => {
            if (res) {
              if (res.usersNameLikeList) {
                if (!Array.isArray(res.usersNameLikeList)) {
                  this.usersTreeData = [res.usersNameLikeList];
                } else {
                  this.usersTreeData = res.usersNameLikeList;
                }
              }
            } else {
              this.usersTreeData = [];
            }
          })
          .catch(err => this.error(err.message[0]));
      }
    },
    clearSearch() {
      this.defaultExpandAll =false;
      this.lazy = true;
      this.searchTime++;
    },
    //获取岗位顶级节点
    usersTree() {
      return new Promise((resolve, reject) => {
        processSetting
          .usersTree()
          .then(res => {
            if (res) {
              resolve(res);
            } else {
              resolve([]);
            }
          })
          .catch(err => reject(err));
      });
    },
    //根据父节点加载子节点
    usersByParentId(id) {
      return new Promise((resolve, reject) => {
        processSetting
          .usersByParentId(id)
          .then(res => {
            if (res) {
              resolve(res);
            } else {
              resolve([]);
            }
          })
          .catch(err => reject(err));
      });
    },

    //岗位树节点懒加载
    async loadNode(node, resolve) {
      if (!this.lazy) {
        return;
      } else {
        if (node.level === 0) {
          if(node.isLeaf){
            resolve([]);
          }
          let value = await this.usersTree();
          if (value) {
            if (!Array.isArray(value)) {
              this.defaultExpandedKeys = [value.id];
              resolve([value]);
            } else {
              this.defaultExpandedKeys = [value[0].id];
              resolve(value);
            }
            this.$refs.userTree.setCurrentKey(this.defaultExpandedKeys[0]);
          } else {
            resolve([]);
          }
        }
        //选中节点加载下一节点
        if (node.level >= 1) {
          if(node.isLeaf){
            resolve([]);
          }
          if (node.key) {
            let  parame = encodeURI(node.key)
            let value = await this.usersByParentId( parame);
            if (value) {
              if (!Array.isArray(value)) {
                resolve([value]);
              } else {
                resolve(value);
              }
            } else {
              resolve([]);
            }
          }
        }
  
      }
    },
    close() {
      this.searchTime++;
      if (this.searchTime > 9999) {
        this.searchTime = 0;
      }
     this.defaultExpandAll =false;
      this.lazy = true;
       this.checkedNodesList=[];
      this.$refs.form.resetFields();
      this.$refs.form.clearValidate();
      this.dialogVisible = false;
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
::v-deep .operation-users {
  .el-dialog__body {
    height: 380px;
    padding: 0px;

  }
}
</style>
