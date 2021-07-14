export var xmlStr = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
 xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
   xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0"
   id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2"
   targetNamespace="http://bpmn.io/bpmn"
   exporter="bpmn-js (https://demo.bpmn.io)"
   exporterVersion="5.1.2">
  <process id="Process_1" isExecutable="false">
    <startEvent id="StartEvent_1y45yut" name="开始">
      <outgoing>Flow_11stapy</outgoing>
    </startEvent>
    <userTask id="Activity_069o9xg" 0="[object Object]">
      <incoming>Flow_11stapy</incoming>
      <multiInstanceLoopCharacteristics />
    </userTask>
    <sequenceFlow id="Flow_11stapy" sourceRef="StartEvent_1y45yut" targetRef="Activity_069o9xg" />
  </process>
  <bpmndi:BPMNDiagram id="BpmnDiagram_1">
    <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNEdge id="Flow_11stapy_di" bpmnElement="Flow_11stapy">
        <di:waypoint x="180" y="160" />
        <di:waypoint x="220" y="160" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="StartEvent_1y45yut_di" bpmnElement="StartEvent_1y45yut">
        <omgdc:Bounds x="140" y="140" width="40" height="40" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="148" y="183" width="22" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_069o9xg_di" bpmnElement="Activity_069o9xg" >
        <omgdc:Bounds x="220" y="120" width="100" height="80" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
`