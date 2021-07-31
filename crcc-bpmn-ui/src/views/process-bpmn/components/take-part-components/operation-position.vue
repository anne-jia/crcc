<!--  operation-position-->
<template>
  <el-dialog
    @open="opened"
    @close="close"
    top="20vh"
    custom-class="operation-position"
    append-to-body
    title="添加岗位"
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="680px"
  >
    <crcc-main class="position-box" :showOpcation="false">
      <template slot="crcc-serach">
        <el-form
          ref="form"
          :model="searchForm"
          @submit.native.prevent
          label-position="right"
        >
          <el-form-item label="模糊查询" label-width="70px" prop="keyword">
            <el-input
              v-model="searchForm.keyword"
              placeholder="岗位名称"
              clearable
              @clear="clearSearch()"
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
            ref="jobsTree"
            :default-checked-keys="defaultCheckedKeys"
            @check="getCheckChange"
            @check-change="checkChangeNode"
            :check-strictly="true"
            :expand-on-click-node="false"
            :default-expand-all='defaultExpandAll'
            highlight-current
            :data="jobsTreeData"
            :key="searchTime"
            :load="loadNode"
            :lazy="lazy"
            show-checkbox
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
import elDragDialog from '@/directive/el-drag-dialog/index'

export default {
    directives:{
        elDragDialog
    },
  props: {
    checkedNodes: {
      type: Array,
      default: function() {
        return [];
      }
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
      jobsTreeData: [],
      defaultExpandedKeys: [],
      defaultProps: {
        children: "children",
        label: "name",
        id: "id",
        isLeaf: "isDetail"
      },
      checkedNodesList:[],
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
      this.checkedNodesList =[...this.checkedNodes]
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

    getCheckChange(data, checkedInfo) {
     
      let checked = checkedInfo.checkedNodes;
      this.$emit("getCheckChange", data, checked);
    },
    //选中状态改变了，看是否是初始状态的值
    checkChangeNode(data,state,childState){
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
    },
    //查询
    handleSearch() {
      let name = this.searchForm.keyword.trim();
      if (name) {
        this.$nextTick(async () => {
          this.lazy = false;
          this.searchTime++;
         this.defaultExpandAll =true;
          this.jobsTreeData = await this.jobsByName(
            this.searchForm.keyword.trim()
          );
        });
      }
    },
    clearSearch() {
    this.defaultExpandAll =false;
      this.lazy = true;
      this.searchTime++;
    },
    //过来查询
    jobsByName(value) {
      this.searchTime++;
      return new Promise((resolve, reject) => {
        processSetting
          .jobsByName(value)
          .then(res => {
            if (res) {
              if (!Array.isArray(res)) {
                this.defaultExpandedKeys = [res.id];
                resolve([res]);
              } else {
                this.defaultExpandedKeys = [res[0].id];
                resolve(res);
              }
              this.$refs.jobsTree.setCurrentKey(this.defaultExpandedKeys[0]);
            } else {
              resolve([]);
            }
          })
          .catch(err => reject(err));
      });
    },

    //获取岗位顶级节点
    jobsTree() {
      return new Promise((resolve, reject) => {
        processSetting
          .jobsTree()
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
    jobsByParentId(id,path,name) {
      return new Promise((resolve, reject) => {
        processSetting
          .jobsByParentId(id,path,name)
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
        //懒加载
        if (node.level === 0) {
          let value = await this.jobsTree();
          if (value) {
            if (!Array.isArray(value)) {
              this.defaultExpandedKeys = [value.id];
              resolve([value]);
            } else {
              this.defaultExpandedKeys = [value[0].id];
              resolve(value);
            }
            this.$refs.jobsTree.setCurrentKey(this.defaultExpandedKeys[0]);
          } else {
            resolve([]);
          }
        }
        //选中节点加载下一节点
        if (node.level >= 1) {
          if (node.key) {
            let parame = encodeURI(node.key)
            let value = await this.jobsByParentId(parame,node.data.pathName,node.data.type);
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

    submit() {
  
  if(this.checkedNodesList.length>0){
      let data = [...this.checkedNodesList];
        this.$emit("addPosition", data);
        this.close();
    }else{
      this.warn('请选择岗位')
    }
    
    },
    close() {
    
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
::v-deep .operation-position {
  .el-dialog__body {
    height: 380px;
    padding: 0px;
  }
}
</style>
