import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper'
import flattenDeep from 'lodash/flattenDeep';
import map from 'lodash/map';
import filter from 'lodash/filter';
import isArray from 'lodash/isArray';
function createElement(elementType, properties, parent, factory) {
  var element = factory.create(elementType, properties);
  element.$parent = parent;
  return element;
}

function createExtensionElements(parent, bpmnFactory) {
  return createElement('bpmn:ExtensionElements', { values: [] }, parent, bpmnFactory);
}

function createParticipantElement(parent, bpmnFactory, name) {
  return createElement('custom:Participant', { name: name, validationCond: {}, rangeCond: {}, userCond: {} }, parent, bpmnFactory);
}

function createValidationConditionElement(parent, bpmnFactory, condition) {
  return createElement('custom:ValidationCondition', { condition: condition }, parent, bpmnFactory);
}

function createRangeConditionElement(parent, bpmnFactory) {
  return createElement('custom:RangeCondition', { companyCond: {}, jobCond: {} }, parent, bpmnFactory);
}

function createCompanyConditionElement(parent, bpmnFactory) {
  return createElement('custom:CompanyCondition', { companies: [] }, parent, bpmnFactory);
}

function createSysCompanyElement(parent, bpmnFactory, id, name, isVariable) {
  return createElement('custom:SysCompany', { id: id, name: name, isVariable: isVariable }, parent, bpmnFactory);
}

function createJobConditionElement(parent, bpmnFactory) {
  return createElement('custom:JobCondition', { jobs: [] }, parent, bpmnFactory);
}

function createSysJobElement(parent, bpmnFactory, id, name, isVariable) {
  return createElement('custom:SysJob', { id: id, name: name, isVariable: isVariable }, parent, bpmnFactory);
}

function createUserConditionElement(parent, bpmnFactory) {
  return createElement('custom:UserCondition', { users: [] }, parent, bpmnFactory);
}

function createSysUserElement(parent, bpmnFactory, userId, userName, isVariable) {
  return createElement('custom:SysUser', { userId: userId, userName: userName, isVariable: isVariable }, parent, bpmnFactory);
}

function parseToParticipantElement(element, extensionElements, bpmnFactory, jsonEntity) {
  var commandArray = [];
  // <custom:participant>
  var participant = createParticipantElement(extensionElements, bpmnFactory, jsonEntity.expressionDesc);
  var participants = [];
  if (extensionElements.values && extensionElements.values.length) {
    participants = filter(extensionElements.values, function(v) { return v.$type == 'custom:Participant'; });
  }
  commandArray.push(cmdHelper.addAndRemoveElementsFromList(
    element,
    extensionElements,
    'values',
    'extensionElements',
    [participant],
    participants
  ));

  // <custom:validationCondition>
  var validationCond = createValidationConditionElement(participant, bpmnFactory, jsonEntity.validateCondition);
  commandArray.push(cmdHelper.addElementsTolist(element, participant, 'validationCond', [validationCond]));
  var sysCompanyLenght = jsonEntity?.sysCompany?.length || 0,
    sysJobLenght = jsonEntity?.sysJob?.length || 0,
    sysUserLength = jsonEntity.sysUser.length || 0;
    if (sysCompanyLenght > 0 || sysJobLenght > 0) {
      // <custom:rangeCondition>
      var rangeCond = createRangeConditionElement(participant, bpmnFactory);
      commandArray.push(cmdHelper.addElementsTolist(element, participant, 'rangeCond', [rangeCond]));
  
      // <custom:companyCondition>
      if (sysCompanyLenght > 0) {
        var companyCond = createCompanyConditionElement(rangeCond, bpmnFactory);
        commandArray.push(cmdHelper.addElementsTolist(element, rangeCond, 'companyCond', [companyCond]));
  
        // <custom:sysCompany>
        var companies = map(jsonEntity.sysCompany, function(company) {
          return createSysCompanyElement(companyCond, bpmnFactory, company.id, company.name, company.isVariable);
        });
        commandArray.push(cmdHelper.addElementsTolist(element, companyCond, 'companies', companies));
      }

        if (sysJobLenght > 0) {
          // <custom:jobCondition>
          var jobCond = createJobConditionElement(rangeCond, bpmnFactory);
          commandArray.push(cmdHelper.addElementsTolist(element, rangeCond, 'jobCond', jobCond));

          // <custom:sysJob>
          var jobs = map(jsonEntity.sysJob, function(job) {
            return createSysJobElement(jobCond, bpmnFactory, job.id, job.name, job.isVariable);
          });
          commandArray.push(cmdHelper.addElementsTolist(element, jobCond, 'jobs', jobs));
        }
    }

  if (sysUserLength > 0) {
    // <custom:userCondition>
    var userCond = createUserConditionElement(participant, bpmnFactory);
    commandArray.push(cmdHelper.addElementsTolist(element, participant, 'userCond', [userCond]));

    // <custom:sysUser>
    var users = map(jsonEntity.sysUser, function(user) {
      return createSysUserElement(userCond, bpmnFactory, user.userId, user.userName, user.isVariable);
    });
    commandArray.push(cmdHelper.addElementsTolist(element, userCond, 'users', users));
  }

  return commandArray;
}

