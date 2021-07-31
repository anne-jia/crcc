<!--  bpmn-->
<template>
    <div class='bpmn'>
        <customModeler v-model="xmlString"
         v-bind="controlForm"
          @publish-process='publishProcess' 
          @opening-message="openMessage"
          @opening-participant="openParticipant"
          @element-click="elementClick">
            <el-button type="primary" icon="el-icon-back" @click="goBack">返回</el-button>
        </customModeler>
        <messageSetting ref="messageSetting"></messageSetting>
        <take-part-in-setting ref="takePartInSetting"></take-part-in-setting>
    </div>
</template>

<script>
// import customModeler from '@/components/crcc-bpmn/custom-modeler/custom-modeler.vue'

import messageSetting from './components/message-setting.vue'
import takePartInSetting from './components/take-part-in-setting.vue'

export default {
    components: {
        // customModeler,
        messageSetting,
        takePartInSetting
    },
    data() {
        return {
            xmlString: '',
            controlForm: {
                processId: "",
                processName: "",
                prefix: "camunda",
            }
        }
    },
    computed: {

    },
    methods: {
        goBack() {
            // if (Vue.$workflowEventBus) {
            //     Vue.$workflowEventBus.$emit("message-setting.saved", 111);

            // }
        },
        //元素点击时候
        elementClick(element) {
            this.element = element;
        },
        // 获取更改 提交到后台交互
        publishProcess(value) {},
        //消息设置打开
        openMessage() {
            let that = this;
            that.$refs.messageSetting.dialogVisible = true;

        },
        //消息设置关闭
        savedMessage() {
            let that = this;
            // if (Vue.$workflowEventBus) {
            //     Vue.$workflowEventBus.$emit("message-setting.saved", 111);

            // }
        },
        //参与者设置打开
        openParticipant() {
            let that = this;
            that.$refs.takePartInSetting.dialogVisible = true;
        },
        //参与者设置关闭
        savedParticipant() {
            let that = this;

            // Vue.$workflowEventBus.$on('participant.saved', function (e) {})
        }

    },
    mounted() {
     
    },
}
</script>

<style lang="scss" scoped>
.bpmn {
    height: 100%;
    width: 100%;
}
</style>
