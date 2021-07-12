
import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory'
import { 
  // is, 
  getBusinessObject 
} from 'bpmn-js/lib/util/ModelUtil'
import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper'
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper'
import { classes } from 'min-dom'


/**
 * Get a property value of the loop characteristics.
 *
 * @param {djs.model.Base} element
 * @param {string} propertyName
 *
 * @return {any} the property value
 */
function getProperty(element, propertyName) {
  var loopCharacteristics = getLoopCharacteristics(element);
  return loopCharacteristics && loopCharacteristics.get(propertyName);
}

/**
 * Get the body of a given expression.
 *
 * @param {ModdleElement<bpmn:FormalExpression>} expression
 *
 * @return {string} the body (value) of the expression
 */
function getBody(expression) {
  return expression && expression.get('body');
}


/**
 * Get the loop characteristics of an element.
 *
 * @param {djs.model.Base} element
 *
 * @return {ModdleElement<bpmn:MultiInstanceLoopCharacteristics>} the loop characteristics
 */
function getLoopCharacteristics(element) {
  var bo = getBusinessObject(element);
  return bo.loopCharacteristics;
}

/**
 * Get the loop cardinality of the loop characteristics.
 *
 * @param {djs.model.Base} element
 *
 * @return {ModdleElement<bpmn:FormalExpression>} an expression representing the loop cardinality
 */
function getLoopCardinality(element) {
  return getProperty(element, 'loopCardinality');
}

/**
 * Get the loop cardinality value of the loop characteristics.
 *
 * @param {djs.model.Base} element
 *
 * @return {string} the loop cardinality value
 */
function getLoopCardinalityValue(element) {
  var loopCardinality = getLoopCardinality(element);
  return getBody(loopCardinality);
}

/**
 * Get the completion condition of the loop characteristics.
 *
 * @param {djs.model.Base} element
 *
 * @return {ModdleElement<bpmn:FormalExpression>} an expression representing the completion condition
 */
function getCompletionCondition(element) {
  return getProperty(element, 'completionCondition');
}

/**
 * Get the completion condition value of the loop characteristics.
 *
 * @param {djs.model.Base} element
 *
 * @return {string} the completion condition value
 */
function getCompletionConditionValue(element) {
  var completionCondition = getCompletionCondition(element);
  return getBody(completionCondition);
}

/**
 * Creates 'bpmn:FormalExpression' element.
 *
 * @param {ModdleElement} parent
 * @param {string} body
 * @param {BpmnFactory} bpmnFactory
 *
 * @result {ModdleElement<bpmn:FormalExpression>} a formal expression
 */
function createFormalExpression(parent, body, bpmnFactory) {
  return elementHelper.createElement('bpmn:FormalExpression', { body: body }, parent, bpmnFactory);
}

/**
 * Updates a specific formal expression of the loop characteristics.
 *
 * @param {djs.model.Base} element
 * @param {string} propertyName
 * @param {string} newValue
 * @param {BpmnFactory} bpmnFactory
 */
function updateFormalExpression(element, propertyName, newValue, bpmnFactory) {
  var loopCharacteristics = getLoopCharacteristics(element);

  var expressionProps = {};

  if (!newValue) {
    // remove formal expression
    expressionProps[propertyName] = undefined;
    return cmdHelper.updateBusinessObject(element, loopCharacteristics, expressionProps);
  }

  var existingExpression = loopCharacteristics.get(propertyName);

  if (!existingExpression) {
    // add formal expression
    expressionProps[propertyName] = createFormalExpression(loopCharacteristics, newValue, bpmnFactory);
    return cmdHelper.updateBusinessObject(element, loopCharacteristics, expressionProps);
  }

  // edit existing formal expression
  return cmdHelper.updateBusinessObject(element, existingExpression, {
    body: newValue
  });
}

export default function(element, bpmnFactory, translate) {

  var entries = [];

  entries.push({
    id: 'multiInstance-errorMessage',
    html: '<div data-show="isValid">' +
             '<span class="bpp-icon-warning"></span> ' +
             translate('Must provide either loop by candidateusers or loop cardinality') +
          '</div>',

    isValid: function(element, node, notification, scope) {
      var loopCharacteristics = getLoopCharacteristics(element);

      var isValid = true;
      if (loopCharacteristics) {
        var loopCardinality = getLoopCardinalityValue(element);
        var loopByCandidateUsers = !!loopCharacteristics.get('custom:loopByCandidateUsers');

        isValid = !loopCardinality && !loopByCandidateUsers;
      }

      classes(node).toggle('bpp-hidden', !isValid);
      classes(notification).toggle('bpp-error-message', isValid);

      return isValid;
    }
  });

  // loopByCandidateUsers 两种多实例方式之一：1. 根据参与者人数创建多实例，其值是true或者false
  entries.push(entryFactory.checkbox(translate, {
    id: 'loopByCandidateUsers',
    label: translate('Loop By CandidateUsers'),
    modelProperty: 'loopByCandidateUsers',

    get: function(element, node) {
      var bo = getLoopCharacteristics(element);
      return {
        loopByCandidateUsers : !!bo.get('custom:loopByCandidateUsers')
      };
    },

    set: function(element, values) {
      var commands = [];
      var bo = getLoopCharacteristics(element);
      var collectionProps = {
        'camunda:collection': 'loopCandidateUsers',
        'camunda:elementVariable': 'assigneeByLoopCandidate'
      };
      if (values.loopByCandidateUsers) {
        commands.push(updateFormalExpression(element, 'loopCardinality', '', bpmnFactory));
      } else {
        collectionProps = {
          'camunda:collection': undefined,
          'camunda:elementVariable': undefined
        };
      }
      commands.push(cmdHelper.updateBusinessObject(element, bo, collectionProps));
      commands.push(cmdHelper.updateBusinessObject(element, bo, { 'custom:loopByCandidateUsers': !!values.loopByCandidateUsers }));
      return commands;
    }
  }));


  entries.push(entryFactory.textField(translate, {
    id: 'multiInstance-loopCardinality',
    label: translate('Loop Cardinality'),
    modelProperty: 'loopCardinality',

    get: function(element, node) {
      return {
        loopCardinality: getLoopCardinalityValue(element)
      };
    },

    set: function(element, values) {
      return updateFormalExpression(element, 'loopCardinality', values.loopCardinality, bpmnFactory);
    },

    hidden: function(element) {
      var bo = getLoopCharacteristics(element);
      if (bo && bo.get('custom:loopByCandidateUsers')) {
        return true;
      }
      return false;
    }
  }));

  entries.push(entryFactory.textField(translate, {
    id: 'multiInstance-completionCondition',
    label: translate('Completion Condition'),
    modelProperty: 'completionCondition',

    get: function(element) {
      return {
        completionCondition: getCompletionConditionValue(element)
      };
    },

    set: function(element, values) {
      return updateFormalExpression(element, 'completionCondition', values.completionCondition, bpmnFactory);
    }
  }))

  return entries

}
