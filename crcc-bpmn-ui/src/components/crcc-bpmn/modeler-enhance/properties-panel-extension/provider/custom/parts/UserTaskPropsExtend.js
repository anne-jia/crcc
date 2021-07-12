import entryFactory from '../../../entryfactory/EntryFactoryExtend'
import { is } from 'bpmn-js/lib/util/ModelUtil'
import { query } from 'min-dom'

export default function(group, eventBus, element, translate) {
  if (is(element, 'camunda:Assignable')) {
    if (group.id == 'sysParticipant') {
      group.entries.push(entryFactory.textFieldExt({
        id: 'participantx',
        label: translate('participant'),
        modelProperty: 'participantx',
        buttonLabel: '···',
        buttonAction: {
          name: 'selectBtn',
          method: function(element, inputNode) {
            var input = query('input[name="participantx"]', inputNode);
            var btnExecute = query('[data-action="executeValueChange"]', inputNode);
            eventBus.fire('sys-participant.select', { element: element, textBox: input, executeBtn: btnExecute });
          }
        },
        buttonShow: {
          name: 'alwaysShow',
          method: function() {
            return true;
          }
        },
        disabled: function() {
          return true;
        }
      }));
    }
  }
  if (is(element, 'camunda:Assignable') || is(element, 'custom:EndValueSettable')) {
    if (group.id == 'messageSetting') {
      group.entries.push(entryFactory.textFieldExt({
        id: 'flowMessage',
        label: translate('flowMessage'),
        modelProperty: 'flowMessage',
        buttonLabel: '···',
        buttonAction: {
          name: 'selectBtn',
          method: function(element, inputNode) {
            eventBus.fire('message-setting.select', { element: element });
          }
        },
        buttonShow: {
          name: 'alwaysShow',
          method: function() {
            return true;
          }
        },
        disabled: function() {
          return true;
        }
      }));
    }
  }
}