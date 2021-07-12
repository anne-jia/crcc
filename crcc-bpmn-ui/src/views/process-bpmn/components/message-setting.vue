<!--  message-setting-->
<template>
    <el-dialog @open='opened' @close='close' append-to-body title='消息设置' v-el-drag-dialog :visible.sync='dialogVisible' :close-on-click-modal='false' width=''>

    </el-dialog>
</template>

<script>
export default {
    props: {},
    components: {

    },
    data() {
        return {
            dialogVisible: false,

        }
    },
    computed: {

    },
    methods: {
        opened() {
            
        },
        showDialogVisibel(value){
            this.dialogVisible =true;
            console.log(value,'value')
        },
        close() {
            this.dialogVisible = false
        },

    },
    mounted() {

    },
}
</script>

<style lang='scss' scoped>

</style>
