<template>
  <div class="crcc-process-designer">
    <div class="crcc-process-palette-container">
      <div class="crcc-control_header">
        <slot>
          <!-- 插入自定义的按钮 -->
        </slot>
        <el-Button-group key="file-control">
          <el-Button type="primary" @click="$refs.refFile.click()">
            <svg-icon icon-class="upload"></svg-icon> 导入文件
          </el-Button>
          <el-Button
            type="primary"
            ref="saveDiagram"
            @click="downloadProcessAsBpmn()"
          >
            <svg-icon icon-class="download"></svg-icon>
            导出BPMN
          </el-Button>
          <el-Button type="primary" @click="publishProcess">
            <svg-icon icon-class="checked"></svg-icon>
            发布流程
          </el-Button>
        </el-Button-group>
        <el-Button-group key="stack-control">
          <el-tooltip content="撤销" placement="bottom" effect="light">
            <el-Button plain :disabled="!revocable" @click="processUndo()">
              <svg-icon icon-class="undo"></svg-icon>
            </el-Button>
          </el-tooltip>
          <el-tooltip content="恢复" placement="bottom" effect="light">
            <el-Button plain :disabled="!recoverable" @click="processRedo()">
              <svg-icon icon-class="redo"></svg-icon>
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
        <div
          class="crcc-process-designer__canvas"
          ref="bpmn-canvas"
          id="canvas"
        ></div>
      </div>
    </div>
    <div class="process-panel__container process-panel">
      <div id="js-properties-panel" class="panel"></div>
    </div>
  </div>
</template>

<script>
// 引入相关的依赖
import Modeler from "../modeler-enhance";
import DefaultEmptyXML from "../modeler-enhance/plugins/defaultEmpty";
export default {
  name: "",
  props: {
    value: String, // xml 字符串
    processId: String,
    processName: String,
    flowType:String,
    // copy ,update,create
    status: {
      type: String,
      default: "create"
    },
    prefix: {
      type: String,
      default: "camunda"
    },
    saveType: {
      type: String,
      default: "xml"
    },
    events: {
      type: Array,
      default: () => ["element.click"]
    }
  },
  watch: {
    'processInfo.resourceString': {
      handler(newValue, oldValue) {
        this.createNewDiagram(newValue);
      },
      deep:true,
    }
  },
  mounted() {
    // this.init();
    this.processInfo.resourceString = this.value;
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
      processInfo:{
        resourceString: "",
        resourceName:"",
        name:"",
        source:"vue-modeler"
      }
    };
  },
  // 方法集合
  methods: {
    initBpmnModeler() {
      if (this.bpmnModeler) return;
      this.canvas = this.$refs["bpmn-canvas"];
      this.bpmnModeler = new Modeler({
        container: this.canvas,
        propertiesPanel: {
          parent: "#js-properties-panel"
        }
      });
      this.$emit("init-finished", this.bpmnModeler);
      this.initModelListeners();
    },
    initModelListeners() {
      const EventBus = this.bpmnModeler.get("eventBus");
      const that = this;
      // 注册需要的监听事件, 将. 替换为 - , 避免解析异常
      this.events.forEach(event => {
        EventBus.on(event, function(eventObj) {
          let eventName = event.replace(/\./g, "-");
          let element = eventObj ? eventObj.element : null;
          that.$emit(eventName, element, eventObj);
        });
      });
      // 监听图形改变返回xml
      EventBus.on("commandStack.changed", async event => {
        try {
          this.recoverable = this.bpmnModeler.get("commandStack").canRedo();
          this.revocable = this.bpmnModeler.get("commandStack").canUndo();
          let { xml } = await this.bpmnModeler.saveXML({
            format: true
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
          viewbox
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
      if (!this.bpmnModeler) {
        return;
      }
      try {
        let { warnings } = await this.bpmnModeler.importXML(xmlString);
        if (this.status == "copy" && this.bpmnModeler._definitions) {
          this.bpmnModeler._definitions.rootElements[0].id = newId;
          this.bpmnModeler._definitions.rootElements[0].name = newName;
          try {
            const { err, xml } = await this.bpmnModeler.saveXML();
            this.processInfo.resourceString = xml;
           
          } catch (e) {
            console.error(`${e.message || e}`);
          }
        }
        if (warnings && warnings.length) {
          warnings.forEach(warn => console.warn(warn));
        }
        this.bpmnModeler.get("canvas").zoom("fit-viewport");
      } catch (e) {
        console.error(`${e.message || e}`);
      }
    },
    publishProcess() {
      this.SaveProcess(this.saveType);
    },
    // 下载为bpmn格式,done是个函数，调用的时候传入的
    saveDiagram(done) {
      // 把传入的done再传给bpmn原型的saveXML函数调用
      this.bpmnModeler.saveXML(
        {
          format: true
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
        data: data
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
    // 保存流程图
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
          // this.clearBPMNEdageBounds(xml);
          console.log(xml);

        
      
           let submitValue={
              resourceString: xml,
              resourceName: this.bpmnModeler._definitions.rootElements[0].id+ ".bpmn",
              name:this.bpmnModeler._definitions.rootElements[0].name,
              flowType:this.flowType,
              source:this.processInfo.source
            }
          _this.$emit("publish-process", submitValue);
        } else {
          const { err, svg } = await this.bpmnModeler.saveSVG();
          // 读取异常时抛出异常
          if (err) {
            return console.error(err);
          }
           let submitValue={
              resourceString: xml,
              flowType:this.flowType,
              resourceName: this.bpmnModeler._definitions.rootElements[0].id+ ".svg",
              name:this.bpmnModeler._definitions.rootElements[0].name,
              source:this.processInfo.source
            }
          _this.$emit("publish-process", submitValue);
        }
      } catch (e) {
        console.error(`${e.message || e}`);
      }
    },
    /**
     * 解决部署异常：去掉sequenceflow生成xml中的bounds属性。
     *
     *  --异常信息：org.camunda.bpm.engine.ProcessEngineException: ENGINE-09005 Could not parse BPMN process. Errors:
     *             cvc-complex-type.3.2.2: 元素 'bpmndi:BPMNEdge' 中不允许出现属性 'bounds'
     */

    // clearBPMNEdageBounds(definition) {
    //   if (definition) {
    //     // 通过moddler产生的xml至少能够解析至plane级，所以此处不必判断plane上级是否存在空值
    //     let plane = definition.get("diagrams")[0].plane;
    //     if (plane.planeElement) {
    //       plane.planeElement.forEach(el => {
    //         let attrs = el.$attrs;
    //         if (attrs && attrs.bounds) {
    //           delete attrs.bounds;
    //         }
    //       });
    //     }
    //   }
    // },

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
    }
  }
};
</script>