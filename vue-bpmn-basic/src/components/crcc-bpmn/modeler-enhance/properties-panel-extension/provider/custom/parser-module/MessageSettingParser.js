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

function createMessagesElement(parent, bpmnFactory, isSend) {
  return createElement('custom:Messages', { sendMessage: isSend, template: {}, recipients: {} }, parent, bpmnFactory);
}

function createTemplateElement(parent, bpmnFactory, enabled) {
  return createElement('custom:Template', { enabled: enabled, title: [], body: [] }, parent, bpmnFactory);
}

function createTemplateTitleElement(parent, bpmnFactory, title) {
  return createElement('custom:Title', { value: title }, parent, bpmnFactory);
}

function createTemplateBodyElement(parent, bpmnFactory, body) {
  return createElement('custom:Body', { value: body }, parent, bpmnFactory);
}

function createRecipientsElement(parent, bpmnFactory, candidates) {
  return createElement('custom:Recipients', { candidateUsers: candidates, rangeCond: {}, userCond: {} }, parent, bpmnFactory);
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

function parseToMessageCmd(element, extensionElements, bpmnFactory, jsonEntity) {
  var commandArray = [];
  // <custom:messages>
  var messages = createMessagesElement(extensionElements, bpmnFactory, jsonEntity.sendMessage);
  // 取出旧的messages
  var oldMessages = [];
  if (extensionElements.values && extensionElements.values.length) {
    oldMessages = filter(extensionElements.values, function(v) { return v.$type == 'custom:Messages'; });
  }
  commandArray.push(cmdHelper.addAndRemoveElementsFromList(
    element,
    extensionElements,
    'values',
    'extensionElements',
    [messages],
    oldMessages
  ));

  if (jsonEntity.template) {
    // <custom:template>
    var template = createTemplateElement(messages, bpmnFactory, jsonEntity.template.enabled);
    commandArray.push(cmdHelper.addElementsTolist(element, messages, 'template', [template]));

    // <custom:title>
    if (jsonEntity.template.title) {
      var titleElement = createTemplateTitleElement(template, bpmnFactory, jsonEntity.template.title);
      commandArray.push(cmdHelper.addElementsTolist(element, template, 'title', [titleElement]));
    }

    // <custom:body>
    if (jsonEntity.template.body) {
      var bodyElement = createTemplateBodyElement(template, bpmnFactory, jsonEntity.template.body);
      commandArray.push(cmdHelper.addElementsTolist(element, template, 'body', [bodyElement]));
    }
  }

  if (jsonEntity.recipients) {
    // <custom:recipients>

    var recipientsElement = createRecipientsElement(messages, bpmnFactory, jsonEntity.recipients.candidateUsers);
    commandArray.push(cmdHelper.addElementsTolist(element, messages, 'recipients', [recipientsElement]));

    var recipients = jsonEntity.recipients;
    var sysCompanyLenght = recipients?.sysCompany?.length || 0,
      sysJobLenght = recipients?.sysJob?.length || 0,
      sysUserLength = recipients.sysUser.length || 0;
    
      if (sysCompanyLenght> 0 || sysJobLenght > 0) {
        // <custom:rangeCondition>
        var rangeCond = createRangeConditionElement(recipientsElement, bpmnFactory);
        commandArray.push(cmdHelper.addElementsTolist(element, recipientsElement, 'rangeCond', [rangeCond]));
  
        // <custom:companyCondition>
        if (sysCompanyLenght > 0) {
          var companyCond = createCompanyConditionElement(rangeCond, bpmnFactory);
          commandArray.push(cmdHelper.addElementsTolist(element, rangeCond, 'companyCond', [companyCond]));
  
          // <custom:sysCompany>
          var companies = map(recipients.sysCompany, function(company) {
            return createSysCompanyElement(companyCond, bpmnFactory, company.id, company.name, company.isVariable);
          });
          commandArray.push(cmdHelper.addElementsTolist(element, companyCond, 'companies', companies));
        }
        if (sysJobLenght > 0) {
          // <custom:jobCondition>
          var jobCond = createJobConditionElement(rangeCond, bpmnFactory);
          commandArray.push(cmdHelper.addElementsTolist(element, rangeCond, 'jobCond', jobCond));
    
          // <custom:sysJob>
          var jobs = map(recipients.sysJob, function(job) {
            return createSysJobElement(jobCond, bpmnFactory, job.id, job.name, job.isVariable);
          });
          commandArray.push(cmdHelper.addElementsTolist(element, jobCond, 'jobs', jobs));
        }
      }
  


    if (sysUserLength > 0) {
      // <custom:userCondition>
      var userCond = createUserConditionElement(recipientsElement, bpmnFactory);
      commandArray.push(cmdHelper.addElementsTolist(element, recipientsElement, 'userCond', [userCond]));

      // <custom:sysUser>
      var users = map(recipients.sysUser, function(user) {
        return createSysUserElement(userCond, bpmnFactory, user.userId, user.userName, user.isVariable);
      });
      commandArray.push(cmdHelper.addElementsTolist(element, userCond, 'users', users));
    }

  }
  return commandArray;
}

function parseMessageElementToJson(element) {
  var mst = {
    sendMessage: false,
    template: {
      enabled: false,
      title: '',
      body: ''
    },
    recipients: {
      candidateUsers: false,
      sysCompany: [],
      sysJob: [],
      sysUser: []
    }
  }

  mst.sendMessage = element.sendMessage;
  if (isArray(element.template) && element.template.length) {
    mst.template.enabled = element.template[0].enabled;

    var template = element.template[0];
    if (isArray(template.title) && template.title.length) {
      mst.template.title = template.title[0].value;
    }
    if (isArray(template.body) && template.body.length) {
      mst.template.body = template.body[0].value;
    }
  }

  if (isArray(element.recipients) && element.recipients.length) {
    mst.recipients.candidateUsers = element.recipients[0].candidateUsers;

    var recipients = element.recipients[0];
    if (isArray(recipients.rangeCond) && recipients.rangeCond.length) {
      var rangeCond = recipients.rangeCond[0];
      if (isArray(rangeCond.companyCond) && rangeCond.companyCond.length) {
        var companies = rangeCond.companyCond[0].companies;
        mst.recipients.sysCompany = [].concat(map(companies, function(company) {
          return {
            id: company.id,
            name: company.name,
            isVariable: !!company.isVariable
          };
        }));
      }

      if (isArray(rangeCond.jobCond) && rangeCond.jobCond.length) {
        var jobs = rangeCond.jobCond[0].jobs;
        mst.recipients.sysJob = [].concat(map(jobs, function(job) {
          return {
            id: job.id,
            name: job.name,
            isVariable: !!job.isVariable
          };
        }));
      }
    }

    var userCond = recipients.userCond;
    if (isArray(userCond) && userCond.length) {
      var users = userCond[0].users;
      mst.recipients.sysUser = [].concat(map(users, function(u) {
        return {
          userId: u.userId,
          userName: u.userName,
          isVariable: !!u.isVariable
        };
      }));
    }
  }
  return mst;
}

function MessageSettingParser(eventBus, bpmnFactory, commandStack) {
  eventBus.on('saved-message', function(e) {
    var element = e.element,
      jsonEntity = e.setting;
    
    if (jsonEntity) {
      var commands = [];
      var bo = getBusinessObject(element);
      var extensionElements = bo.extensionElements;
      if (!extensionElements) {
        extensionElements = createExtensionElements(bo, bpmnFactory);
        commands.push(cmdHelper.updateProperties(element, { extensionElements: extensionElements }));
      }

      var messageSettingCmd = parseToMessageCmd(element, extensionElements, bpmnFactory, jsonEntity);
      commands = [].concat(commands, messageSettingCmd);

      var commandToExecute = {
        cmd: 'properties-panel.multi-command-executor',
        context: flattenDeep(commands)
      };
      commandStack.execute(commandToExecute.cmd, commandToExecute.context);
    }
  });

  eventBus.on('message-setting.select', function(e) {
    var messageJson = {},
        element = e.element,
        bo = getBusinessObject(element);

    if (bo.extensionElements) {
      var messageElement = filter(bo.extensionElements.values, function(extension) {
        return extension.$instanceOf('custom:Messages');
      });

      if (messageElement && messageElement.length > 0) {
        messageJson = parseMessageElementToJson(messageElement[0]);
      }
    }
    eventBus.fire('opening-message', { element: element, setting: messageJson });
  });
}

MessageSettingParser.$inject = [
  'eventBus',
  'bpmnFactory',
  'commandStack'
];

export default {
  __init__: ['messageSettingParserModule'],
  messageSettingParserModule: ['type', MessageSettingParser]
};