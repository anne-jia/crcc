<!--  bpmn-->
<template>
<div class='bpmn'>
    <customModeler  v-model="xmlString"  v-bind="controlForm" @publish-process='publishProcess'  @element-click="elementClick">
        <el-button type="success" @click="readMe">readMe</el-button>
    </customModeler>
</div>
</template>

<script>
import customModeler from '@/components/crcc-bpmn/custom-modeler'
export default{
components:{
customModeler
},
data(){
return{
xmlString:'',
controlForm:{
    processId: "",
    processName: "",
    prefix: "camunda",
}
}
},
computed:{

},
methods:{
  elementClick(element) {
      this.element = element;
    },

    // 获取更改 提交到后台交互
    publishProcess(value){
        console.log(value,'value')
    },
    readMe(){
        this.$router.push('read-me')
    }
},
mounted(){

},
}
</script>
<style lang='scss' scoped>
.bpmn{
    height: 100%;
    width: 100%;
}
</style>