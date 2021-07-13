import WorkflowModeler from '@/components/crcc-bpmn/custom-modeler.vue'
const install = function(Vue) {
    Vue.component("workflow-modeler", WorkflowModeler);
  };
  
  if (typeof window !== "undefined" && window.Vue) {
    install(window.Vue);
  }
  
export default {
    install,
  };
export {
    WorkflowModeler
}