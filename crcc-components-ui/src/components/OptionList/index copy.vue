<template>
    <div class="option-list"  v-show-tips="{'width':width}" >
        <slot></slot>
        <span v-if="text"> {{text}}</span>
        
    </div>
</template>
<script>
export default {
    props:{
        width:Number,
        text:{
            type:String,
            default:''
        },
    },
    computed:{
        getWidth:{
            get(){
                return this.width
            },
            set(val){
              this.$emit('update:width',val)
                
            }
        }
    }

}
</script>
<style scoped>
    .option-list{
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
    }
</style>