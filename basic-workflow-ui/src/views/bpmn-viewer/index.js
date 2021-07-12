import BpmnViewer from './src/BpmnViewer'

BpmnViewer.install = function (Vue) {
    Vue.component(BpmnViewer.name, BpmnViewer);
}

export default BpmnViewer;