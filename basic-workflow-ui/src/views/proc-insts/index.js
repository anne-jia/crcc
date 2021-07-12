import ProcInsts from "./src"

ProcInsts.install = function (Vue) {
    Vue.component(ProcInsts.name, ProcInsts)
}

export default ProcInsts