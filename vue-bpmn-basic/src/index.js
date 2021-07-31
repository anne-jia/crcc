import CustomModeler from '@/components/crcc-bpmn/custom-modeler/custom-modeler.vue'
import ModelerSettingControl from '@/components/crcc-bpmn/modeler-setting-control/index.vue'
import ModelerView from '@/components/crcc-bpmn/modeler-view/modeler-view.vue'
// import {workflowEventBus} from './components/crcc-bpmn/modeler-enhance/properties-event-handler/PropertiesEventHandlerProvider.js'
import 'normalize.css/normalize.css'

//Begin 以下为bpmn工作流绘图工具的样式
import 'bpmn-js/dist/assets/diagram-js.css' // 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
//End 以下为bpmn工作流绘图工具的样式

import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css' // 右边属性面板样式

import 'styles/crcc-bpmn/index.scss'

const components = [
  CustomModeler,
  ModelerSettingControl,
  ModelerView,
];
const install = function (Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
  

};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
};

export default {
  install,
  CustomModeler,
  ModelerSettingControl,
  ModelerView,
  // workflowEventBus
}