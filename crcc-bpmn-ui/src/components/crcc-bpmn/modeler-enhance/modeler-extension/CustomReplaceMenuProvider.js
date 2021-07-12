import {
  getBusinessObject,
  is
} from 'bpmn-js/lib/util/ModelUtil';

import {
  isExpanded
} from 'bpmn-js/lib/util/DiUtil';

import {
  isDifferentType
} from 'bpmn-js/lib/features/popup-menu/util/TypeUtil';

import {
  filter
} from 'min-dash';



import inherits from 'inherits'

import ReplaceMenuProvider from 'bpmn-js/lib/features/popup-menu/ReplaceMenuProvider';

import * as replaceOptions from './CustomReplaceMenuOptions';


export default function CustomReplaceMenuProvider(
  bpmnFactory, popupMenu, modeling, moddle,
  bpmnReplace, rules, translate) {
  ReplaceMenuProvider.call(this,
    bpmnFactory, popupMenu, modeling, moddle,
    bpmnReplace, rules, translate)
}


CustomReplaceMenuProvider.$inject = [
  'bpmnFactory',
  'popupMenu',
  'modeling',
  'moddle',
  'bpmnReplace',
  'rules',
  'translate'
];



inherits(CustomReplaceMenuProvider, ReplaceMenuProvider)

CustomReplaceMenuProvider.prototype.getEntries = function (element) {
  var businessObject = element.businessObject;

  var entries;
  var differentType = isDifferentType(element);
  // gateways
  if (is(businessObject, 'bpmn:Gateway')) {

    entries = filter(replaceOptions.GATEWAY, differentType);

    return this._createEntries(element, entries);
  }
  // start events outside sub processes
  if (is(businessObject, 'bpmn:StartEvent') && !is(businessObject.$parent, 'bpmn:SubProcess')) {

    entries = filter(replaceOptions.START_EVENT, differentType);

    return this._createEntries(element, entries);
  }

  // end events
  if (is(businessObject, 'bpmn:EndEvent')) {

    entries = filter(replaceOptions.END_EVENT, function (entry) {
      var target = entry.target;

      // hide cancel end events outside transactions
      if (target.eventDefinitionType == 'bpmn:CancelEventDefinition' && !is(businessObject.$parent, 'bpmn:Transaction')) {
        return false;
      }

      return differentType(entry);
    });

    return this._createEntries(element, entries);
  }

  if (is(businessObject, 'bpmn:AdHocSubProcess') && !isExpanded(businessObject)) {

    entries = filter(replaceOptions.TASK, function (entry) {

      var target = entry.target;

      var isTargetSubProcess = target.type === 'bpmn:SubProcess';

      var isTargetExpanded = target.isExpanded === true;

      return isDifferentType(element, target) && (!isTargetSubProcess || isTargetExpanded);
    });

    return this._createEntries(element, entries);
  }
  if (is(businessObject, 'bpmn:UserTask')) {
    entries = filter(replaceOptions.TASK, differentType);

    // collapsed SubProcess can not be replaced with itself
    if (is(businessObject, 'bpmn:SubProcess') && !isExpanded(businessObject)) {
      entries = filter(entries, function (entry) {
        return entry.label !== 'Sub Process (collapsed)';
      });
    }

    return this._createEntries(element, entries);
  }


  return ReplaceMenuProvider.prototype.getEntries.call(this, element);
}

CustomReplaceMenuProvider.prototype._getLoopEntries = function (element) {

  var self = this;
  var translate = this._translate;

  function toggleLoopEntry(event, entry) {
    var loopCharacteristics;

    if (entry.active) {
      loopCharacteristics = undefined;
    } else {
      loopCharacteristics = self._moddle.create(entry.options.loopCharacteristics);

      if (entry.options.isSequential) {
        loopCharacteristics.isSequential = entry.options.isSequential;
      }
    }
    self._modeling.updateProperties(element, {
      loopCharacteristics: loopCharacteristics
    });
  }

  var businessObject = getBusinessObject(element),
    loopCharacteristics = businessObject.loopCharacteristics;

  var isSequential,
    isLoop,
    isParallel;

  if (loopCharacteristics) {
    isSequential = loopCharacteristics.isSequential;
    isLoop = loopCharacteristics.isSequential === undefined;
    isParallel = loopCharacteristics.isSequential !== undefined && !loopCharacteristics.isSequential;
  }


  var loopEntries = [{
      id: 'toggle-parallel-mi',
      className: 'bpmn-icon-parallel-mi-marker',
      title: translate('Parallel Multi Instance'),
      active: isParallel,
      action: toggleLoopEntry,
      options: {
        loopCharacteristics: 'bpmn:MultiInstanceLoopCharacteristics',
        isSequential: false
      }
    },
    {
      id: 'toggle-sequential-mi',
      className: 'bpmn-icon-sequential-mi-marker',
      title: translate('Sequential Multi Instance'),
      active: isSequential,
      action: toggleLoopEntry,
      options: {
        loopCharacteristics: 'bpmn:MultiInstanceLoopCharacteristics',
        isSequential: true
      }
    }
  ];
  return loopEntries;
};