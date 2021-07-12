import Modeler from 'bpmn-js/lib/Modeler'
import {
    assign
} from 'min-dash';
import inherits from 'inherits'

import customModelerModule from './modeler-extension'

import diagramOriginModule from 'diagram-js-origin';

import propertiesPanelModule from "bpmn-js-properties-panel";
import customPropertiesProviderModule from './properties-panel-extension/provider/custom';

import customModdleDescriptor from './properties-panel-extension/descriptors/custom.json'

import camundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda.json";

import participantParserPropertiesProviderModule from "./properties-panel-extension/provider/custom/parser-module/ParticipantParser"
import messageSettingParserPropertiesProviderModule from "./properties-panel-extension/provider/custom/parser-module/MessageSettingParser"
import customTranslateModule from './translate'
import propertiesEventHandlerProviderModule from './properties-event-handler'


export default function CustomModeler(options) {

    options.moddleExtensions = assign({}, {
        camunda: camundaModdleDescriptor,
        custom: customModdleDescriptor
    }, options.moddleExtensions);
    Modeler.call(this, options)

    this._customElements = []
}

inherits(CustomModeler, Modeler)

CustomModeler.prototype._modules = [].concat(
    CustomModeler.prototype._modules, [
        propertiesPanelModule,
        customPropertiesProviderModule,
        customModelerModule,
        diagramOriginModule,
        participantParserPropertiesProviderModule,
        messageSettingParserPropertiesProviderModule,
        customTranslateModule,
        propertiesEventHandlerProviderModule,
    ]
)