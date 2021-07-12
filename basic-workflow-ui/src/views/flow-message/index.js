import FlowMessage from "./src"

FlowMessage.install = function (Vue) {
    Vue.components(FlowMessage, FlowMessage.name)
}

export default FlowMessage