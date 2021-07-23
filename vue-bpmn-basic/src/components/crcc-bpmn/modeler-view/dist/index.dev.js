"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModelerViewer = exports["default"] = ModelerViewer;
Object.defineProperty(exports, "NavigatedViewer", {
  enumerable: true,
  get: function get() {
    return _NavigatedViewer["default"];
  }
});

var _inherits = _interopRequireDefault(require("inherits"));

var _translate = _interopRequireDefault(require("../modeler-enhance/translate"));

var _NavigatedViewer = _interopRequireDefault(require("bpmn-js/lib/NavigatedViewer"));

var _modeling = _interopRequireDefault(require("bpmn-js/lib/features/modeling"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ModelerViewer(options) {
  _NavigatedViewer["default"].call(this, options);

  this._customElements = [];
}

(0, _inherits["default"])(ModelerViewer, _NavigatedViewer["default"]);
ModelerViewer.prototype._modules = [].concat(ModelerViewer.prototype._modules, [// 汉化处理
_translate["default"], _modeling["default"]]);