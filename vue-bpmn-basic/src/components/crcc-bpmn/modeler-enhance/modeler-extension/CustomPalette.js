import {
  assign
} from 'min-dash';

export default function PaletteProvider(palette, create, elementFactory, globalConnect, bpmnFactory, translate, spaceTool, lassoTool, handTool) {
  this.create = create
  this.elementFactory = elementFactory
  this.globalConnect = globalConnect
  this.bpmnFactory = bpmnFactory
  this.translate = translate;
  this.spaceTool = spaceTool
  this.lassoTool = lassoTool
  this.handTool = handTool

  palette.registerProvider(this)
}

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'globalConnect',
  'bpmnFactory',
  'translate',
  'spaceTool',
  'lassoTool',
  'handTool'
]

PaletteProvider.prototype.getPaletteEntries = function (element) {
  const {
    create,
    elementFactory,
    bpmnFactory,
    translate,
    spaceTool,
    lassoTool,
    handTool,
    globalConnect
  } = this;

  function createAction(type, group, className, title, options) {

    function createListener(event) {
      var shape = elementFactory.createShape(assign({
        type: type
      }, options));

      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded;
      }

      create.start(event, shape);
    }

    var shortType = type.replace(/^bpmn:/, '');

    return {
      group: group,
      className: className,
      title: title || translate('Create {type}', {
        type: translate(shortType)
      }),
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
  }

  function createGateway() {
    return function (event) {
      const shape = elementFactory.createShape({
        type: 'bpmn:ExclusiveGateway'
      });
      create.start(event, shape);
    }
  }

  return {
    'hand-tool': {
      group: 'tools',
      className: 'bpmn-icon-hand-tool',
      title: translate('Activate the hand tool'),
      action: {
        click: function (event) {
          handTool.activateHand(event);
        }
      }
    },
    'lasso-tool': {
      group: 'tools',
      className: 'bpmn-icon-lasso-tool',
      title: translate('Activate the lasso tool'),
      action: {
        click: function (event) {
          lassoTool.activateSelection(event);
        }
      }
    },
    'space-tool': {
      group: 'tools',
      className: 'bpmn-icon-space-tool',
      title: translate('Activate the create/remove space tool'),
      action: {
        click: function (event) {
          spaceTool.activateSelection(event);
        }
      }
    },
    'global-connect-tool': {
      group: 'tools',
      className: 'bpmn-icon-connection-multi',
      title: translate('Activate the global connect tool'),
      action: {
        click: function (event) {
          globalConnect.toggle(event);
        }
      }
    },
    'tool-separator': {
      group: 'tools',
      separator: true
    },

    'create.start-event': createAction(
      'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none',
      translate('Create StartEvent')
    ),
    'create.end-event': createAction(
      'bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none',
      translate('Create EndEvent')
    ),

    'create.exclusive-gateway': {
      group: 'gateway',
      className: 'bpmn-icon-gateway-none',
      title: translate('Create Gateway'),
      action: {
        dragstart: createGateway(),
        click: createGateway()
      }
    },
    'create.task': createAction(
      'bpmn:UserTask', 'activity', 'bpmn-icon-user-task'
    )
  }
}