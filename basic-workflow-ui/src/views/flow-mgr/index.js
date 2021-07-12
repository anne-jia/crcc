import FlowMgr from './src/index'

FlowMgr.install = function (Vue) {
    Vue.component(FlowMgr.name, FlowMgr);
}

export default FlowMgr;