function parseParticipantElementToJson(participantEl) {
  var prt = {
    expressionDesc: '',
    validationCondition: '',
    sysCompany: [],
    sysJob: [],
    sysUser: []
  };
  prt.expressionDesc = participantEl.name;

  if (isArray(participantEl.validationCond) && participantEl.validationCond.length) {
    prt.validateCondition = participantEl.validationCond[0].condition;
  }

  if (isArray(participantEl.rangeCond) && participantEl.rangeCond.length) {
    var rangeCond = participantEl.rangeCond[0];
    if (isArray(rangeCond.companyCond) && rangeCond.companyCond.length) {
      var companies = rangeCond.companyCond[0].companies;
      prt.sysCompany = [].concat(map(companies, function(company) {
        return {
          id: company.id,
          name: company.name,
          isVariable: !!company.isVariable
        };
      }));
    }

    if (isArray(rangeCond.jobCond) && rangeCond.jobCond.length) {
      var jobs = rangeCond.jobCond[0].jobs;
      prt.sysJob = [].concat(map(jobs, function(job) {
        return {
          id: job.id,
          name: job.name,
          isVariable: !!job.isVariable
        };
      }));
    }
  }

  var userCond = participantEl.userCond;
  if (isArray(userCond) && userCond.length) {
    var users = userCond[0].users;
    prt.sysUser = [].concat(map(users, function(u) {
      return {
        userId: u.userId,
        userName: u.userName,
        isVariable: !!u.isVariable
      };
    }));
  }
  return prt;
}

function ParticipantParser(eventBus, bpmnFactory, commandStack) {
  eventBus.on('saved-participant', function(e) {
    var element = e.element,
        participantJsons = e.participants;
    if (participantJsons) {
      var commands = [];
      var bo = getBusinessObject(element);
      var extensionElements = bo.extensionElements;
      if (!extensionElements) {
        extensionElements = createExtensionElements(bo, bpmnFactory);
        commands.push(cmdHelper.updateProperties(element, { extensionElements: extensionElements }));
      }
      var participantsCmd = map(participantJsons, function(participantJson) {
        return parseToParticipantElement(element, extensionElements, bpmnFactory, participantJson);
      });

      commands = [].concat(commands, participantsCmd);
      var commandToExecute = {
        cmd: 'properties-panel.multi-command-executor',
        context: flattenDeep(commands)
      };
      commandStack.execute(commandToExecute.cmd, commandToExecute.context);
    }
  });

  eventBus.on('sys-participant.select', function(e) {
    var participantJson = [],
        element = e.element,
        bo = getBusinessObject(element);

    if (bo.extensionElements) {
      var participantElements = filter(bo.extensionElements.values, function(extension) {
        return extension.$instanceOf('custom:Participant');
      });

      participantJson = map(participantElements, function(participantEl) {
        return parseParticipantElementToJson(participantEl);
      });
    }
    eventBus.fire('opening-participant', { element: element, participants: participantJson });
  });
}

ParticipantParser.$inject = [
  'eventBus',
  'bpmnFactory',
  'commandStack'
];

export default {
  __init__: ['participantParserModule'],
  participantParserModule: ['type', ParticipantParser]
};