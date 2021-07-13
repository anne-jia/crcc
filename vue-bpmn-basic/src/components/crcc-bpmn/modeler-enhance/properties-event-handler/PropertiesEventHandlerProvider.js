import Vue from 'vue'

const workflowEventBus = new Vue();

Vue.$workflowEventBus = workflowEventBus
// 打开消息设置
function PropertiesEventHandlerProvider(eventBus) {
    eventBus.on('message-setting.openning', function(event) {
        workflowEventBus.$emit('message-setting.openning', event)
    })
//打开参与者设置
    eventBus.on('sys-participant.opening', function(event) {
        workflowEventBus.$emit('sys-participant.openning', event)
    })

// 保存消息设置
    workflowEventBus.$on('message-setting.saved', function (result) {
        eventBus.fire('message-setting.saved', { element: result.element, setting: result.setting })
    })
//保存参与者设置
    workflowEventBus.$on('participant.saved', function(result) {
        eventBus.fire('participant.saved',  { element: result.element, participants: result.participants })
    })

}

PropertiesEventHandlerProvider.$inject = [ 'eventBus' ]

export default PropertiesEventHandlerProvider