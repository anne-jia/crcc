import { processError } from './ErrorHandler'

export default {

    validate(element) {
        if (element.$type == 'bpmn:UserTask') {
            if (!element.name) {
                processError('用户任务的名称不能为空', element)
            }
            if (element.loopCharacteristics) {
                // 多实例任务必须设置loopByCandidateUser或者loopCandinality
                if (!element.loopCharacteristics.loopCardinality
                    && !element.loopCharacteristics.loopByCandidateUsers) {

                    processError('多实例任务必须设置多实例属性', element)
                }

            }
        }

        // 如果元素有多个outgoing，则检查其是否存在default 或者设置了condition
        if (element.$type != 'bpmn:ParallelGateway' && element.$type != 'bpmn:SequenceFlow') {
            if (element.outgoing && element.outgoing.length > 1 && !element.default) {
                element.outgoing.forEach(flow => {

                    if (!flow.conditionExpression || !flow.conditionExpression.body) {
                        processError('未设置执行条件', flow)
                    }
                })
            }

            // 多个分支时，必须设置每条分支的名称
            if (element.outgoing && element.outgoing.length > 1) {
                element.outgoing.forEach(flow => {
                    if (!flow.name) {
                        processError('未设置分支名称', flow)
                    }
                })
            }
        }

        if (element.$type != 'bpmn:EndEvent' && element.$type != 'bpmn:SequenceFlow') {
            if (!element.outgoing) {
                processError(`${element.$type}类型的元素不能放在流程末尾`, element)
            }
        }

        if (element.$type == 'bpmn:ParallelGateway') {
            // 并行网关新增约束：不能够多进多出
            if (element.outgoing && element.outgoing.length > 1 && element.incoming && element.incoming.length > 1) {
                processError(`${element.$type}类型的元素不能同时有多个入口和多个出口`, element)
            }
        }
    }
}