<template>
    <div class="crcc-process-designer">
        <div class="crcc-process-palette-container">
            <div class="crcc-control_header">
                <el-Button-group key="file-control">
                    <el-Button type="primary" icon="el-icon-folder-opened">打开文件</el-Button>
                    <el-tooltip placement="bottom" effect="light">
                        <div slot="content">
                            <el-Button type="text">下载为XML文件</el-Button>
                            <br />
                            <el-Button type="text">下载为SVG文件</el-Button>
                            <br />
                            <el-Button type="text">下载为BPMN文件</el-Button>
                            <br />
                        </div>
                        <el-Button type="primary" icon="el-icon-download">下载文件</el-Button>

                    </el-tooltip>
                    <el-tooltip placement="bottom" effect="light">
                        <div slot="content">
                            <el-Button type="text">预览XML</el-Button>
                            <br />
                            <el-Button type="text">预览BPMN</el-Button>
                            <br />
                        </div>
                        <el-Button type="primary" icon="el-icon-view">预览</el-Button>
                    </el-tooltip>
                    <el-Button type="primary" icon="el-icon-document-checked" ref="saveDiagram">保存文件</el-Button>

                </el-Button-group>
                <!-- <el-Button-group key="align-control">
                    <el-tooltip effect="light" content="向左对齐">
                        <el-Button :size="headerButtonSize" class="align align-left" icon="el-icon-s-data" @click="elementsAlign('left')" />
                    </el-tooltip>
                    <el-tooltip effect="light" content="向右对齐">
                        <el-Button :size="headerButtonSize" class="align align-right" icon="el-icon-s-data" @click="elementsAlign('right')" />
                    </el-tooltip>
                    <el-tooltip effect="light" content="向上对齐">
                        <el-Button :size="headerButtonSize" class="align align-top" icon="el-icon-s-data" @click="elementsAlign('top')" />
                    </el-tooltip>
                    <el-tooltip effect="light" content="向下对齐">
                        <el-Button :size="headerButtonSize" class="align align-bottom" icon="el-icon-s-data" @click="elementsAlign('bottom')" />
                    </el-tooltip>
                    <el-tooltip effect="light" content="水平居中">
                        <el-Button :size="headerButtonSize" class="align align-center" icon="el-icon-s-data" @click="elementsAlign('center')" />
                    </el-tooltip>
                    <el-tooltip effect="light" content="垂直居中">
                        <el-Button :size="headerButtonSize" class="align align-middle" icon="el-icon-s-data" @click="elementsAlign('middle')" />
                    </el-tooltip>
                </el-Button-group> -->
                <el-Button-group key="scale-control">
                    <el-tooltip content="缩小视图" placement="bottom" effect="light">
                        <el-Button plain>
                            <svg-icon icon-class="test"></svg-icon>
                        </el-Button>
                    </el-tooltip>
                    <el-Button plain>100%</el-Button>
                    <el-tooltip content="放大视图" placement="bottom" effect="light">
                        <el-Button plain icon="el-icon-zoom-in"></el-Button>
                    </el-tooltip>
                    <el-tooltip content="重置视图并居中" placement="bottom" effect="light">
                        <el-Button plain icon="el-icon-c-scale-to-original"></el-Button>
                    </el-tooltip>
                </el-Button-group>
                <el-Button-group key="stack-control">
                    <el-tooltip content="撤销" placement="bottom" effect="light">
                        <el-Button plain icon="el-icon-refresh-left"></el-Button>
                    </el-tooltip>
                    <el-tooltip content="恢复" placement="bottom" effect="light">
                        <el-Button plain icon="el-icon-refresh-right"></el-Button>
                    </el-tooltip>
                    <el-tooltip content="重新绘制" placement="bottom" effect="light">
                        <el-Button plain icon="el-icon-refresh"></el-Button>
                    </el-tooltip>
                </el-Button-group>
            </div>
            <div class="crcc-process-designer__container">
                <div class="crcc-process-designer__canvas" ref="canvas"></div>
            </div>
        </div>
        <div class="process-panel__container process-panel">
            <div id="js-properties-panel" class="panel"></div>
        </div>
    </div>
</template>

