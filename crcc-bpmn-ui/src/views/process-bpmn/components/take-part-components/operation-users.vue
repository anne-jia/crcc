<!--  operation-users-->
<template>
    <el-dialog @open='opened' @close='close' top="20vh" append-to-body title='添加人员' custom-class="operation-users" v-el-drag-dialog :visible.sync='dialogVisible' :close-on-click-modal='false' width='680px'>
        <crcc-main class="user-box" :showOpcation="false">
            <template slot="crcc-serach">
                <el-form ref="form" :model="searchForm" @submit.native.prevent label-position="right">
                    <el-form-item label="模糊查询" label-width="70px">
                        <el-input v-model="searchForm.keyword" placeholder="岗位名称" clearable @clear="clearSearch"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch()">搜索</el-button>
                    </el-form-item>
                </el-form>
            </template>
            <template slot="crcc-main">
                <div>
                    <el-tree ref="userTree" :expand-on-click-node='false' highlight-current :load="loadNode" :data="usersTreeData" :key="searchTime" :lazy="lazy" show-checkbox node-key="code" :default-expanded-keys="defaultExpandedKeys" :props="defaultProps">
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
    props: {},
    components: {

    },
    data() {
        return {
            dialogVisible: false,
            lazy:true,
            searchTime:0,
            searchForm: {
                keyword: ""
            },
            usersTreeData: [],
            defaultExpandedKeys: [],
            defaultProps: {
                children: "children",
                label: "name",
                id: "code",
                isLeaf: 'isDetail'
            }
        }
    },
    computed: {

    },
    methods: {
        opened() {},
        submit() {
            this.close();
        },
      
           //查询
        handleSearch() {
            let name = this.searchForm.keyword.trim()
            if(name){
                this.lazy =false;
                this.searchTime++
                processSetting
                .usersByName(name)
                .then(res => {
                     if (res) {
                         if(res.usersNameLikeList){
                            if (!Array.isArray(res.usersNameLikeList)) {

                                this.defaultExpandedKeys = [res.usersNameLikeList.code];
                                this.usersTreeData = [res.usersNameLikeList]
                            }else{
                                this.defaultExpandedKeys = [res.usersNameLikeList[0].code];
                                this.usersTreeData = res.usersNameLikeList
                            } 
                            this.$refs.userTree.setCurrentKey(this.defaultExpandedKeys[0]);

                            
                         }
                  
                      } else {
                          this.usersTreeData =[]
                      }
                })
                .catch(err => this.error(err.message[0]));
            }
            
        },
        clearSearch(){
            this.lazy = true;
            this.searchTime++
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
             if(!this.lazy){
                return
            }else{
            if (node.level === 0) {
                let value = await this.usersTree();
              if(value){
                     if (!Array.isArray(value)) {
                         this.defaultExpandedKeys = [value.code];
                             resolve([value]);
                         }else{
                             this.defaultExpandedKeys = [value[0].code];
                             resolve(value);
                         }
                            this.$refs.userTree.setCurrentKey(this.defaultExpandedKeys[0]);
                        
                 } else {
                     resolve([]);
                 }
               
            }
            //选中节点加载下一节点
            if (node.level >=1) {
                if (node.key) {
                    let value = await this.usersByParentId(node.key);
                    if(value){
                        if (!Array.isArray(value)) {
                                resolve([value]);
                            }else{
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
            this.searchTime =0;
            this.$refs.form.resetFields();
            this.$refs.form.clearValidate();
            this.dialogVisible = false
        },

    },
    mounted() {

    },
}
</script>

<style lang="scss" scoped>
::v-deep .operation-users {
    .el-dialog__body {
        height: 380px;
    }
}
</style>
