<template>
    <div class="crcc-process-palette-container">
        <div class="crcc-control_header">
        <slot>
          <!-- 插入自定义的按钮 -->
        </slot>
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
} from "../modeler-readonly/index";
import DefaultEmptyXML from "../modeler-enhance/plugins/defaultEmpty";

export default {
    name: "",
    props: {
        value: String, // xml 字符串
        //流程状态值
        events: {
        type: Array,
        default: () => ["element.click"],
        },
        status: Array,
        showWillColor: {
            type: Boolean,
            default: false,
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
                container: canvas,
            });

            this.initModelListeners();
        },
        initModelListeners() {
            const EventBus = this.bpmnViewer.get("eventBus");
            const that = this;
            // 注册需要的监听事件, 将. 替换为 - , 避免解析异常
            this.events.forEach((event) => {
                EventBus.on(event, function (eventObj) {
                    let eventName = event.replace(/\./g, "-");
                    let element = eventObj ? eventObj.element : null;
                    that.$emit(eventName, element, eventObj);
                });
            });
            // 监听图形改变返回xml
        

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
                this.bpmnViewer.get("canvas").zoom("fit-viewport");
            } catch (err) {
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

.highlight-overlay {
    background-color: green;
    opacity: 0.4;
    pointer-events: none;
}
</style>