<script>
// 引入相关的依赖
import {
    xmlStr
} from "../mock/xmlStr";
import Modeler from "./modeler-enhance";
import Vue from 'vue'
export default {
    name: "",
    components: {},
    // 生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
    mounted() {
        this.init();
    },
    data() {
        return {
            // bpmn建模器
            bpmnModeler: null,
            container: null,
            canvas: null,
        };
    },
    // 方法集合
    methods: {
        init() {
            // 获取到属性ref为“canvas”的dom节点
            const canvas = this.$refs.canvas;
            // 建模
            this.bpmnModeler = new Modeler({
                container: canvas,
                //添加控制板
                propertiesPanel: {
                    parent: "#js-properties-panel",
                }
            });
            this.createNewDiagram();
            Vue.$workflowEventBus.$on('message-setting.openning', function (e) {
            })
        },
        createNewDiagram() {
            // 将字符串转换成图显示出来
            this.bpmnModeler.importXML(xmlStr, (err) => {
                if (err) {
                    // console.error(err)
                } else {
                    // 这里是成功之后的回调, 可以在这里做一系列事情
                    this.success();
                    const elementRegistry = this.bpmnModeler.get("elementRegistry");
                    const modeling = this.bpmnModeler.get("modeling");
                    var task = elementRegistry.get('Activity_069o9xg');
                    modeling.setColor(task, {
                        fill: '#ff0000',
                        stroke: null
                    })
                    modeling.updateProperties(task, {
                        "gavin-hello": [{
                            "demo": {
                                "hello": "123"
                            }
                        }]

                    })
                }
            });
        },
        success() {
            this.addBpmnListener();
            this.addEventBusListener();
        },
        addEventBusListener() {
            // 监听 element
            let that = this;
            const eventBus = this.bpmnModeler.get("eventBus");
            const modeling = this.bpmnModeler.get("modeling");
            const elementRegistry = this.bpmnModeler.get("elementRegistry");
            const eventTypes = ["element.click", "element.changed"];
            eventTypes.forEach(function (eventType) {
                eventBus.on(eventType, function (e) {
                    if (!e || e.element.type == "bpmn:Process") return;
                    if (eventType === "element.changed") {
                        // that.elementChanged(e)
                    } else if (eventType === "element.click") {
                        var shape = e.element ? elementRegistry.get(e.element.id) : e.shape;
                        if (shape.type === "bpmn:StartEvent") {
                            // modeling.updateProperties(shape, {
                            //   name: "我是修改后的虚线节点",
                            //   isInterrupting: false,
                            //   customText: "我是自定义的text属性",
                            // });
                            modeling.setColor(shape, {
                                fill: '#ff0000',
                                stroke: null
                            })
                        }
                    }
                });
            });
        },
        close() {
            // window.localStorage.setItem('nodeVisible', 'false')
            this.TOGGLENODEVISIBLE(false);
        },
        addBpmnListener() {
            const that = this;
            // 获取a标签dom节点
            const downloadLink = this.$refs.saveDiagram;
            // 给图绑定事件，当图有发生改变就会触发这个事件
            this.bpmnModeler.on("commandStack.changed", function () {
                that.saveDiagram(function (err, xml) {
                    that.setEncoded(downloadLink, "diagram.bpmn", err ? null : xml);
                });
            });
        },
        // 下载为bpmn格式,done是个函数，调用的时候传入的
        saveDiagram(done) {
            // 把传入的done再传给bpmn原型的saveXML函数调用
            this.bpmnModeler.saveXML({
                format: true
            }, function (err, xml) {
                done(err, xml);
            });
        },
        // 当图发生改变的时候会调用这个函数，这个data就是图的xml
        setEncoded(link, name, data) {
            // 把xml转换为URI，下载要用到的
            const encodedData = encodeURIComponent(data);
            // 下载图的具体操作,改变a的属性，className令a标签可点击，href令能下载，download是下载的文件的名字
            console.log(link, name, data);
            let xmlFile = new File([data], "test.bpmn");
            if (data) {
                link.className = "active";
                link.href = "data:application/bpmn20-xml;charset=UTF-8," + encodedData;
                link.download = name;
            }
        },
    },
    // 计算属性
    computed: {

    },
};
</script>

<style scoped>
/* .containers {
  background-color: #ffffff;
  width: 100%;
  height: calc(100vh - 52px);
}
.canvas {
  width: 100%;
  height: 100%;
}
.panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
}
.buttons {
  position: absolute;
  left: 20px;
  bottom: 20px;
}
.buttons li {
  display: inline-block;
  margin: 5px;
}
.buttons li a {
  color: #999;
  background: #eee;
  cursor: not-allowed;
  padding: 8px;
  border: 1px solid #ccc;
  text-decoration: none;
}
.buttons li a.active {
  color: #333;
  background: #fff;
  cursor: pointer;
}
.modal {
  background-color: rgba(0, 0, 0, 0.6);
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
.modal-content {
  width: 100%;
  height: 100%;
  position: relative;
}
.modal-ctx {
  position: absolute;
  width: 300px;
  height: 250px;
  background-color: #fff;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0px 0px 5px 2px rgba(225, 225, 225, 0.8);
}
.modal-item {
  padding: 10px;
  width: 100%;
} */
</style>
