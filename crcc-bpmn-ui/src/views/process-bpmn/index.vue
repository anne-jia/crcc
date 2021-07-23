<!--  bpmn-->
<template>
    <div class='bpmn' v-loading='loadingProcess'>
        <customModeler :key="`process-${reloadIndex}`" v-model="xmlString" 
        ref="customModeler"
        v-bind="controlForm"
         @opening-message="openMessage"
         @opening-participant="openParticipant"
         @publish-process='publishProcess' @element-click="elementClick">
            <el-button type="primary" icon="el-icon-back" @click="goBack">返回</el-button>
        </customModeler>
        <messageSetting ref="messageSetting" @on-message-save="savedMessage"></messageSetting>
        <take-part-in-setting ref="takePartInSetting" @on-save-take-part-setting="savedParticipant"></take-part-in-setting>
    </div>
</template>

<script>
import messageSetting from './components/message-setting.vue'
import takePartInSetting from './components/take-part-in-setting.vue'

import processDefinitionApi from "@/api/process-definition-api";
export default {
    components: {
        messageSetting,
        takePartInSetting
    },
    data() {
        return {
            xmlString: '',
            reloadIndex: 0,
            loadingProcess: false,
            controlForm: {
                flowTypeId: '',
                processId: "",
                processName: "",
                companyId:"",
                general:false,
                companyPath:'',
                companyName:"",
                prefix: "camunda",
                status:'create',
            },
    
        }
    },

    methods: {
        goBack(realod=false) {
            this.$emit('hide-bpmn', realod)
        },
        editDiagram(flowInfo) {
            this.loadingProcess = true
            let data={
                flowType:flowInfo.typeId,
                processId: flowInfo.flowCode,
                processName:flowInfo.flowName,
                companyId:flowInfo.companyId,
                companyName:flowInfo.companyName,
                companyPath:flowInfo.companyPath,
                general:flowInfo.general,
                status:'update'
            }
            this.controlForm={...this.controlForm,...data}
           
            processDefinitionApi.getFlowXml(flowInfo.procDefId).then(xml => {
                this.xmlString = xml;
                this.reloadIndex++;
            }).catch(err => this.error(err.message[0])).finally(() => this.loadingProcess = false);
        },
        createDiagram(flowInfo){
            let data={
                flowType:flowInfo.typeId,
                processId: flowInfo.flowCode,
                processName:flowInfo.flowName,
                companyId:flowInfo.companyId,
                companyName:flowInfo.companyName,
                companyPath:flowInfo.companyPath,
                general:flowInfo.general,
                status:'create'
            }
            this.controlForm={...this.controlForm,...data}
            this.xmlString = '';
            this.reloadIndex++;
        },

        copyDiagram(flowInfo) {
            this.loadingProcess = true;
                 let data={
                flowType:flowInfo.typeId,
                processId: flowInfo.flowCode,
                processName:flowInfo.flowName,
                companyId:flowInfo.companyId,
                companyName:flowInfo.companyName,
                companyPath:flowInfo.companyPath,
                general:flowInfo.general,
                status:'copy'
            }
            this.controlForm={...this.controlForm,...data}

            //复制
            processDefinitionApi.getFlowXml(flowInfo.flowToCopy.procDefId).then(xml => {
                this.xmlString = xml;
                this.reloadIndex++;
            }).catch(err => this.error(err.message[0])).finally(() => this.loadingProcess = false);
        },

        //元素点击时候
        elementClick(element) {
            this.element = element;
        },
        // 获取更改 提交到后台交互
        publishProcess(value) {
            let data = {...value,general:this.controlForm.general,companyPath:this.controlForm.companyPath}
            this.loadingProcess =true
             processDefinitionApi.deployFlow(data)
                .then(() => {
                    this.info("部署完成");
                    this.goBack(true);
                })
                .catch(err => {
                    this.error(err.message[0]);
                }).finally(() =>this.loadingProcess =false);


        },
        //消息设置打开
        openMessage(e) {
            this.$refs.messageSetting.showHelp(e);
        },
        //消息设置关闭
        savedMessage(result) {
                this.$refs.customModeler.savedMessage(result)
        },
        //参与者设置打开
        openParticipant(e) {
                    this.$refs.takePartInSetting.showDialogVisibel(e);
          
        },
       
        //参与者设置关闭
        savedParticipant(result) {
            this.$refs.customModeler.savedParticipant(result)
               
        }

    },
  
}
</script>

<style lang="scss" scoped>
.bpmn {
    height: 100%;
    width: 100%;
}
</style>
