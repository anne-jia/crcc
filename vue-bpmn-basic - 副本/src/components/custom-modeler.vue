<template>
  <div class="crcc-process-designer">
    <div class="crcc-process-palette-container">
      <div class="crcc-control_header">
          <slot >
              <!-- 插入自定义的按钮 -->
          </slot>
        <el-Button-group key="file-control">
          <el-Button type="primary" icon="upload" @click="$refs.refFile.click()"
            >导入文件
          </el-Button>
          <el-Button
            type="primary"
            icon="download"
            ref="saveDiagram"
            @click="downloadProcessAsBpmn()"
            >导出BPMN</el-Button
          >
          <el-Button type="primary" icon="checked" @click="publishProcess">发布流程</el-Button>
        </el-Button-group>
        <el-Button-group key="stack-control">
          <el-tooltip content="撤销" placement="bottom" effect="light">
            <el-Button
              plain
              icon="undo"
              :disabled="!revocable"
              @click="processUndo()"
            ></el-Button>
          </el-tooltip>
          <el-tooltip content="恢复" placement="bottom" effect="light">
            <el-Button
              plain
              icon="redo"
              :disabled="!recoverable"
              @click="processRedo()"
            >
            </el-Button>
          </el-tooltip>
        </el-Button-group>
        <input
          type="file"
          id="files"
          ref="refFile"
          style="display: none"
          accept=".xml, .bpmn"
          @change="importLocalFile"
        />
      </div>
      <div class="crcc-process-designer__container">
        <div class="crcc-process-designer__canvas" ref="bpmn-canvas"></div>
      </div>
    </div>
    <div class="process-panel__container process-panel">
      <div id="js-properties-panel" class="panel"></div>
    </div>
  </div>
</template>

