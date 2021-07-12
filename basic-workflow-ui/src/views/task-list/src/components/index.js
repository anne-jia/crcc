import FlowViewer from "./flow-viewer-ex"

FlowViewer.install = function (Vue) {
    Vue.component(FlowViewer.name, FlowViewer)
}

export default FlowViewer