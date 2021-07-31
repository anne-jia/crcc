<!--  index-->
<template>
    <div class='crcc-card'>
        <div class="title">
            {{title}}
            <slot name="title"></slot>

        </div>
        <div :class="getClassName">
            <slot ></slot>
        </div>
    </div>
</template>

<script>
export default {
    name:'crccCard',
    props:{
        scroll:{
            type:Boolean,
            default:false,
        },
        title:{
            type:String,
            default:''
        },
        className:{
            type:String,
            default:' '
        },
    },
    components: {

    },
    data() {
        return {

        }
    },
    computed: {
        getClassName(){
            if(this.scroll){
                return 'main scrollBar '+this.className
            }else{
                return 'main '+ this.className
            }
        }
    },
    methods: {

    },
    mounted() {

    },
}
</script>

<style lang="scss" scoped>
$borderColor:#dcdfe6;
.crcc-card {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: hidden;
    .title,
    .main {
        box-sizing: border-box;
        padding: 8px;
    }

    .title {
        border-bottom: 1px solid $borderColor;
        color: #6c6c6c;
        line-height: 16px;
        .el-button{
            padding: 0px 4px;
            height: 16px;
            line-height: 16px;
        }
    }

    .main {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }
    .main.no-padding{
        padding: 0px;
    }
    .scrollBar{
        overflow: scroll;
    }
}
</style>
