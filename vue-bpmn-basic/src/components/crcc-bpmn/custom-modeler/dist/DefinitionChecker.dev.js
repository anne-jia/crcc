"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = check;

var _ErrorHandler = _interopRequireWildcard(require("./rules/ErrorHandler"));

var _rules = _interopRequireDefault(require("./rules"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var hasTraveled = {};
var parallelGatewayCheck = 0;

function traverseElements(element) {
  if (!hasTraveled[element.id]) {
    hasTraveled[element.id] = true;
    checkElement(element);

    if (element.outgoing && element.outgoing.length > 0) {
      element.outgoing.forEach(function (el) {
        return traverseElements(el);
      });
    }

    if (element.targetRef) {
      traverseElements(element.targetRef);
    }
  }
}

function checkElement(element) {
  if (element.$type == 'bpmn:ParallelGateway') {
    parallelGatewayCheck -= element.incoming ? element.incoming.length : 0;
    parallelGatewayCheck += element.outgoing ? element.outgoing.length : 0;
  }

  _rules["default"].forEach(function (validator) {
    return validator.validate(element);
  });
}

function check(definition) {
  hasTraveled = {};
  parallelGatewayCheck = 0;

  _ErrorHandler["default"].clear();

  var process = definition.rootElements[0];

  if (!process.name || !process.name.trim()) {
    (0, _ErrorHandler.error)('流程名称不能为空', process);
  }

  if (process.flowElements && process.flowElements.length > 0) {
    var flowElements = process.flowElements;
    var startElement = flowElements.filter(function (el) {
      return el.$type == 'bpmn:StartEvent';
    });

    if (startElement.length == 0) {
      (0, _ErrorHandler.error)('未定义开始事件', process);
    } else if (startElement.length > 1) {
      (0, _ErrorHandler.error)('存在多个开始事件', process);
    } else {
      traverseElements(startElement[0]);

      if (parallelGatewayCheck != 0) {
        (0, _ErrorHandler.error)('并行网关区域绘制错误，请检查', process);
      } // 是否存在零散节点


      var notIncluded = flowElements.filter(function (el) {
        return !hasTraveled[el.id];
      });

      if (notIncluded.length > 0) {
        notIncluded.forEach(function (el) {
          return (0, _ErrorHandler.error)('元素未被包含在主流程中', el);
        });
      }
    }
  } else {
    (0, _ErrorHandler.error)('流程定义没有内容', process);
  }

  return _ErrorHandler["default"].getErrors();
}