<template>
  <div class="container modeler">
    <div class="canvas" ref="canvas"></div>
    <div class="properties-panel-parent">
      <el-scrollbar wrapStyle="overflow-x:hidden;" style="height: 100%">
        <div ref="properties"></div>
      </el-scrollbar>
    </div>
    <div class="tool-box">
      <el-button-group>
        <el-button icon="el-icon-back" @click="complete">返回</el-button>
        <el-button icon="el-icon-upload2" @click="deploy">发布</el-button>
      </el-button-group>
    </div>
    <participant-help ref="prtHelp" @on-participant-set-finished="onParticipantSave"></participant-help>
    <error-dialog ref="errorDlg"></error-dialog>
    <flow-message ref="mstHelp" @on-message-set-finished="onMessageSettingSave"></flow-message>
  </div>
</template>

<script>
import BpmnModeler from "@linto/basic-bpmn-js/lib/LintoModeler";
// 引入css
import "@linto/basic-bpmn-js/dist/assets/diagram-js.css";
import "@linto/basic-bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "@linto/basic-bpmn-js/dist/assets/bpmn-js-properties-panel.css";

import BpmnModdle from "bpmn-moddle";
import FlowService from "@/api/flow-mgr-service";
import {
  userTaskHelpProviderModule,
  localBus
} from "./user-task/user-task-helper-provider";

import ParticipantHelp from "@/views/participant";
import checkDefinition from "./DefinitionChecker";
import ErrorDialog from "./components/ErrorDialog";
import FlowMessage from "@/views/flow-message";

export default {
  name: "BpmnModeler",

  components: {
    ParticipantHelp,
    ErrorDialog,
    FlowMessage
  },

  data() {
    return {
      modeler: null,
      bpmnModdle: null,
      flowTypeId: ""
    };
  },

  methods: {
    createDiagram(flowInfo, done) {
      let processKey = flowInfo.flowCode;
      let processName = flowInfo.flowName;
      this.flowTypeId = flowInfo.typeId;

      let initialDiagram = `<?xml version="1.0" encoding="UTF-8"?>
      <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
      xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
      xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
      xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
      id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="2.2.4">
        <bpmn:process id="${processKey}" name="${processName}" isExecutable="true">
          <bpmn:startEvent id="StartEvent_1" />
        </bpmn:process>
        <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${processKey}">
            <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
              <dc:Bounds x="179" y="102" width="36" height="36" />
            </bpmndi:BPMNShape>
          </bpmndi:BPMNPlane>
        </bpmndi:BPMNDiagram>
      </bpmn:definitions>`;

      return this.modeler.importXML(initialDiagram, function() {
        if (typeof done === "function") {
          done();
        }
      });
    },

    editDiagram(flowDef, done) {
      this.flowTypeId = flowDef.typeId;
      FlowService.getFlowXml(flowDef.procDefId).then(xml => {
        this.modeler.importXML(xml, function() {
          if (typeof done === "function") {
            done();
          }
        });
      });
    },

    copyDiagram(flowInfo, done) {
      const setDefinitionInfo = function(definition, flowInfo) {
        let rootElement = definition.rootElements[0];
        rootElement.id = flowInfo.flowCode;
        rootElement.name = flowInfo.flowName;
      };

      this.flowTypeId = flowInfo.typeId;
      FlowService.getFlowXml(flowInfo.flowToCopy.procDefId).then(xml => {
        this.bpmnModdle.fromXML(xml, (err, definition) => {
          setDefinitionInfo(definition, flowInfo);
          this.bpmnModdle.toXML(definition, { format: true }, (err, xml) => {
            this.modeler.importXML(xml, function() {
              if (typeof done === "function") {
                done();
              }
            });
          });
        });
      });
    },

    exportXML(done) {
      if (done) {
        this.modeler.saveXML({ format: true }, function(err, xml) {
          done(err, xml);
        });
      }
    },

    getDeployInfo(done) {
      this.exportXML((err, xml) => {
        this.bpmnModdle.fromXML(xml, (err, definition) => {
          // 处理bounds异常
          this.clearBPMNEdageBounds(definition);
          // 流程校验
          let defintionErrors = checkDefinition(definition);
          if (defintionErrors.length > 0) {
            this.$refs.errorDlg.showErrors(defintionErrors);
            done("error");
            return;
          }

          this.bpmnModdle.toXML(definition, (err, xml) => {
            // 构建部署信息
            var deployInfo = {
              name: definition.rootElements[0].name,
              source: "vue-modeler",
              resourceName: definition.rootElements[0].id + ".bpmn",
              resourceString: xml
            };
            done(deployInfo);
          });
        });
      });
    },

    /**
     * 解决部署异常：去掉sequenceflow生成xml中的bounds属性。
     *
     *  --异常信息：org.camunda.bpm.engine.ProcessEngineException: ENGINE-09005 Could not parse BPMN process. Errors:
     *             cvc-complex-type.3.2.2: 元素 'bpmndi:BPMNEdge' 中不允许出现属性 'bounds'
     */
    clearBPMNEdageBounds(definition) {
      if (definition) {
        // 通过moddler产生的xml至少能够解析至plane级，所以此处不必判断plane上级是否存在空值
        let plane = definition.get("diagrams")[0].plane;
        if (plane.planeElement) {
          plane.planeElement.forEach(el => {
            let attrs = el.$attrs;
            if (attrs && attrs.bounds) {
              delete attrs.bounds;
            }
          });
        }
      }
    },

    deploy() {
      this.getDeployInfo(deployInfo => {
        if (deployInfo == "error") {
          return;
        }
        deployInfo.flowType = this.flowTypeId;
        FlowService.deployFlow(deployInfo)
          .then(() => {
            this.info("部署完成");
          })
          .catch(err => {
            this.error(err.message[0]);
          });
      });
    },

    complete() {
      this.$emit("flow-edit-complete", this.flowTypeId);
    },

    onParticipantSave(result) {
      localBus.$emit("on-participant-saved", result);
    },

    onMessageSettingSave(result) {
      localBus.$emit("on-message-setting-save", result);
    }
  },

  mounted() {
    this.modeler = new BpmnModeler({
      container: this.$refs.canvas,
      propertiesPanel: {
        parent: this.$refs.properties
      },
      additionalModules: [userTaskHelpProviderModule]
    });
    this.bpmnModdle = new BpmnModdle();

    localBus.$on("sys-participant-select", oldValue => {
      this.$refs.prtHelp.showHelp(oldValue);
    });

    localBus.$on("on-message-setting-open", oldValue => {
      this.$refs.mstHelp.showHelp(oldValue);
    });
  }
};
</script>

<style lang="scss">
.container.modeler {
  position: absolute;
  font-size: 12px;
  height: calc(100vh - 120px);
  background: #fff;
  z-index: 10;
  left: 0;
  right: 0;
  transition: left 0.28s;
  overflow: hidden;

  .canvas {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 320px;
    bottom: 0px;
    border: 1px solid #ebeef5;
  }

  .properties-panel-parent {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 320px;
    bottom: 0px;
    border: 1px solid #ebeef5;
    border-left: none;
  }

  .tool-box {
    position: absolute;
    top: 15px;
    right: 340px;
  }
}
</style>

