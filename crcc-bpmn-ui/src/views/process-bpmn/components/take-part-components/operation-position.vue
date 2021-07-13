<!--  operation-position-->
<template>
    <el-dialog @open="opened" @close="close" top="20vh" custom-class="operation-position" append-to-body title="添加岗位" v-el-drag-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" width="680px">
        <crcc-main class="position-box" :showOpcation="false" >
            <template slot="crcc-serach">
                <el-form ref="form" :model="searchForm" @submit.native.prevent label-position="right">
                    <el-form-item label="模糊查询" label-width="70px" prop="keyword">
                        <el-input v-model="searchForm.keyword" placeholder="岗位名称" clearable @clear="clearSearch()"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch()">搜索</el-button>
                    </el-form-item>
                </el-form>
            </template>
            <template slot="crcc-main">
                <div>
                    <el-tree ref="jobsTree" :default-checked-keys="defaultCheckedKeys" @check="checkChange" :check-strictly="true" :expand-on-click-node='false' highlight-current :data="jobsTreeData" :key="searchTime" :load="loadNode" :lazy="lazy" show-checkbox node-key="id" :default-expanded-keys="defaultExpandedKeys" :props="defaultProps">
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
            type:Array,
             default: function () {
                return []
            }
        },
    },

    components: {},
    data() {
        return {
            dialogVisible: false,
            lazy: true,
            searchTime: 0,
            searchForm: {
                keyword: ""
            },
            checkedNodesList: [],
            jobsTreeData: [],
            defaultExpandedKeys: [],
            defaultProps: {
                children: "children",
                label: "name",
                id: "code",
                isLeaf: 'isDetail'
            }
        };
    },
    computed: {
        defaultCheckedKeys(){
            let newArr=[]
            this.checkedNodes.map(item=>{
                newArr.push(item.code);
            })
            return newArr;
        }
    },
    methods: {
        opened() {
          
        },
        checkChange(data, checkedInfo) {
            let checked = checkedInfo.checkedNodes
            this.checkedNodesList = checkedInfo.checkedNodes;
            this.$emit('checkChange', data, checked)
        },

        //查询
         handleSearch() {
            let name = this.searchForm.keyword.trim()
            if (name) {
                this.$nextTick(async()=>{
                    this.lazy = false;
                    this.searchTime++;
                    this.jobsTreeData = await this.jobsByName(this.searchForm.keyword.trim());
                });
            }
        },
        clearSearch() {
            this.lazy = true;
            this.searchTime++
        },
        //过来查询
        jobsByName(value) {
              this.searchTime++
            return new Promise((resolve, reject) => {
                processSetting
                    .jobsByName(value)
                    .then(res => {
                        if (res) {
                            if (!Array.isArray(res)) {
                                this.defaultExpandedKeys = [res.code];
                                resolve([res]);
                            } else {
                                this.defaultExpandedKeys = [res[0].code];
                                resolve(res);
                            }
                            this.$refs.jobsTree.setCurrentKey(this.defaultExpandedKeys[0]);

                        } else {
                            resolve([]);
                        }
                       

                    })
                    .catch(err => reject(err));
            })
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
        jobsByParentId(id) {
            return new Promise((resolve, reject) => {
                processSetting
                    .jobsByParentId(id)
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
                return
            } else {
                //懒加载
                if (node.level === 0) {
                    let value = await this.jobsTree();
                    if (value) {
                        if (!Array.isArray(value)) {
                            this.defaultExpandedKeys = [value.code];
                            resolve([value]);
                        } else {
                            this.defaultExpandedKeys = [value[0].code];
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
                        let value = await this.jobsByParentId(node.key);
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
            this.$emit('addPosition', [...this.checkedNodesList]);
            this.close();
        },
        close() {
            this.searchTime ++;
            if( this.searchTime>9999){
                this.searchTime=0;
            }
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
    }
}
</style>
