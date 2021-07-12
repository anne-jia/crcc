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
    workflowEventBus.$on('message-setting.saved', function(event) {
        eventBus.fire('message-setting.saved', event)
    })
//保存参与者设置
    workflowEventBus.$on('participant.saved', function(event) {
        eventBus.fire('participant.saved', event)
    })

}

PropertiesEventHandlerProvider.$inject = [ 'eventBus' ]

export default PropertiesEventHandlerProvider