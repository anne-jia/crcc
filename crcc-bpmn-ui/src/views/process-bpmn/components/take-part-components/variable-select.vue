<template>
    <el-dialog title="选择变量" :visible.sync="showDialog" width="350px" v-el-drag-dialog  top="20vh" append-to-body :close-on-click-modal="false" custom-class="variable-select">
        <div>
            <el-table ref="varlist" :show-header="false" :data="paramList"  highlight-current-row>
                <el-table-column type="index" width="30"></el-table-column>
                <el-table-column prop="label"></el-table-column>
            </el-table>
        </div>
        <span slot="footer">
                <el-button plain @click="close">取消</el-button>
                <el-button type="primary" plain @click="confirm">确认</el-button>
        </span>
    </el-dialog>
</template>

<script>
import ParamList from "./inner-params";

export default {
    name: "VariableSelect",

    data() {
        return {
            showDialog: false,
            paramList: ParamList,
            confirmCallBack: null
        };
    },

    methods: {
        open(callback) {
            this.confirmCallBack = callback;
            this.showDialog = true;
        },

        confirm() {
            if (!this.selectedVar) {
                this.warn("请选择变量");
                return;
            }
            if (typeof this.confirmCallBack == "function") {
                this.confirmCallBack(this.selectedVar);
                this.close()
            }
        },
        close() {
            this.showDialog = false;

        }
    },

    computed: {
        selectedVar() {
            return this.$refs.varlist.store.states.currentRow;
        }
    }
};
</script>

<style lang="scss" scoped>
::v-deep .variable-select {
    .el-dialog__body {
        height: 160px;
        padding:8px 0px;
    }
}
</style>
