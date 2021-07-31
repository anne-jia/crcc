<template>
    <div class="crcc-process-palette-container">
        <div class="crcc-control_header">
            <div class="color-title"><div class="color" :style="getfinishedColor"></div>已经过的节点</div>
            <div class="color-title"><div class="color" :style="getDoingColor"></div>当前节点</div>
            <div class="color-title" v-if="showWillColor"><div class="color" :style="getWillColor"></div>未过的节点</div>

        </div>
        <div class="crcc-process-designer__container">
            <div class="crcc-process-designer__canvas" ref="bpmn-canvas" id="canvas"></div>
        </div>
    </div>
</template>

<script>
// 引入相关的依赖
import {
    ModelerViewer
} from "./index.js";
import DefaultEmptyXML from "../modeler-enhance/plugins/defaultEmpty";

export default {
    name: "modelerView",
    props: {
        value: String, // xml 字符串
        status: Array,
        showWillColor:{
            type:Boolean,
            default:false,
        },
        willColor: {
            type: String,
            default: '#cbf0c9'
        },
        willStrokeColor: {
            type: String,
            default: '#606266'
        },

        doingColor: {
            type: String,
            default: '#fbe9d1'
        },
        doingStrokeColor: {
            type: String,
            default: '#606266'
        },
        finishedColor: {
            type: String,
            default: '#b4e2fc'
        },
        finishedStrokeColor: {
            type: String,
            default: '#606266'
        },
        //#606266
    },
    watch: {
        value: {
            handler(newValue, oldValue) {
                this.createNewDiagram(this.value, this.status);
            },
            deep: true,
        }
    },

    mounted() {
        this.init();
        this.createNewDiagram(this.value, this.status);

    },
    data() {
        return {
            bpmnViewer: null,
            container: null,
            canvas: null
        };
    },
    // 方法集合
    methods: {
        init() {
            const canvas = this.$refs['bpmn-canvas'];
            this.bpmnViewer = new ModelerViewer({
                container: canvas
            });
        },
        async createNewDiagram(xml, status) {

            try {
                let newId = this.processId || `Process_${new Date().getTime()}`;
                let newName = this.processName || `业务流程_${new Date().getTime()}`;
                let xmlString = xml || DefaultEmptyXML(newId, newName, this.prefix);
                if (!this.bpmnViewer) {
                    return;
                }
                const result = await this.bpmnViewer.importXML(xmlString);

                const elementRegistry = this.bpmnViewer.get("elementRegistry");
                const modeling = this.bpmnViewer.get("modeling");
                if(status.length>0){
                      status.map(item => {
                        switch (item.state) {
                            case 'finished':

                                modeling.setColor(elementRegistry.get(item.task), {
                                    fill: this.finishedColor,
                                    stroke: this.finishedStrokeColor,

                                });
                                break;
                            case 'running':
                                    modeling.setColor(elementRegistry.get(item.task), {
                                        fill: this.doingColor,
                                        stroke: this.doingStrokeColor,
                                    });
                                    break;
                            case 'will':
                                if(this.showWillColor){
                                      modeling.setColor(elementRegistry.get(item.task), {
                                        fill: this.willColor,
                                        stroke: this.willStrokeColor,
                                    });
                                }
                                  
                                    break;
                                }

                        }) 
                }
                this.bpmnViewer.get("canvas").zoom("fit-viewport");
                }
                catch (err) {
                    this.error(err.message[0])
                }
            }
        },
        // 计算属性
        computed: {
            getDoingColor() {
                return {
                    background: this.doingColor
                }
            },
            getWillColor() {
                return {
                    background: this.willColor
                }
            },
            getfinishedColor() {
                return {
                    background: this.finishedColor
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
::v-deep .crcc-control_header {
    text-align: left;
    padding-left: 32px;

}

</style>
