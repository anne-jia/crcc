<!--  message-setting-->
<template>
    <el-dialog @open='opened' @close='close' append-to-body title='参与者设置' v-el-drag-dialog :visible.sync='dialogVisible' :close-on-click-modal='false' width=''>

    </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog/index'

export default {
    directives:{
        elDragDialog
    },
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
        opened() {},
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
