import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory'
import { is } from 'bpmn-js/lib/util/ModelUtil'

export default function(group, element, translate) {

  if (is(element, 'custom:EndValueSettable')) {

    var entries = [];

    var endValueEntry = entryFactory.textBox(translate, {
      id: 'endEventValue',
      label: translate('end-value-label'),
      modelProperty: 'custom:endValue'
    });

    entries.push(endValueEntry);

    group.entries = group.entries.concat(entries);

  }
}
