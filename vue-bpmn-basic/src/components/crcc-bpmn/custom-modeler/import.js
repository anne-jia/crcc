import CustomModeler from './custom-modeler';

CustomModeler.install = function(Vue) {
  Vue.component(CustomModeler.name, CustomModeler);
};

export default CustomModeler;