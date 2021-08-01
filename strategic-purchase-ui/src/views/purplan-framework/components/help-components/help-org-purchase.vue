<!--  help-purchase-org-->
<template>
    <el-dialog @open='opened' @close='close' append-to-body title='采购组织' v-el-drag-dialog :visible.sync='dialogVisible' :close-on-click-modal='false' width='680px'>
        <el-table :data="orgPurchaseData" border stripe @row-click="changeChose">
            <el-table-column prop="authOrgFullPathName" label="组织名称"/>
        </el-table>
    </el-dialog>
</template>

<script>
import frameworkAPI from '@/api/framework-service'

export default {
    props: {
    },
    components: {

    },
    data() {
        return {
            dialogVisible: false,
            orgPurchaseData:[],
            chosePurchase:{},
        }
    },
    computed: {

    },
    methods: {
        opened() {

        },
        close() {
            this.dialogVisible = false
        },
        //获取采购组织
        getAuthOrgNameData() {
            frameworkAPI.getAuthOrgName4User().then(res => {
              if(res){
                 this.orgPurchaseData = res;
                 if(res.length>0){
                   this.changeChose(res[0])
                 }
              }
            }).catch(err => {
                this.error(err.message[0])
            })
        },
        
        changeChose(row) {
          this.chosePurchase ={...row};
          this.$emit('getChosePurchase', this.chosePurchase);
          this.close();
        }
    },
    mounted() {
        this.getAuthOrgNameData();
    },
}
</script>

<style lang='scss' scoped>

 ::v-deep .el-dialog__body{
    height:420px;
    padding:8px;
  }
</style>
