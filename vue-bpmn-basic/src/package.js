import Vue from 'vue'
import 'normalize.css/normalize.css'

//Begin 以下为bpmn工作流绘图工具的样式
import 'bpmn-js/dist/assets/diagram-js.css' // 左边工具栏以及编辑节点的样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
//End 以下为bpmn工作流绘图工具的样式

import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css' // 右边属性面板样式

import 'styles/index.scss'
import './icons'
import Crcc from '@/components/base-ui/index.js';

Crcc.forEach(component => {
    Vue.component(component.name, component);
  });
