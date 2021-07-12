import {
  assign,
} from 'min-dash';


import inherits from 'inherits'
import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider';


export default function CustomContextPadProvider(
  config, injector, eventBus,
  contextPad, modeling, elementFactory,
  connect, create, popupMenu,
  canvas, rules, translate) {
  ContextPadProvider.call(this,
    config, injector, eventBus,
    contextPad, modeling, elementFactory,
    connect, create, popupMenu,
    canvas, rules, translate)
}

inherits(CustomContextPadProvider, ContextPadProvider)


CustomContextPadProvider.$inject = [
  'config.contextPad',
  'injector',
  'eventBus',
  'contextPad',
  'modeling',
  'elementFactory',
  'connect',
  'create',
  'popupMenu',
  'canvas',
  'rules',
  'translate'
];

CustomContextPadProvider.prototype.getContextPadEntries = function (element) {
  var elementFactory = this._elementFactory,
    create = this._create,
    autoPlace = this._autoPlace,
    translate = this._translate;
  /**
   * Create an append action
   *
   * @param {string} type
   * @param {string} className
   * @param {string} [title]
   * @param {Object} [options]
   *
   * @return {Object} descriptor
   */
  function appendAction(type, className, title, options) {

    if (typeof title !== 'string') {
      options = title;
      title = translate('Append {type}', {
        type: type.replace(/^bpmn:/, '')
      });
    }

    function appendStart(event, element) {

      var shape = elementFactory.createShape(assign({
        type: type
      }, options));
      create.start(event, shape, {
        source: element
      });
    }


    var append = autoPlace ? function (event, element) {
      var shape = elementFactory.createShape(assign({
        type: type
      }, options));

      autoPlace.append(element, shape);
    } : appendStart;


    return {
      group: 'model',
      className: className,
      title: title,
      action: {
        dragstart: appendStart,
        click: append
      }
    };
  }
  var actions = ContextPadProvider.prototype.getContextPadEntries.call(this, element)
  delete actions["append.intermediate-event"]
  if(actions["append.append-task"]){
    actions["append.append-task"] = appendAction(
      'bpmn:UserTask',
      'bpmn-icon-user-task',
      translate('Append UserTask')
    )
  }
  return actions
}