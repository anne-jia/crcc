
export var TASK = [{
    label: 'User Task',
    actionName: 'replace-with-user-task',
    className: 'bpmn-icon-user-task',
    target: {
        type: 'bpmn:UserTask'
    }
}];
export var GATEWAY = [{
        label: 'Exclusive Gateway',
        actionName: 'replace-with-exclusive-gateway',
        className: 'bpmn-icon-gateway-xor',
        target: {
            type: 'bpmn:ExclusiveGateway'
        }
    },
    {
        label: 'Parallel Gateway',
        actionName: 'replace-with-parallel-gateway',
        className: 'bpmn-icon-gateway-parallel',
        target: {
            type: 'bpmn:ParallelGateway'
        }
    },
    {
        label: 'Inclusive Gateway',
        actionName: 'replace-with-inclusive-gateway',
        className: 'bpmn-icon-gateway-or',
        target: {
            type: 'bpmn:InclusiveGateway'
        }
    }
]

export var START_EVENT = [{
    label: 'Start Event',
    actionName: 'replace-with-none-start',
    className: 'bpmn-icon-start-event-none',
    
    target: {
        type: 'bpmn:StartEvent'
    }
}]

export var END_EVENT = [{
    label: 'End Event',
    actionName: 'replace-with-none-end',
    className: 'bpmn-icon-end-event-none',
    target: {
        type: 'bpmn:EndEvent'
    }
}]