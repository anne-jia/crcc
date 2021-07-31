import Vue from 'vue'

const workflowEventBus = new Vue();

// Vue.$workflowEventBus = workflowEventBus
Vue.prototype.$workflowEventBus=workflowEventBus
// 打开消息设置
function PropertiesEventHandlerProvider(eventBus) {
    eventBus.on('opening-message', function(event) {
        workflowEventBus.$emit('opening-message', event)
    })
//打开参与者设置
    eventBus.on('opening-participant', function(event) {
        workflowEventBus.$emit('opening-participant', event)
    })

// 保存消息设置
    workflowEventBus.$on('saved-message', function (result) {
        eventBus.fire('saved-message', { element: result.element, setting: result.setting })
    })
//保存参与者设置
    workflowEventBus.$on('saved-participant', function(result) {
        eventBus.fire('saved-participant',  { element: result.element, participants: result.participants })
    })

}

PropertiesEventHandlerProvider.$inject = [ 'eventBus' ]

export default PropertiesEventHandlerProvider