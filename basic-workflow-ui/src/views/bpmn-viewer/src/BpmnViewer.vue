<template>
  <div class="container viewer">
    <div class="canvas" ref="canvas"></div>
  </div>
</template>

<script>
import BpmnViewer from "@linto/basic-bpmn-js/lib/LintoViewer";
import BpmnModdle from "bpmn-moddle";
import CamundaService from "@/api/camunda-service";

export default {
  name: "BpmnViewer",

  data() {
    return {
      viewer: null,
      bpmnModdle: null,
      instanceId: null,
      taskInstanceId: null
    };
  },

  methods: {
    importXML(diagramXml, markElments) {
      this.bpmnModdle.fromXML(diagramXml, (err, definition) => {
        if (err) {
          this.$emit("viewer-error", err);
          return;
        }
        if (markElments) {
          markElments.forEach(el => {
            let element = this.findModdeElement(definition, el.task);
            this.markElement(
              element,
              el.state == "finished" ? "#9ae69a" : "green",
              el.state == "finished" ? "#ffffd3" : "yellow"
            );
          });
        }
        this.bpmnModdle.toXML(definition, (err, xml) => {
          if (err) {
            this.$emit("viewer-error", err);
            return;
          }
          var finnalXml = xml;
          this.viewer.importXML(finnalXml, err => {
            if (err) {
              this.$emit("viewer-error", err);
            }
          });
        });
      });
    },

    findModdeElement(definition, bpmnElementId) {
      if (definition) {
        // 通过moddler产生的xml至少能够解析至plane级，所以此处不必判断plane上级是否存在空值
        let plane = definition.get("diagrams")[0].plane;
        if (plane.planeElement) {
          let elements = plane.planeElement.filter(
            el => el.bpmnElement && el.bpmnElement.id == bpmnElementId
          );
          return elements.length > 0 ? elements[0] : null;
        }
      }
    },

    markElement(el, borderColor, bodyColor) {
      borderColor = borderColor ? borderColor : "yellow";
      el.stroke = borderColor;
      if (bodyColor) {
        el.fill = bodyColor;
      }
    },

    showIns(instanceId) {
      CamundaService.loadInstanceInfo(instanceId)
        .then(ins => {
          if (ins.definition) {
            ins.status = ins.status ? ins.status : [];
            this.importXML(ins.definition, ins.status);
          }
        })
        .catch(() => {
          this.error("流程加载失败");
        });
    }
  },

  mounted() {
    this.viewer = new BpmnViewer({
      container: this.$refs.canvas
    });
    this.bpmnModdle = new BpmnModdle();
  }
};
</script>

<style lang="scss">
.container.viewer {
  position: relative;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  /* height: calc(100vh - 120px); */
  height: 2000px;
  width: 2000px;
  // border: 1px solid #ebeef5;

  .canvas {
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
    user-select: none;
  }
}
</style>
