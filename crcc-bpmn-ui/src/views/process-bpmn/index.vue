<!--  bpmn-->
<template>
    <div class='bpmn' v-loading='loadingProcess'>
        <customModeler :key="`process-${reloadIndex}`" v-model="xmlString" v-bind="controlForm" @publish-process='publishProcess' @element-click="elementClick">
            <el-button type="primary" icon="el-icon-back" @click="goBack">返回</el-button>
        </customModeler>
        <messageSetting ref="messageSetting" @on-message-save="savedMessage"></messageSetting>
        <take-part-in-setting ref="takePartInSetting" @on-save-take-part-setting="savedParticipant"></take-part-in-setting>
    </div>
</template>

<script>
import customModeler from '@/components/crcc-bpmn/custom-modeler'
import messageSetting from './components/message-setting.vue'
import takePartInSetting from './components/take-part-in-setting.vue'

import processDefinitionApi from "@/api/process-definition-api";
export default {
    components: {
        customModeler,
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
                prefix: "camunda",
                status:'create',
            },
            processForm: {

            }
        }
    },
    computed: {

    },
    methods: {
        goBack(realod=false) {
            this.$emit('hide-bpmn', realod)
        },
        editDiagram(flowInfo) {
            this.loadingProcess = true
            this.controlForm.flowType = flowInfo.typeId;
            this.controlForm.status = 'update';
            processDefinitionApi.getFlowXml(flowInfo.procDefId).then(xml => {
                this.xmlString = xml;
                this.reloadIndex++;
            }).catch(err => this.error(err.message[0])).finally(() => this.loadingProcess = false);
        },
        createDiagram(flowInfo){
            this.controlForm.status = 'create';
            this.controlForm.flowType = flowInfo.typeId;
            this.controlForm.processId = flowInfo.flowCode;
             this.controlForm.processName = flowInfo.flowName;
            this.xmlString = '';
            this.reloadIndex++;
        },

        copyDiagram(flowInfo) {
            this.loadingProcess = true;
            this.controlForm.flowType = flowInfo.typeId;
            this.controlForm.processId = flowInfo.flowCode;
            this.controlForm.processName = flowInfo.flowName;
            //复制
            this.controlForm.status = 'copy';
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
            this.loadingProcess =true
             processDefinitionApi.deployFlow(value)
                .then(() => {
                    this.info("部署完成");
                    this.loadingProcess =false
                    this.goBack(true);
                })
                .catch(err => {
                    this.error(err.message[0]);
                });


        },
        //消息设置打开
        openMessage() {
            let that = this;
            Vue.$workflowEventBus.$on('message-setting.openning', function (e) {
                console.log(e,'meaage')
                if(that.$refs.messageSetting){
                    // that.$refs.messageSetting.dialogVisible = true;
                    that.$refs.messageSetting.showHelp(e);
                }

            })
        },
        //消息设置关闭
        savedMessage(result) {
               if(result){
                     Vue.$workflowEventBus.$emit("message-setting.saved", result);
                    console.log(result,'message-result')
                }
        },
        //参与者设置打开
        openParticipant() {
            let that = this;
            Vue.$workflowEventBus.$on('sys-participant.openning', function (e) {
                if(that.$refs.takePartInSetting){
                    that.$refs.takePartInSetting.showDialogVisibel(e);
                }

            })
        },
       
        //参与者设置关闭
        savedParticipant(result) {
                
                if(result){
                     Vue.$workflowEventBus.$emit("participant.saved", result);
                }
        }

    },
    mounted() {
        this.openMessage();
        this.savedMessage();
        this.openParticipant();
        this.savedParticipant();
    },
}
</script>

<style lang="scss" scoped>
.bpmn {
    height: 100%;
    width: 100%;
}
</style>
