import inherits from 'inherits';

import PropertiesActivator from 'bpmn-js-properties-panel/lib/PropertiesActivator';


import idProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/IdProps';
import nameProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/NameProps';
import processProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/ProcessProps';
import linkProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/LinkProps';
import eventProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/EventProps';
import documentationProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/DocumentationProps';
import listenerProps from 'bpmn-js-properties-panel/lib/provider/camunda/parts/ListenerProps'
import listenerDetails from 'bpmn-js-properties-panel/lib/provider/camunda/parts/ListenerDetailProps'
import listenerFields from 'bpmn-js-properties-panel/lib/provider/camunda/parts/ListenerFieldInjectionProps'
import {
    is
} from 'bpmn-js/lib/util/ModelUtil';
import eventDefinitionHelper from 'bpmn-js-properties-panel/lib/helper/EventDefinitionHelper'

import endEventProps from './parts/EndEventProps'
import userSettingProps from './parts/UserSettingProps'
import userTaskPropsExtend from './parts/UserTaskPropsExtend'
import multiInstanceLoopProps from './parts/MultiInstanceLoopProps'

var getListenerLabel = function (param, translate) {

    if (is(param, 'camunda:ExecutionListener')) {
        return translate('Execution Listener');
    }

    if (is(param, 'camunda:TaskListener')) {
        return translate('Task Listener');
    }

    return '';
};
/**
 * 参考bpmn-js-properties-panel\lib\provider\camunda\CamundaPropertiesProvider.js实现一个自定义的PropertiesProvider
 * @param {*} element 
 * @param {*} bpmnFactory 
 * @param {*} canvas 
 * @param {*} elementRegistry 
 * @param {*} translate 
 */
function createGeneralTabGroups(element, bpmnFactory, canvas, elementRegistry, translate, eventBus) {

    // refer to target element for external labels
    element = element.labelTarget || element;
    var generalGroup = {
        id: 'general',
        label: translate('General'),
        entries: []
    };
    idProps(generalGroup, element, translate);
    nameProps(generalGroup, element, bpmnFactory, canvas, translate);
    processProps(generalGroup, element, translate);

    var detailsGroup = {
        id: 'details',
        label: translate('Details'),
        entries: []
    };
    linkProps(detailsGroup, element, translate);
    eventProps(detailsGroup, element, bpmnFactory, elementRegistry, translate);

    var multiInstanceGroup = {
        id: 'multiInstance',
        label: translate('Multi Instance'),
        entries: []
    };
    multiInstanceLoopProps(multiInstanceGroup, element, bpmnFactory, translate);

    var documentationGroup = {
        id: 'documentation',
        label: translate('Documentation'),
        entries: []
    };
    documentationProps(documentationGroup, element, bpmnFactory, translate);

    // custom 参与者相关处理
    var sysParticipantGroup = {
        id: 'sysParticipant',
        label: translate('sys-participant'),
        entries: []
    };
    userTaskPropsExtend(sysParticipantGroup, eventBus, element, translate);

    // custom 消息相关处理
    var messageGroup = {
        id: 'messageSetting',
        label: translate('message-setting'),
        entries: []
    };
    userTaskPropsExtend(messageGroup, eventBus, element, translate);

    // custom 是否必须填写审批意见，是否允许上传附件设置
    var userSettingGroup = {
        id: 'userSetting',
        label: translate('flow-setting'),
        entries: []
    };
    userSettingProps(userSettingGroup, eventBus, element, translate);

    // custom 结束环节对应的业务值
    var endValueGroup = {
        id: 'endValue',
        label: translate('end-value-group-label'),
        entries: []
    };
    endEventProps(endValueGroup, element, translate);

    return [
        generalGroup,
        detailsGroup,
        sysParticipantGroup,
        messageGroup,
        userSettingGroup,
        endValueGroup,
        multiInstanceGroup,
        documentationGroup
    ];
}

function createListenersTabGroups(element, bpmnFactory, elementRegistry, translate) {

    var listenersGroup = {
        id: 'listeners',
        label: translate('Listeners'),
        entries: []
    };

    var options = listenerProps(listenersGroup, element, bpmnFactory, translate);

    var listenerDetailsGroup = {
        id: 'listener-details',
        entries: [],
        enabled: function (element, node) {
            return options.getSelectedListener(element, node);
        },
        label: function (element, node) {
            var param = options.getSelectedListener(element, node);
            return getListenerLabel(param, translate);
        }
    };

    listenerDetails(listenerDetailsGroup, element, bpmnFactory, options, translate);

    var listenerFieldsGroup = {
        id: 'listener-fields',
        label: translate('Field Injection'),
        entries: [],
        enabled: function (element, node) {
            return options.getSelectedListener(element, node);
        }
    };

    listenerFields(listenerFieldsGroup, element, bpmnFactory, options, translate);

    return [
        listenersGroup,
        listenerDetailsGroup,
        listenerFieldsGroup
    ];
}

export default function CustomPropertiesProvider(
    eventBus, bpmnFactory, canvas,
    elementRegistry, translate
) {
    PropertiesActivator.call(this, eventBus);
    this.getTabs = function (element) {
        var generalTab = {
            id: 'general',
            label: translate('General'),
            groups: createGeneralTabGroups(element, bpmnFactory, canvas, elementRegistry, translate, eventBus)
        };

        var listenersTab = {
            id: 'listeners',
            label: translate('Listeners'),
            groups: createListenersTabGroups(element, bpmnFactory, elementRegistry, translate),
            enabled: function (element) {
                return !eventDefinitionHelper.getLinkEventDefinition(element) ||
                    (!is(element, 'bpmn:IntermediateThrowEvent') &&
                        eventDefinitionHelper.getLinkEventDefinition(element));
            }
        };

        return [
            generalTab,
            listenersTab
        ];
    }
}
CustomPropertiesProvider.$inject = [
    "eventBus", "bpmnFactory", "canvas",
    "elementRegistry", "translate"
];
inherits(CustomPropertiesProvider, PropertiesActivator);