import BpmnModeler from './src/BpmnModeler';

BpmnModeler.install = function (Vue) {
    Vue.component(BpmnModeler.name, BpmnModeler);
}

export default BpmnModeler