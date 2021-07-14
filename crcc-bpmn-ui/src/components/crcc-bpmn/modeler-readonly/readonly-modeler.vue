<template>
    <div class="crcc-process-palette-container">
        <div class="crcc-control_header">
            <span class="color-title"><span class="color" :style="getFinishColor"></span>已经过的节点</span>
            <span class="color-title"><span class="color" :style="getDoingColor"></span>当前节点</span>
            <span class="color-title"><span class="color" :style="getWillColor"></span>未过的节点</span>

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
// import DefaultEmptyXML from "../modeler-enhance/plugins/defaultEmpty";
import {
    xmlStr
} from "./xmlStr";

export default {
    name: "",
    props: {
        value: String, // xml 字符串
        willColor: {
            type: String,
            default: '#cbf0c9'
        },
        doingColor: {
            type: String,
            default: '#fbe9d1'
        },
        finishColor: {
            type: String,
            default: '#b4e2fc'
        }
    },
    components: {},
    created() {},
    mounted() {
        this.init();
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
            this.createNewDiagram();
        },
        async createNewDiagram() {
            // console.log(xmlStr, 'xmlStr')
            try {
                const result = await this.bpmnViewer.importXML(xmlStr);

                var overlays = this.bpmnViewer.get('overlays'),
                    elementRegistry = this.bpmnViewer.get('elementRegistry');
                var shape = elementRegistry.get('Activity_069o9xg');
                var $overlayHtml = $('<div class="highlight-overlay">').css({
                    fill:this.doingColor,
                    stroke: null
                });
                overlays.add('Activity_069o9xg', {
                    position: {
                        top: 0,
                        left: 0
                    },
                     html: $overlayHtml
                });
                console.log(overlays,shape);

                //     const modeling =   this.bpmnViewer.get('modeling');

                //   modeling.setColor(task, {
                //         fill: this.doingColor,
                //         stroke: 'green',
                //     })
                const {
                    warnings
                } = result;
                this.bpmnViewer.get("canvas").zoom("fit-viewport");
            } catch (err) {
                console.log(err.message, err.warnings);
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
        getFinishColor() {
            return {
                background: this.finishColor
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.crcc-control_header {
    text-align: left;
    padding-left: 32px;

    .color-title {
        display: inline-block;
        line-height: 36px;
        margin-right: 28px;

        .color {
            display: inline-block;
            width: 16px;
            height: 16px;
            // border: 1px solid;
            border-radius: 3px;
            position: relative;
            top: 3px;
            margin-right: 8px;
        }
    }
}
.highlight-overlay{
     background-color: green;    opacity: 0.4;    pointer-events: none;
}
</style>
