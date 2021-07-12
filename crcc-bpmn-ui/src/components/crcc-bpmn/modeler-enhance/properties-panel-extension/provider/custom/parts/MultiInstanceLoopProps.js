import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'

import multiInstanceLoopCharacteristics from './implementation/MultiInstanceLoopCharacteristics'

function getLoopCharacteristics(element) {
  var bo = getBusinessObject(element);
  return bo.loopCharacteristics;
}


function ensureMultiInstanceSupported(element) {
  var loopCharacteristics = getLoopCharacteristics(element);
  return !!loopCharacteristics && is(loopCharacteristics, 'camunda:Collectable');
}

export default function(group, element, bpmnFactory, translate) {

  if (!ensureMultiInstanceSupported(element)) {
    return
  }

  // multi instance properties
  group.entries = group.entries.concat(multiInstanceLoopCharacteristics(element, bpmnFactory, translate));

}
