import Vue from 'vue'
import Vuex from 'vuex'
import { frameworkGetters, frameworkStores } from '@linto/basic-framework'

Vue.use(Vuex)
const isDev = process.env.NODE_EVN === 'development'

export default () => {
  const store = new Vuex.Store({
    strick: isDev,
    getters: {
      ...frameworkGetters
    },
    modules: {
      ...frameworkStores
    }
  })
  return store
}
