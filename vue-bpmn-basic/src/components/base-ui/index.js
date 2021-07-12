import ElButton from './button';

import ElButtonGroup from './button-group';
import ElTooltip from './tooltip';


/* istanbul ignore next */
ElButtonGroup.install = function(Vue) {
  Vue.component(ElButtonGroup.name, ElButtonGroup);
};
/* istanbul ignore next */
ElButton.install = function(Vue) {
  Vue.component(ElButton.name, ElButton);
};
let Crcc =[ElButton,ElButtonGroup,ElTooltip]
export default Crcc;