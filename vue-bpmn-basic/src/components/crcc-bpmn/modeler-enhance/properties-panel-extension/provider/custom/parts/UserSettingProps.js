
import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory'
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper'

export default function(group, eventBus, element, translate) {
  if (is(element, 'custom:UserAccessible')) {
    group.entries.push(entryFactory.checkbox(translate, {
      id: 'isMustComment',
      label: translate('Force Comment'),
      modelProperty: 'isMustComment',

      get: function(element, node) {
        var bo = getBusinessObject(element);
        return {
          isMustComment : !!bo.get('custom:isMustComment')
        };
      },

      set: function(element, values) {
        var bo = getBusinessObject(element);
        return cmdHelper.updateBusinessObject(element, bo, { 'custom:isMustComment': !!values.isMustComment });
      }
    }));

    group.entries.push(entryFactory.checkbox(translate, {
      id: 'canUpload',
      label: translate('File upload allowed'),
      modelProperty: 'canUpload',

      get: function(element, node) {
        var bo = getBusinessObject(element);
        return {
          canUpload : !!bo.get('custom:canUpload')
        };
      },

      set: function(element, values) {
        var bo = getBusinessObject(element);
        return cmdHelper.updateBusinessObject(element, bo, { 'custom:canUpload': !!values.canUpload });
      }
    }));
  }
}