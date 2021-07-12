import BpmnViewer from './views/bpmn-viewer'
import TaskList from './views/task-list'
import FlowViewer from "./views/task-list/src/components/index"

const components = [
    BpmnViewer,
    TaskList,
    FlowViewer
]

const install = function (Vue) {
    components.forEach(component => {
        Vue.component(component.name, component);
    });
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default {
    install
}

export {
    BpmnViewer,
    TaskList,
    FlowViewer
}