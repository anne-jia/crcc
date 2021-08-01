
import BizObject from './views/biz-object/biz-object'

const components = [
  BizObject
]

const install = function(Vue) {
  components.forEach(component => {
    Vue.components(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install
}

export {
  BizObject
}

