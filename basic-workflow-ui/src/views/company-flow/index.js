import CompanyFlow from './src/index'

CompanyFlow.install = function (Vue) {
    Vue.component(CompanyFlow.name, CompanyFlow);
}

export default CompanyFlow;