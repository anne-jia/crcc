<template>
    <div>
        <div class="menu-type">{{menu}}</div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            menu:"工作事项"
        }
    }
}
</script>

<style lang="scss" scoped>
.menu-type{
    box-sizing: border-box;
    height: 46px;
    line-height: 46px;
    color:#333;
    font-size: 13px;
    /* text-align: center; */
    padding-left: 15px;
    background: #f1f1f1;
    border-bottom: solid 1px #e6e6e6;
    border-top: solid 1px #e6e6e6;
}
</style>