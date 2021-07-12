<!--  index-->
<template>
    <div class='crcc-container'>
        <div class="crcc-search" v-if="showSearch">
            <slot  name="crcc-serach">
            </slot>
        </div>
        <div class="crcc-opcation"  v-if="showOpcation">
            <slot name="crcc-opcation">
            </slot>
        </div>
        <div :class="getClassName">
            <slot name="crcc-main">
            </slot>
        </div>
        <slot></slot>
    </div>
</template>

<script>

export default {
    props:{
        scroll:{
            type:Boolean,
            default:true
        },
        showOpcation:{
            type:Boolean,
            default:true,
        },
        showSearch:{
            type:Boolean,
            default:true,
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
             return 'crcc-main scrollBar '+ this.className;
            }else{
                return 'crcc-main' + this.className;
            }
        },
     
           
    },
    methods: {

    },
    mounted() {

    },
}
</script>
<style lang="scss" scoped>
.crcc-main{
    overflow: hidden;
}
.crcc-main.no-padding{
    padding: 0px;
}
.scrollBar.crcc-main{
    overflow: scroll;
}
</style>
