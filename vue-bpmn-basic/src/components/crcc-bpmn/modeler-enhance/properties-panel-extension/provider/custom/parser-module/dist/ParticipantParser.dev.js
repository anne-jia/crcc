"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ModelUtil = require("bpmn-js/lib/util/ModelUtil");

var _CmdHelper = _interopRequireDefault(require("bpmn-js-properties-panel/lib/helper/CmdHelper"));

var _flattenDeep = _interopRequireDefault(require("lodash/flattenDeep"));

var _map = _interopRequireDefault(require("lodash/map"));

var _filter = _interopRequireDefault(require("lodash/filter"));

var _isArray = _interopRequireDefault(require("lodash/isArray"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function createElement(elementType, properties, parent, factory) {
  var element = factory.create(elementType, properties);
  element.$parent = parent;
  return element;
}

function createExtensionElements(parent, bpmnFactory) {
  return createElement('bpmn:ExtensionElements', {
    values: []
  }, parent, bpmnFactory);
}

function createParticipantElement(parent, bpmnFactory, name) {
  return createElement('custom:Participant', {
    name: name,
    validationCond: {},
    rangeCond: {},
    userCond: {}
  }, parent, bpmnFactory);
}

function createValidationConditionElement(parent, bpmnFactory, condition) {
  return createElement('custom:ValidationCondition', {
    condition: condition
  }, parent, bpmnFactory);
}

function createRangeConditionElement(parent, bpmnFactory) {
  return createElement('custom:RangeCondition', {
    companyCond: {},
    jobCond: {}
  }, parent, bpmnFactory);
}

function createCompanyConditionElement(parent, bpmnFactory) {
  return createElement('custom:CompanyCondition', {
    companies: []
  }, parent, bpmnFactory);
}

function createSysCompanyElement(parent, bpmnFactory, id, name, isVariable) {
  return createElement('custom:SysCompany', {
    id: id,
    name: name,
    isVariable: isVariable
  }, parent, bpmnFactory);
}

function createJobConditionElement(parent, bpmnFactory) {
  return createElement('custom:JobCondition', {
    jobs: []
  }, parent, bpmnFactory);
}

function createSysJobElement(parent, bpmnFactory, id, name, isVariable) {
  return createElement('custom:SysJob', {
    id: id,
    name: name,
    isVariable: isVariable
  }, parent, bpmnFactory);
}

function createUserConditionElement(parent, bpmnFactory) {
  return createElement('custom:UserCondition', {
    users: []
  }, parent, bpmnFactory);
}

function createSysUserElement(parent, bpmnFactory, userCode, userName, isVariable) {
  return createElement('custom:SysUser', {
    userCode: userCode,
    userName: userName,
    isVariable: isVariable
  }, parent, bpmnFactory);
}

function parseToParticipantElement(element, extensionElements, bpmnFactory, jsonEntity) {
  var commandArray = []; // <custom:participant>

  var participant = createParticipantElement(extensionElements, bpmnFactory, jsonEntity.expressionDesc);
  var participants = [];

  if (extensionElements.values && extensionElements.values.length) {
    participants = (0, _filter["default"])(extensionElements.values, function (v) {
      return v.$type == 'custom:Participant';
    });
  }

  commandArray.push(_CmdHelper["default"].addAndRemoveElementsFromList(element, extensionElements, 'values', 'extensionElements', [participant], participants)); // <custom:validationCondition>

  var validationCond = createValidationConditionElement(participant, bpmnFactory, jsonEntity.validateCondition);
  commandArray.push(_CmdHelper["default"].addElementsTolist(element, participant, 'validationCond', [validationCond]));

  if (jsonEntity.sysCompany.length > 0 || jsonEntity.sysJob.length > 0) {
    // <custom:rangeCondition>
    var rangeCond = createRangeConditionElement(participant, bpmnFactory);
    commandArray.push(_CmdHelper["default"].addElementsTolist(element, participant, 'rangeCond', [rangeCond])); // <custom:companyCondition>

    if (jsonEntity.sysCompany.length > 0) {
      var companyCond = createCompanyConditionElement(rangeCond, bpmnFactory);
      commandArray.push(_CmdHelper["default"].addElementsTolist(element, rangeCond, 'companyCond', [companyCond])); // <custom:sysCompany>

      var companies = (0, _map["default"])(jsonEntity.sysCompany, function (company) {
        return createSysCompanyElement(companyCond, bpmnFactory, company.id, company.name, company.isVariable);
      });
      commandArray.push(_CmdHelper["default"].addElementsTolist(element, companyCond, 'companies', companies));
    }

    if (jsonEntity.sysJob.length > 0) {
      // <custom:jobCondition>
      var jobCond = createJobConditionElement(rangeCond, bpmnFactory);
      commandArray.push(_CmdHelper["default"].addElementsTolist(element, rangeCond, 'jobCond', jobCond)); // <custom:sysJob>

      var jobs = (0, _map["default"])(jsonEntity.sysJob, function (job) {
        return createSysJobElement(jobCond, bpmnFactory, job.id, job.name, job.isVariable);
      });
      commandArray.push(_CmdHelper["default"].addElementsTolist(element, jobCond, 'jobs', jobs));
    }
  }

  if (jsonEntity.sysUser.length > 0) {
    // <custom:userCondition>
    var userCond = createUserConditionElement(participant, bpmnFactory);
    commandArray.push(_CmdHelper["default"].addElementsTolist(element, participant, 'userCond', [userCond])); // <custom:sysUser>

    var users = (0, _map["default"])(jsonEntity.sysUser, function (user) {
      return createSysUserElement(userCond, bpmnFactory, user.userCode, user.userName, user.isVariable);
    });
    commandArray.push(_CmdHelper["default"].addElementsTolist(element, userCond, 'users', users));
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

  if ((0, _isArray["default"])(participantEl.validationCond) && participantEl.validationCond.length) {
    prt.validateCondition = participantEl.validationCond[0].condition;
  }

  if ((0, _isArray["default"])(participantEl.rangeCond) && participantEl.rangeCond.length) {
    var rangeCond = participantEl.rangeCond[0];

    if ((0, _isArray["default"])(rangeCond.companyCond) && rangeCond.companyCond.length) {
      var companies = rangeCond.companyCond[0].companies;
      prt.sysCompany = [].concat((0, _map["default"])(companies, function (company) {
        return {
          id: company.id,
          name: company.name,
          isVariable: !!company.isVariable
        };
      }));
    }

    if ((0, _isArray["default"])(rangeCond.jobCond) && rangeCond.jobCond.length) {
      var jobs = rangeCond.jobCond[0].jobs;
      prt.sysJob = [].concat((0, _map["default"])(jobs, function (job) {
        return {
          id: job.id,
          name: job.name,
          isVariable: !!job.isVariable
        };
      }));
    }
  }

  var userCond = participantEl.userCond;

  if ((0, _isArray["default"])(userCond) && userCond.length) {
    var users = userCond[0].users;
    prt.sysUser = [].concat((0, _map["default"])(users, function (u) {
      return {
        userCode: u.userCode,
        userName: u.userName,
        isVariable: !!u.isVariable
      };
    }));
  }

  return prt;
}

function ParticipantParser(eventBus, bpmnFactory, commandStack) {
  eventBus.on('participant.saved', function (e) {
    var element = e.element,
        participantJsons = e.participants;

    if (participantJsons) {
      var commands = [];
      var bo = (0, _ModelUtil.getBusinessObject)(element);
      var extensionElements = bo.extensionElements;

      if (!extensionElements) {
        extensionElements = createExtensionElements(bo, bpmnFactory);
        commands.push(_CmdHelper["default"].updateProperties(element, {
          extensionElements: extensionElements
        }));
      }

      var participantsCmd = (0, _map["default"])(participantJsons, function (participantJson) {
        return parseToParticipantElement(element, extensionElements, bpmnFactory, participantJson);
      });
      commands = [].concat(commands, participantsCmd);
      var commandToExecute = {
        cmd: 'properties-panel.multi-command-executor',
        context: (0, _flattenDeep["default"])(commands)
      };
      commandStack.execute(commandToExecute.cmd, commandToExecute.context);
    }
  });
  eventBus.on('sys-participant.select', function (e) {
    var participantJson = [],
        element = e.element,
        bo = (0, _ModelUtil.getBusinessObject)(element);

    if (bo.extensionElements) {
      var participantElements = (0, _filter["default"])(bo.extensionElements.values, function (extension) {
        return extension.$instanceOf('custom:Participant');
      });
      participantJson = (0, _map["default"])(participantElements, function (participantEl) {
        return parseParticipantElementToJson(participantEl);
      });
    }

    eventBus.fire('sys-participant.opening', {
      element: element,
      participants: participantJson
    });
  });
}

ParticipantParser.$inject = ['eventBus', 'bpmnFactory', 'commandStack'];
var _default = {
  __init__: ['participantParserModule'],
  participantParserModule: ['type', ParticipantParser]
};
exports["default"] = _default;