
import '@crcc/bpmn-basic/dist/bpmn-basic.css'
import '@/styles/crcc-element/index.scss'
import '@/icons'


import ProcessBpmn from "@/views/process-bpmn/index.vue"
import TakePartInSetting from "@/views/process-bpmn/components/take-part-in-setting.vue"
import MessageSetting from "@/views/process-bpmn/components/message-setting.vue"
import ProcessDeal from "@/views/process-deal/process-deal.vue"
import ProcessSetting from "@/views/process-deal/process-setting.vue"
import ProcessView from "@/views/process-deal/process-view.vue"
import ProcessDefinition from "@/views/process-definition/index.vue"
import ProcessInstanceList from "@/views/process-instance-list/index.vue"
import ProcessPermissions from "@/views/process-permissions/index.vue"
import ProcessTaskList from "@/views/process-task-list/index.vue"
import ProcessTypes from "@/views/process-types/index.vue"
import crccCard from "@/components/crcc-main/crcc-card/index.vue";
import crccMain from '@/components/crcc-main'
const components = [
    ProcessBpmn,
    TakePartInSetting,
    MessageSetting,
    ProcessDeal,
    ProcessSetting,
    ProcessView,
    ProcessDefinition,
    ProcessInstanceList,
    ProcessPermissions,
    ProcessTaskList,
  ProcessTypes,
  crccCard,
  crccMain
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
    ProcessBpmn,
    TakePartInSetting,
    MessageSetting,
    ProcessDeal,
    ProcessSetting,
    ProcessView,
    ProcessDefinition,
    ProcessInstanceList,
    ProcessPermissions,
    ProcessTaskList,
  ProcessTypes,
  crccCard,
  crccMain
  }
  export {
    install,
    ProcessBpmn,
    TakePartInSetting,
    MessageSetting,
    ProcessDeal,
    ProcessSetting,
    ProcessView,
    ProcessDefinition,
    ProcessInstanceList,
    ProcessPermissions,
    ProcessTaskList,
    ProcessTypes
  }









