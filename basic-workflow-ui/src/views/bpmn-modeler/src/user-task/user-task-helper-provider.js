import Vue from 'vue'
const localBus = new Vue();

function UserTaskHelpProvider(eventBus) {
    // 参与者
    eventBus.on('participant.select', function (e) {
        localBus.$emit('sys-participant-select', { element: e.element, participants: e.participants })
    })

    localBus.$on('on-participant-saved', function (result) {
        eventBus.fire('participant.saved', { element: result.element, participants: result.participants })
    })

    // 站内信
    eventBus.on('message-setting.openning', function (e) {
        localBus.$emit('on-message-setting-open', { element: e.element, setting: e.setting })
    })

    localBus.$on('on-message-setting-save', function (result) {
        eventBus.fire('message-setting.saved', { element: result.element, jsonEntity: result.setting })
    })
}

UserTaskHelpProvider.$inject = ['eventBus']

const userTaskHelpProviderModule = {
    __init__: ['userTaskHelpProvider'],
    userTaskHelpProvider: ['type', UserTaskHelpProvider]
}

export {
    userTaskHelpProviderModule,
    localBus
}