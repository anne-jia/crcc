<!--  bpmn-->
<template>
<div class='bpmn'>
    <customModeler  v-model="xmlString"  v-bind="controlForm" @publish-process='publishProcess'  @element-click="elementClick"></customModeler>
</div>
</template>

<script>
import { xmlStr } from "../mock/xmlStr";

import customModeler from '@/components/custom-modeler'
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