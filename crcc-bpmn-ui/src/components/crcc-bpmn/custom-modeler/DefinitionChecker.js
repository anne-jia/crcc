import ErrorHandler, { error } from './element-validator/ErrorHandler'
import Validators from './element-validator'

var hasTraveled = {};
var parallelGatewayCheck = 0;

function traverseElements(element) {
    if (!hasTraveled[element.id]) {
        hasTraveled[element.id] = true;

        checkElement(element);

        if (element.outgoing && element.outgoing.length > 0) {
            element.outgoing.forEach(el => traverseElements(el))
        }

        if (element.targetRef) {
            traverseElements(element.targetRef)
        }
    }
}


function checkElement(element) {
    if (element.$type == 'bpmn:ParallelGateway') {
        parallelGatewayCheck -= (element.incoming ? element.incoming.length : 0);
        parallelGatewayCheck += (element.outgoing ? element.outgoing.length : 0)
    }
    Validators.forEach(validator => validator.validate(element));
}

export default function check(definition) {
    hasTraveled = {};
    parallelGatewayCheck = 0;
    ErrorHandler.clear();

    var process = definition.rootElements[0];
    if (!process.name || !process.name.trim()) {
        error('流程名称不能为空', process)
    }

    if (process.flowElements && process.flowElements.length > 0) {
        var flowElements = process.flowElements;
        var startElement = flowElements.filter(el => el.$type == 'bpmn:StartEvent');
        if (startElement.length == 0) {
            error('未定义开始事件', process)
        } else if (startElement.length > 1) {
            error('存在多个开始事件', process)
        } else {
            traverseElements(startElement[0]);

            if (parallelGatewayCheck != 0) {
                error('并行网关区域绘制错误，请检查', process);
            }

            // 是否存在零散节点
            var notIncluded = flowElements.filter(el => !hasTraveled[el.id]);
            if (notIncluded.length > 0) {
                notIncluded.forEach(el => error('元素未被包含在主流程中', el))
            }
        }
    } else {
        error('流程定义没有内容', process)
    }
    return ErrorHandler.getErrors()
}