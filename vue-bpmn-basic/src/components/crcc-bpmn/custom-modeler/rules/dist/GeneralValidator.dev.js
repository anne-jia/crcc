"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ErrorHandler = require("./ErrorHandler");

var _default = {
  validate: function validate(element) {
    if (element.$type == 'bpmn:UserTask') {
      if (!element.name) {
        (0, _ErrorHandler.error)('用户任务的名称不能为空', element);
      }

      debugger;

      if (element.loopCharacteristics) {
        // 多实例任务必须设置loopByCandidateUser或者loopCandinality
        if (!element.loopCharacteristics.loopCardinality && !element.loopCharacteristics.$attrs['custom:loopByCandidateUsers']) {
          (0, _ErrorHandler.error)('多实例任务必须设置多实例属性', element);
        }
      }
    } // 如果元素有多个outgoing，则检查其是否存在default 或者设置了condition


    if (element.$type != 'bpmn:ParallelGateway' && element.$type != 'bpmn:SequenceFlow') {
      if (element.outgoing && element.outgoing.length > 1 && !element["default"]) {
        element.outgoing.forEach(function (flow) {
          if (!flow.conditionExpression || !flow.conditionExpression.body) {
            (0, _ErrorHandler.error)('未设置执行条件', flow);
          }
        });
      } // 多个分支时，必须设置每条分支的名称


      if (element.outgoing && element.outgoing.length > 1) {
        element.outgoing.forEach(function (flow) {
          if (!flow.name) {
            (0, _ErrorHandler.error)('未设置分支名称', flow);
          }
        });
      }
    }

    if (element.$type != 'bpmn:EndEvent' && element.$type != 'bpmn:SequenceFlow') {
      if (!element.outgoing) {
        (0, _ErrorHandler.error)("".concat(element.$type, "\u7C7B\u578B\u7684\u5143\u7D20\u4E0D\u80FD\u653E\u5728\u6D41\u7A0B\u672B\u5C3E"), element);
      }
    }

    if (element.$type == 'bpmn:ParallelGateway') {
      // 并行网关新增约束：不能够多进多出
      if (element.outgoing && element.outgoing.length > 1 && element.incoming && element.incoming.length > 1) {
        (0, _ErrorHandler.error)("".concat(element.$type, "\u7C7B\u578B\u7684\u5143\u7D20\u4E0D\u80FD\u540C\u65F6\u6709\u591A\u4E2A\u5165\u53E3\u548C\u591A\u4E2A\u51FA\u53E3"), element);
      }
    }
  }
};
exports["default"] = _default;