<script>
// 引入相关的依赖
import Modeler from "./modeler-enhance";
import DefaultEmptyXML from "@/components/modeler-enhance/plugins/defaultEmpty";
export default {
  name: "",
  props: {
    value: String, // xml 字符串
    processId: String,
    processName: String,
    prefix: {
      type: String,
      default: "camunda"
    },
    saveType:{
      type:String,
      default:'xml',
    },
    events: {
      type: Array,
      default: () => ["element.click"],
    },
  },
  components: {},
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 载入后, Vue 实例挂载到实际的 DOM 操作完成，一般在该过程进行 Ajax 交互
  mounted() {
    // this.init();
    this.initBpmnModeler();
    this.createNewDiagram(this.value);
      this.$once("hook:beforeDestroy", () => {
      if (this.bpmnModeler) this.bpmnModeler.destroy();
      this.$emit("destroy", this.bpmnModeler);
      this.bpmnModeler = null;
    });
  },
  data() {
    return {
      // bpmn建模器
      bpmnModeler: null,
      container: null,
      canvas: null,
      recoverable: false,
      revocable: false,
    };
  },
  // 方法集合
  methods: {
    initBpmnModeler() {
      if (this.bpmnModeler) return;
      this.bpmnModeler = new Modeler({
        container: this.$refs["bpmn-canvas"],
        propertiesPanel: {
          parent: "#js-properties-panel",
        },
      });
      this.$emit("init-finished", this.bpmnModeler);
      this.initModelListeners();
    },

    initModelListeners() {
      const EventBus = this.bpmnModeler.get("eventBus");
      const that = this;
      // 注册需要的监听事件, 将. 替换为 - , 避免解析异常
      this.events.forEach((event) => {
        EventBus.on(event, function(eventObj) {
          let eventName = event.replace(/\./g, "-");
          let element = eventObj ? eventObj.element : null;
            that.$emit(eventName, element, eventObj);
        });
      });
      // 监听图形改变返回xml
      EventBus.on("commandStack.changed", async (event) => {
        try {
          this.recoverable = this.bpmnModeler.get("commandStack").canRedo();
          this.revocable = this.bpmnModeler.get("commandStack").canUndo();
          let { xml } = await this.bpmnModeler.saveXML({
            format: true,
          });
          this.$emit("commandStack-changed", event);
          this.$emit("input", xml);
          this.$emit("change", xml);
        } catch (e) {
          console.error(`${e.message || e}`);
        }
      });
      // 监听视图缩放变化
      this.bpmnModeler.on("canvas.viewbox.changed", ({ viewbox }) => {
        this.$emit("canvas-viewbox-changed", {
          viewbox,
        });
        const { scale } = viewbox;
        this.defaultZoom = Math.floor(scale * 100) / 100;
      });   

    },

    /* 创建新的流程图 */
    async createNewDiagram(xml) {
      // 将字符串转换成图显示出来
      let newId = this.processId || `Process_${new Date().getTime()}`;
      let newName = this.processName || `业务流程_${new Date().getTime()}`;
      let xmlString = xml || DefaultEmptyXML(newId, newName, this.prefix);
      try {
        let { warnings } = await this.bpmnModeler.importXML(xmlString);
        if (warnings && warnings.length) {
          warnings.forEach((warn) => console.warn(warn));
        }
      } catch (e) {
        console.error(`${e.message || e}`);
      }
    },
    publishProcess(){
      this.SaveProcess(this.saveType);
    },

    // 下载为bpmn格式,done是个函数，调用的时候传入的
    saveDiagram(done) {
      // 把传入的done再传给bpmn原型的saveXML函数调用
      this.bpmnModeler.saveXML(
        {
          format: true,
        },
        function(err, xml) {
          done(err, xml);
        }
      );
    },
    // 根据所需类型进行转码并返回下载地址
    setEncoded(type, filename = "diagram", data) {
      const encodedData = encodeURIComponent(data);
      return {
        filename: `${filename}.${type}`,
        href: `data:application/${
          type === "svg" ? "text/xml" : "bpmn20-xml"
        };charset=UTF-8,${encodedData}`,
        data: data,
      };
    },

    importLocalFile() {
      const that = this;
      const file = this.$refs.refFile.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function() {
        let xmlStr = this.result;
        that.createNewDiagram(xmlStr);
      };
    },
    downloadProcessAsBpmn() {
      this.downloadProcess("bpmn");
    },
        // 下载流程图到本地
    async SaveProcess(type) {
      try {
        const _this = this;
        // 按需要类型创建文件并下载
        if (type === "xml" || type === "bpmn") {
          const { err, xml } = await this.bpmnModeler.saveXML();
          // 读取异常时抛出异常
          if (err) {
           return console.error(`${err.message || err}`);
          }
         _this.$emit('publish-process',xml);
        } else {
          const { err, svg } = await this.bpmnModeler.saveSVG();
          // 读取异常时抛出异常
          if (err) {
            return console.error(err);
          }
         _this.$emit('publish-process',svg);
        }
      } catch (e) {
        console.error(`${e.message || e}`);
      }
    },
    // 下载流程图到本地
    async downloadProcess(type, name) {
      try {
        const _this = this;
        // 按需要类型创建文件并下载
        if (type === "xml" || type === "bpmn") {
          const { err, xml } = await this.bpmnModeler.saveXML();
          // 读取异常时抛出异常
          if (err) {
            console.error(`${err.message || err}`);
          }
          let { href, filename } = _this.setEncoded(
            type.toUpperCase(),
            name,
            xml
          );
          downloadFunc(href, filename);
        } else {
          const { err, svg } = await this.bpmnModeler.saveSVG();
          // 读取异常时抛出异常
          if (err) {
            return console.error(err);
          }
          let { href, filename } = _this.setEncoded("SVG", name, svg);
          downloadFunc(href, filename);
        }
      } catch (e) {
        console.error(`${e.message || e}`);
      }
      // 文件下载方法
      function downloadFunc(href, filename) {
        if (href && filename) {
          let a = document.createElement("a");
          a.download = filename; //指定下载的文件名
          a.href = href; //  URL对象
          a.click(); // 模拟点击
          URL.revokeObjectURL(a.href); // 释放URL 对象
        }
      }
    },
    processRedo() {
      this.bpmnModeler.get("commandStack").redo();
    },
    processUndo() {
      this.bpmnModeler.get("commandStack").undo();
    },
    processReZoom() {
      this.defaultZoom = 1;
      this.bpmnModeler.get("canvas").zoom("fit-viewport");
    },
  },
  // 计算属性
  computed: {},

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
