<!--  index-->
<template>
    <el-collapse v-model="activeNames" class="icons-box ">
        <el-collapse-item  name="1">
            <template slot="title">
                <span class="title">
                     svg图标
                </span>
               
            </template>
            <div v-for="item of svgIcons" :key="item" @click="handleClipboard(generateIconCode(item), $event)">
                <el-tooltip placement="top" >
                    <div slot="content">
                        {{ generateIconCode(item) }}
                    </div>
                    <div class="icon-item">
                        <svg-icon :icon-class="item" class-name="disabled" />
                        <span>{{ item }}</span>
                    </div>
                </el-tooltip>
            </div>
        </el-collapse-item>
    </el-collapse>

</template>

<script>
import svgIcons from "./svg-icons";
import clipboard from "@/utils/clipboard";
export default {
    components: {},
    data() {
        return {
            activeNames: ["1"],
            svgIcons,
        };
    },
    computed: {},
    methods: {
        generateIconCode(symbol) {
            return `<svg-icon icon-class="${symbol}" />`;
        },
        generateElementIconCode(symbol) {
            return `<i class="el-icon-${symbol}" />`;
        },
        handleClipboard(text, event) {
            clipboard(text, event);
        },
    },
    mounted() {},
};
</script>

<style lang="scss" scoped>
 .el-collapse.icons-box {
    
    ::v-deep .el-collapse-item__wrap{
        background: #e3e4e4;
    }
    .title{
        padding-left: 20px;
        font-size: 18px;
    }
}

.icon-item {
    margin: 20px;
    height: 68px;
    text-align: center;
    width: 68px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
}

span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
}

.disabled {
    pointer-events: none;
}
</style>
